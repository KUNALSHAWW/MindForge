import { test } from "node:test";
import assert from "node:assert/strict";
import { currentRetrievability, intervalDays, newMemoryState, retrievability, schedule, scheduleAll, type Rating } from "./fsrs.ts";

const DAY = 86_400_000;
const t0 = new Date("2026-01-01T09:00:00Z");

test("retrievability is 90% after exactly S days and decays monotonically", () => {
  assert.equal(retrievability(0, 5), 1);
  assert.ok(Math.abs(retrievability(5, 5) - 0.9) < 1e-12);
  assert.ok(retrievability(10, 5) < retrievability(5, 5));
  assert.equal(intervalDays(12), 12);
});

test("first review uses FSRS-4.5 initial stability and difficulty", () => {
  const good = schedule(newMemoryState(t0), 3, t0);
  assert.equal(good.stability, 3.7145);
  assert.equal(good.difficulty, 5.1618);
  assert.equal(good.reps, 1);
  assert.equal(good.due.getTime(), t0.getTime() + 4 * DAY);

  const again = schedule(newMemoryState(t0), 1, t0);
  assert.equal(again.lapses, 0, "failing a brand new card is not a lapse");
  assert.equal(again.due.getTime() - t0.getTime(), 10 * 60_000);
});

test("intervals are ordered Again < Hard <= Good < Easy", () => {
  let card = schedule(newMemoryState(t0), 3, t0);
  for (let i = 0; i < 5; i++) {
    const now = card.due;
    const next = scheduleAll(card, now);
    const days = ([1, 2, 3, 4] as Rating[]).map((g) => next[g].due.getTime() - now.getTime());
    assert.ok(days[0] < days[1] && days[1] <= days[2] && days[2] < days[3], `review ${i}: ${days}`);
    card = next[3];
  }
});

test("successful recall grows stability; a lapse shrinks it and counts", () => {
  const learned = schedule(newMemoryState(t0), 3, t0);
  const now = learned.due;
  const recalled = schedule(learned, 3, now);
  const forgot = schedule(learned, 1, now);
  assert.ok(recalled.stability > learned.stability);
  assert.ok(forgot.stability <= learned.stability);
  assert.equal(forgot.lapses, 1);
  for (const s of [recalled, forgot]) assert.ok(s.difficulty >= 1 && s.difficulty <= 10);
});

test("difficulty stays within [1, 10] under repeated extreme ratings", () => {
  let easy = schedule(newMemoryState(t0), 4, t0);
  let hard = schedule(newMemoryState(t0), 1, t0);
  for (let i = 0; i < 30; i++) {
    easy = schedule(easy, 4, easy.due);
    hard = schedule(hard, 1, hard.due);
  }
  assert.ok(easy.difficulty >= 1 && hard.difficulty <= 10);
});

test("unreviewed cards have zero retrievability", () => {
  assert.equal(currentRetrievability(newMemoryState(t0), t0), 0);
});
