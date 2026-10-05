import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeByOverlap, gradeCloze, makeClozeQuestions } from "./quiz.ts";

const notes = [
  {
    title: "Cell biology",
    text:
      "Mitochondria produce most of the cell's ATP through oxidative phosphorylation. " +
      "The nucleus stores the cell's genetic material and controls gene expression. " +
      "Ribosomes translate messenger RNA into chains of amino acids called proteins.",
  },
];

test("cloze questions blank a distinctive term and keep their source", () => {
  const questions = makeClozeQuestions(notes, 3, 7);
  assert.equal(questions.length, 3);
  for (const q of questions) {
    assert.ok(q.question.includes("_____"));
    assert.ok(!q.question.toLowerCase().includes(` ${q.answer.toLowerCase()} `), "answer must not leak into the question");
    assert.ok(q.source.text.includes(q.answer));
    assert.ok(q.answer.length >= 4);
  }
  assert.equal(new Set(questions.map((q) => q.answer.toLowerCase())).size, 3, "no repeated answers");
  assert.deepEqual(makeClozeQuestions(notes, 3, 7), questions, "same seed, same quiz");
});

test("cloze grading accepts case, accents and one typo but not wrong words", () => {
  assert.equal(gradeCloze("Mitochondria", "mitochondria").score, 1);
  assert.equal(gradeCloze("Mitochondria", "mitocondria").score, 1);
  assert.equal(gradeCloze("Schrödinger", "schrodinger").score, 1);
  assert.equal(gradeCloze("nucleus", "ribosome").score, 0);
  assert.equal(gradeCloze("nucleus", "  ").score, 0);
});

test("overlap grading gives full, partial and no credit", () => {
  const reference = "Ribosomes translate messenger RNA into proteins";
  assert.equal(gradeByOverlap(reference, "they translate messenger RNA to make proteins").score, 1);
  assert.equal(gradeByOverlap(reference, "something with RNA and proteins").score, 0.5);
  assert.equal(gradeByOverlap(reference, "they store DNA").score, 0);
});
