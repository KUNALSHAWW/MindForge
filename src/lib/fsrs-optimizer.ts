// Personalises FSRS-4.5 weights from a learner's own review history.
//
// Training objective (as in the reference FSRS optimizer): replay every card's reviews
// in order, predict recall probability R before each review that happens at least a day
// after the previous one, and minimise binary cross-entropy against what happened
// (rating > Again = recalled). Weights are fitted in log space with Adam on
// finite-difference gradients, pulled toward the defaults by an L2 prior so small
// histories cannot overfit, and accepted only if they improve log loss on held-out cards.
//
// Pure module: runs on the server, in `node --test` and in the evaluation script.

import { DEFAULT_WEIGHTS, retrievability, scheduleAll, updateMemory, type Rating } from "./fsrs.ts";

export interface ReviewEvent {
  cardId: string;
  rating: Rating;
  at: number; // epoch ms
}

export interface OptimizationResult {
  weights: number[];
  scoredReviews: number;
  trainCards: number;
  validationCards: number;
  defaultLoss: number; // held-out log loss with default weights
  optimizedLoss: number; // held-out log loss with fitted weights
  improved: boolean;
}

const DAY_MS = 86_400_000;
const EPS = 1e-6;
export const MIN_SCORED_REVIEWS = 100;

/** Groups events by card, each card's reviews in time order. */
function byCard(events: ReviewEvent[]): ReviewEvent[][] {
  const groups = new Map<string, ReviewEvent[]>();
  for (const e of events) {
    const list = groups.get(e.cardId);
    if (list) list.push(e);
    else groups.set(e.cardId, [e]);
  }
  return [...groups.values()].map((list) => list.sort((a, b) => a.at - b.at));
}

/** Mean binary cross-entropy of predicted recall over all reviews >= 1 day after the previous one. */
export function logLoss(cards: ReviewEvent[][], w: readonly number[]): { loss: number; count: number } {
  let total = 0;
  let count = 0;
  for (const reviews of cards) {
    let state: { stability: number; difficulty: number } | null = null;
    let last = 0;
    for (const review of reviews) {
      const elapsed = (review.at - last) / DAY_MS;
      const r = state ? retrievability(elapsed, state.stability) : 1;
      if (state && elapsed >= 1) {
        const p = Math.min(1 - EPS, Math.max(EPS, r));
        total += review.rating > 1 ? -Math.log(p) : -Math.log(1 - p);
        count++;
      }
      state = updateMemory(state, r, review.rating, w);
      last = review.at;
    }
  }
  return { loss: count ? total / count : 0, count };
}

/** Keeps weights inside the ranges where the FSRS formulas stay meaningful. */
function project(w: number[]): number[] {
  const out = w.map((v) => Math.min(100, Math.max(0.001, v)));
  out[7] = Math.min(0.75, out[7]); // mean-reversion weight
  out[15] = Math.min(1, out[15]); // "Hard" can only shorten intervals
  out[16] = Math.max(1, out[16]); // "Easy" can only lengthen them
  return out;
}

/** Deterministic split: about 1 in 5 cards (by id hash) is held out for validation. */
function isValidationCard(cardId: string): boolean {
  let h = 2166136261;
  for (let i = 0; i < cardId.length; i++) h = Math.imul(h ^ cardId.charCodeAt(i), 16777619);
  return (h >>> 0) % 5 === 0;
}

export function countScoredReviews(events: ReviewEvent[]): number {
  return logLoss(byCard(events), DEFAULT_WEIGHTS).count;
}

export function optimizeWeights(events: ReviewEvent[], options: { iterations?: number; learningRate?: number } = {}): OptimizationResult {
  const cards = byCard(events);
  let train = cards.filter((c) => !isValidationCard(c[0].cardId));
  let validation = cards.filter((c) => isValidationCard(c[0].cardId));
  if (!validation.length || !train.length) {
    // tiny histories: fall back to alternating cards so both sets exist
    train = cards.filter((_, i) => i % 5 !== 0);
    validation = cards.filter((_, i) => i % 5 === 0);
  }

  const { count } = logLoss(train, DEFAULT_WEIGHTS);
  const prior = DEFAULT_WEIGHTS.map(Math.log);
  const lambda = 2 / (count + 50); // prior strength shrinks as evidence grows
  const objective = (theta: number[]) => {
    const w = project(theta.map(Math.exp));
    const penalty = theta.reduce((sum, t, i) => sum + (t - prior[i]) ** 2, 0);
    return logLoss(train, w).loss + lambda * penalty;
  };

  // Adam in log-weight space with central finite differences.
  const iterations = options.iterations ?? 80;
  const lr = options.learningRate ?? 0.05;
  const h = 1e-3;
  let theta = [...prior];
  const m = theta.map(() => 0);
  const v = theta.map(() => 0);
  for (let step = 1; step <= iterations; step++) {
    const grad = theta.map((_, i) => {
      const up = [...theta];
      const down = [...theta];
      up[i] += h;
      down[i] -= h;
      return (objective(up) - objective(down)) / (2 * h);
    });
    theta = theta.map((t, i) => {
      m[i] = 0.9 * m[i] + 0.1 * grad[i];
      v[i] = 0.999 * v[i] + 0.001 * grad[i] ** 2;
      const mHat = m[i] / (1 - 0.9 ** step);
      const vHat = v[i] / (1 - 0.999 ** step);
      return t - (lr * mHat) / (Math.sqrt(vHat) + 1e-8);
    });
    theta = project(theta.map(Math.exp)).map(Math.log);
  }

  const weights = project(theta.map(Math.exp));
  const defaultLoss = logLoss(validation, DEFAULT_WEIGHTS).loss;
  const optimizedLoss = logLoss(validation, weights).loss;
  return {
    weights: weights.map((x) => Number(x.toFixed(4))),
    scoredReviews: logLoss(cards, DEFAULT_WEIGHTS).count,
    trainCards: train.length,
    validationCards: validation.length,
    defaultLoss,
    optimizedLoss,
    improved: optimizedLoss < defaultLoss,
  };
}

/** Small seeded PRNG (mulberry32) so simulations are reproducible. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Simulates a learner whose memory follows `trueWeights` while the app schedules
 * with `schedulerWeights` (the defaults, as for a new user). Used for tests and evaluation.
 */
export function simulateLearner(trueWeights: readonly number[], options: { cards: number; days: number; seed: number }): ReviewEvent[] {
  const random = seededRandom(options.seed);
  const events: ReviewEvent[] = [];
  const start = Date.UTC(2026, 0, 1);
  for (let c = 0; c < options.cards; c++) {
    const cardId = `card-${options.seed}-${c}`;
    let at = start + Math.floor(random() * options.days * 0.5) * DAY_MS;
    let rating = (random() < 0.7 ? 3 : random() < 0.5 ? 1 : 4) as Rating;
    let card = scheduleAll({ stability: 0, difficulty: 0, reps: 0, lapses: 0, lastReview: null, due: new Date(at) }, new Date(at))[rating];
    let truth = updateMemory(null, 1, rating, trueWeights);
    events.push({ cardId, rating, at });
    while (true) {
      const nextAt = card.due.getTime();
      if (nextAt > start + options.days * DAY_MS) break;
      const elapsed = (nextAt - at) / DAY_MS;
      const pTrue = retrievability(elapsed, truth.stability);
      const recalled = random() < pTrue;
      rating = (recalled ? (random() < 0.15 ? 2 : random() < 0.85 ? 3 : 4) : 1) as Rating;
      truth = updateMemory(truth, pTrue, rating, trueWeights);
      card = scheduleAll(card, new Date(nextAt))[rating];
      at = nextAt;
      events.push({ cardId, rating, at });
    }
  }
  return events;
}
