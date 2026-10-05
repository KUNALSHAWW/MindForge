import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ACHIEVEMENTS,
  calculateLevel,
  calculateXP,
  dayKey,
  levelProgress,
  newlyUnlocked,
  nextMilestone,
  nextStreak,
  type AchievementStats,
} from "./gamification.ts";

const zero: AchievementStats = {
  sessions: 0, streak: 0, xp: 0, longestSession: 0, totalMinutes: 0,
  companionsUsed: 0, companionsCreated: 0, bookmarks: 0, reviews: 0,
};

test("XP: 3 per minute with a 10% per streak-day bonus capped at 2x", () => {
  assert.equal(calculateXP(10, 0), 30);
  assert.equal(calculateXP(10, 1), 33);
  assert.equal(calculateXP(10, 5), 45);
  assert.equal(calculateXP(10, 50), 60);
});

test("levels: one per 1,000 XP starting at 1", () => {
  assert.equal(calculateLevel(0), 1);
  assert.equal(calculateLevel(999), 1);
  assert.equal(calculateLevel(1000), 2);
  assert.deepEqual(levelProgress(3450), { level: 4, progress: 45, xpToNext: 550 });
});

test("streaks follow the learner's calendar day, not the server's", () => {
  const tz = "Asia/Kolkata";
  // 23:30 IST on Jan 1 and 00:30 IST on Jan 2 are consecutive local days, same UTC day.
  const late = new Date("2026-01-01T18:00:00Z");
  const early = new Date("2026-01-01T19:00:00Z");
  assert.equal(dayKey(late, tz), "2026-01-01");
  assert.equal(dayKey(early, tz), "2026-01-02");
  assert.equal(nextStreak(4, late, early, tz), 5);
  assert.equal(nextStreak(4, late, early, "UTC"), 4);
});

test("streaks: same day holds, next day extends, gap resets, first session starts at 1", () => {
  const d = (s: string) => new Date(`${s}T12:00:00Z`);
  assert.equal(nextStreak(0, null, d("2026-03-01")), 1);
  assert.equal(nextStreak(3, d("2026-03-01"), d("2026-03-01")), 3);
  assert.equal(nextStreak(3, d("2026-03-01"), d("2026-03-02")), 4);
  assert.equal(nextStreak(3, d("2026-03-01"), d("2026-03-04")), 1);
  assert.equal(nextStreak(9, d("2026-02-28"), d("2026-03-01")), 10, "month boundary");
});

test("every achievement is reachable and titles are unique", () => {
  assert.equal(new Set(ACHIEVEMENTS.map((a) => a.title)).size, ACHIEVEMENTS.length);
  const maxed = Object.fromEntries(Object.keys(zero).map((k) => [k, 1e9])) as AchievementStats;
  assert.equal(newlyUnlocked(maxed, []).length, ACHIEVEMENTS.length);
});

test("achievements unlock once at their threshold", () => {
  const stats = { ...zero, sessions: 5, streak: 3, companionsCreated: 1, longestSession: 31 };
  const titles = newlyUnlocked(stats, []).map((a) => a.title);
  assert.deepEqual(titles.sort(), ["3-Day Streak", "Creator", "First Steps", "Focus Mode", "Getting Started"]);
  assert.deepEqual(newlyUnlocked(stats, titles), []);
});

test("next milestone per metric", () => {
  assert.equal(nextMilestone("sessions", 0), 1);
  assert.equal(nextMilestone("sessions", 7), 10);
  assert.equal(nextMilestone("totalMinutes", 100), 600);
  assert.equal(nextMilestone("sessions", 100), null);
});
