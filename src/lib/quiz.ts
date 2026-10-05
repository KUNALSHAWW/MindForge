// Offline quiz engine: cloze (fill-in-the-blank) questions from the learner's notes and
// deterministic grading. Used when no LLM is configured and as the grading fallback.
// Pure module so it runs under `node --test`.

import { tokenize } from "./retrieval.ts";

// type aliases (not interfaces) so quizzes can be stored in a Prisma Json column
export type QuizSource = {
  title: string;
  text: string;
};

export type QuizQuestion = {
  question: string;
  answer: string;
  kind: "cloze" | "open";
  source: QuizSource;
};

export type Grade = {
  score: 0 | 0.5 | 1;
  feedback: string;
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return row[b.length];
}

/**
 * Cloze questions: in sentences of a useful length, blank out the rarest meaningful word
 * (highest inverse document frequency across all sentences), which is usually the key term.
 */
export function makeClozeQuestions(sources: QuizSource[], count: number, seed = 1): QuizQuestion[] {
  const sentences = sources.flatMap((source) =>
    (source.text.match(/[^.!?]+[.!?]/g) ?? [])
      .map((s) => s.trim())
      .filter((s) => s.length >= 40 && s.length <= 280)
      .map((text) => ({ text, source })),
  );
  if (!sentences.length) return [];

  const docFreq = new Map<string, number>();
  for (const s of sentences) for (const t of new Set(tokenize(s.text))) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);

  // Deterministic shuffle so the same seed gives the same quiz.
  let state = seed >>> 0 || 1;
  const random = () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
  const order = sentences.map((s, i) => ({ s, k: random(), i })).sort((a, b) => a.k - b.k);

  const questions: QuizQuestion[] = [];
  const usedAnswers = new Set<string>();
  for (const { s } of order) {
    if (questions.length >= count) break;
    const candidates = [...new Set(tokenize(s.text))].filter((t) => t.length >= 4 && !/^\d+$/.test(t) && !usedAnswers.has(t));
    if (!candidates.length) continue;
    const term = candidates.sort((a, b) => (docFreq.get(a) ?? 0) - (docFreq.get(b) ?? 0) || b.length - a.length)[0];
    const match = s.text.match(new RegExp(`(?<![\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "iu"));
    if (!match) continue;
    usedAnswers.add(term);
    questions.push({
      question: `Fill in the blank: ${s.text.replace(match[0], "_____")}`,
      answer: match[0],
      kind: "cloze",
      source: { title: s.source.title, text: s.text },
    });
  }
  return questions;
}

/** Cloze grading: exact after normalisation, or one typo allowed for words of 5+ letters. */
export function gradeCloze(expected: string, given: string): Grade {
  const a = normalize(expected);
  const b = normalize(given);
  if (!b) return { score: 0, feedback: `The answer was "${expected}".` };
  if (a === b) return { score: 1, feedback: "Correct." };
  if (a.length >= 5 && editDistance(a, b) <= 1) return { score: 1, feedback: `Correct (watch the spelling: "${expected}").` };
  return { score: 0, feedback: `Not quite. The answer was "${expected}".` };
}

/**
 * Fallback grading for open questions without an LLM: how many of the reference
 * answer's key terms the learner recalled (token recall, ignoring stopwords).
 */
export function gradeByOverlap(reference: string, given: string): Grade {
  const ref = new Set(tokenize(reference));
  const got = new Set(tokenize(given));
  if (!ref.size) return { score: 0, feedback: "Could not grade this answer automatically." };
  const recall = [...ref].filter((t) => got.has(t)).length / ref.size;
  if (recall >= 0.6) return { score: 1, feedback: "Correct: you covered the key ideas." };
  if (recall >= 0.3) return { score: 0.5, feedback: `Partly right. A complete answer: ${reference}` };
  return { score: 0, feedback: `Not quite. A complete answer: ${reference}` };
}
