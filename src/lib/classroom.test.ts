import { test } from "node:test";
import assert from "node:assert/strict";
import { buildClassInsights, generateJoinCode } from "./classroom.ts";

const DAY = 86_400_000;
const now = new Date("2026-06-15T12:00:00Z");
const ago = (days: number) => new Date(now.getTime() - days * DAY);

const members = [
  { userId: "a", name: "Asha" },
  { userId: "b", name: "Bilal" },
  { userId: "c", name: "Chen" },
];
const card = (userId: string, subject: string, stability: number, reviewedDaysAgo: number, lapses = 0) => ({
  userId, subject, front: `${subject} card for ${userId}`, stability, lastReview: ago(reviewedDaysAgo), lapses, reps: 3,
});

test("aggregates activity, recall and flags per student", () => {
  const insights = buildClassInsights(
    members,
    [card("a", "physics", 30, 1), card("a", "maths", 30, 2), card("b", "physics", 1, 20, 3)],
    [
      { userId: "a", minutes: 30, createdAt: ago(1) },
      { userId: "a", minutes: 20, createdAt: ago(3) },
      { userId: "b", minutes: 45, createdAt: ago(10) },
    ],
    [{ userId: "b", score: 0.2 }, { userId: "a", score: 1 }],
    now,
  );

  const byName = Object.fromEntries(insights.students.map((s) => [s.name, s]));
  assert.equal(byName.Asha.minutes7d, 50);
  assert.equal(byName.Asha.sessions7d, 2);
  assert.ok(byName.Asha.recall! > 0.95);
  assert.deepEqual(byName.Asha.flags, []);

  assert.ok(byName.Bilal.recall! < 0.7);
  assert.deepEqual(byName.Bilal.flags, ["Inactive for 7+ days", "Low predicted recall", "Quiz average below 50%"]);
  assert.equal(byName.Chen.recall, null);
  assert.deepEqual(byName.Chen.flags, ["Inactive for 7+ days"]);

  assert.equal(insights.students[0].name, "Bilal", "students needing attention come first");
  assert.deepEqual(insights.subjects, ["maths", "physics"]);
  assert.equal(insights.heatmap.c.physics, null);
  assert.equal(insights.subjectRecall[0].subject, "physics", "weakest subject first");
  assert.equal(insights.forgotten[0].userId, "b");
  assert.equal(insights.totals.activeThisWeek, 1);
});

test("join codes use the unambiguous alphabet", () => {
  for (let i = 0; i < 50; i++) assert.match(generateJoinCode(), /^[A-HJ-NP-Z2-9]{6}$/);
  assert.equal(generateJoinCode(() => new Uint8Array(6)), "AAAAAA");
});
