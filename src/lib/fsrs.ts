// FSRS-4.5 spaced-repetition scheduler (Free Spaced Repetition Scheduler).
// Memory is modelled by Difficulty (1-10), Stability (days until recall
// probability drops to 90%) and Retrievability (current recall probability).
// Formulas and default weights: github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm
// Pure module (no imports) so it runs in the browser, on the server and under `node --test`.

export type Rating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export interface MemoryState {
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  lastReview: Date | null;
  due: Date;
}

const W = [
  0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461,
  2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755,
];
const DECAY = -0.5;
const FACTOR = 19 / 81;
const DAY_MS = 86_400_000;
const RELEARN_MS = 10 * 60_000; // a forgotten card comes back in 10 minutes
export const TARGET_RETENTION = 0.9;
export const MAX_INTERVAL_DAYS = 36500;

export const RATING_LABELS: Record<Rating, string> = { 1: "Again", 2: "Hard", 3: "Good", 4: "Easy" };

export function newMemoryState(now = new Date()): MemoryState {
  return { stability: 0, difficulty: 0, reps: 0, lapses: 0, lastReview: null, due: now };
}

/** Probability of recalling a card `elapsedDays` after its last review. */
export function retrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + (FACTOR * Math.max(0, elapsedDays)) / stability, DECAY);
}

/** Days until recall probability falls to `retention` (equals stability at 0.9). */
export function intervalDays(stability: number, retention = TARGET_RETENTION): number {
  const days = (stability / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
  return Math.min(MAX_INTERVAL_DAYS, Math.max(1, Math.round(days)));
}

/** Recall probability of a stored card right now (0 for cards never reviewed). */
export function currentRetrievability(state: Pick<MemoryState, "stability" | "lastReview">, now = new Date()): number {
  if (!state.lastReview) return 0;
  return retrievability((now.getTime() - state.lastReview.getTime()) / DAY_MS, state.stability);
}

const clampDifficulty = (d: number) => Math.min(10, Math.max(1, d));
const initDifficulty = (g: Rating) => clampDifficulty(W[4] - (g - 3) * W[5]);
const initStability = (g: Rating) => W[g - 1];

function nextDifficulty(d: number, g: Rating): number {
  const updated = d - W[6] * (g - 3);
  return clampDifficulty(W[7] * initDifficulty(3) + (1 - W[7]) * updated); // mean reversion
}

function recallStability(d: number, s: number, r: number, g: Rating): number {
  const hardPenalty = g === 2 ? W[15] : 1;
  const easyBonus = g === 4 ? W[16] : 1;
  return (
    s *
    (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hardPenalty * easyBonus + 1)
  );
}

function forgetStability(d: number, s: number, r: number): number {
  const next = W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r));
  return Math.min(next, s); // forgetting never increases stability
}

/** Next memory state for every rating. Intervals are forced to be ordered Hard <= Good < Easy. */
export function scheduleAll(card: MemoryState, now = new Date()): Record<Rating, MemoryState> {
  const ratings: Rating[] = [1, 2, 3, 4];
  const isNew = card.reps === 0 || card.stability <= 0;
  const elapsed = card.lastReview ? (now.getTime() - card.lastReview.getTime()) / DAY_MS : 0;
  const r = isNew ? 1 : retrievability(elapsed, card.stability);

  const stability = {} as Record<Rating, number>;
  const difficulty = {} as Record<Rating, number>;
  for (const g of ratings) {
    if (isNew) {
      stability[g] = initStability(g);
      difficulty[g] = initDifficulty(g);
    } else {
      // Stability uses the difficulty *before* this review (as in the reference implementation).
      stability[g] = g === 1 ? forgetStability(card.difficulty, card.stability, r) : recallStability(card.difficulty, card.stability, r, g);
      difficulty[g] = nextDifficulty(card.difficulty, g);
    }
  }

  let hard = intervalDays(stability[2]);
  let good = intervalDays(stability[3]);
  hard = Math.min(hard, good);
  good = Math.max(good, hard + 1);
  const easy = Math.max(intervalDays(stability[4]), good + 1);
  const days: Record<Rating, number> = { 1: 0, 2: hard, 3: good, 4: easy };

  const out = {} as Record<Rating, MemoryState>;
  for (const g of ratings) {
    out[g] = {
      stability: stability[g],
      difficulty: difficulty[g],
      reps: card.reps + 1,
      lapses: card.lapses + (g === 1 && !isNew ? 1 : 0),
      lastReview: now,
      due: new Date(now.getTime() + (g === 1 ? RELEARN_MS : days[g] * DAY_MS)),
    };
  }
  return out;
}

export function schedule(card: MemoryState, rating: Rating, now = new Date()): MemoryState {
  return scheduleAll(card, now)[rating];
}

/** Human readable interval for rating buttons, e.g. "10m", "3d", "2mo". */
export function formatInterval(from: Date, to: Date): string {
  const minutes = Math.round((to.getTime() - from.getTime()) / 60_000);
  if (minutes < 60) return `${minutes}m`;
  const days = Math.round(minutes / 1440);
  if (days < 1) return `${Math.round(minutes / 60)}h`;
  if (days < 31) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}
