import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_WEIGHTS } from "./fsrs.ts";
import { countScoredReviews, logLoss, optimizeWeights, simulateLearner } from "./fsrs-optimizer.ts";

// A learner who forgets much faster than the FSRS defaults assume.
const fastForgetter = DEFAULT_WEIGHTS.map((w, i) => (i <= 3 ? w * 0.25 : i === 8 ? w * 0.7 : w));

test("simulated history is deterministic and has scored reviews", () => {
  const a = simulateLearner(fastForgetter, { cards: 60, days: 120, seed: 7 });
  const b = simulateLearner(fastForgetter, { cards: 60, days: 120, seed: 7 });
  assert.deepEqual(a, b);
  assert.ok(countScoredReviews(a) > 100);
});

test("personalised weights beat the defaults on held-out cards for a fast forgetter", () => {
  const events = simulateLearner(fastForgetter, { cards: 150, days: 180, seed: 42 });
  const result = optimizeWeights(events, { iterations: 40 });
  assert.ok(result.improved, `default ${result.defaultLoss} vs optimised ${result.optimizedLoss}`);
  assert.ok(result.optimizedLoss < result.defaultLoss * 0.97);
  // It should learn that initial stability is lower than the default.
  assert.ok(result.weights[2] < DEFAULT_WEIGHTS[2]);
});

test("log loss with the true weights is lower than with the defaults", () => {
  const events = simulateLearner(fastForgetter, { cards: 80, days: 120, seed: 3 });
  const groups = new Map<string, typeof events>();
  for (const e of events) groups.set(e.cardId, [...(groups.get(e.cardId) ?? []), e]);
  const grouped = [...groups.values()];
  assert.ok(logLoss(grouped, fastForgetter).loss < logLoss(grouped, DEFAULT_WEIGHTS).loss);
});
