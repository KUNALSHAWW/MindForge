import { test } from "node:test";
import assert from "node:assert/strict";
import { bm25Scores, chunkDocument, chunkText, PAGE_BREAK, cosineSimilarity, hybridSearch, reciprocalRankFusion, tokenize } from "./retrieval.ts";

test("tokenize lowercases, drops stopwords and keeps unicode letters", () => {
  assert.deepEqual(tokenize("The Mitochondria is the powerhouse of the cell!"), ["mitochondria", "powerhouse", "cell"]);
  assert.deepEqual(tokenize("Schrödinger's équation"), ["schrödinger", "équation"]);
});

test("chunkText keeps every sentence and respects the size budget", () => {
  const text = Array.from({ length: 40 }, (_, i) => `Sentence number ${i} talks about topic ${i}.`).join(" ");
  const chunks = chunkText(text, 200);
  assert.ok(chunks.length > 1);
  for (const c of chunks) assert.ok(c.length <= 260, `chunk too long: ${c.length}`);
  for (let i = 0; i < 40; i++) assert.ok(chunks.some((c) => c.includes(`number ${i} `)));
});

test("BM25 ranks the passage that matches rare query terms first", () => {
  const docs = [
    "Photosynthesis converts light energy into chemical energy in chloroplasts.",
    "Newton's second law states force equals mass times acceleration.",
    "Cells use energy from ATP produced in mitochondria.",
  ];
  const scores = bm25Scores("what does newton's second law say about force", docs);
  assert.equal(scores.indexOf(Math.max(...scores)), 1);
  assert.equal(scores[0], 0);
});

test("cosine similarity and reciprocal rank fusion", () => {
  assert.equal(cosineSimilarity([1, 0], [1, 0]), 1);
  assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
  assert.equal(cosineSimilarity([0, 0], [1, 1]), 0);
  // A passage found by both retrievers beats one found by only one of them.
  assert.deepEqual(reciprocalRankFusion([[0, 1], [1]]), [1, 0]);
});

test("hybrid search falls back to BM25 without embeddings and fuses with them", () => {
  const passages = [{ text: "osmosis water membrane", embedding: [0, 1] }, { text: "velocity acceleration force", embedding: [1, 0] }];
  assert.deepEqual(hybridSearch("force", passages, null), [1]);
  assert.deepEqual(hybridSearch("force", passages, [1, 0], 1), [1]);
});

test("chunkDocument keeps PDF page numbers and leaves plain notes unpaged", () => {
  const pdf = ["Page one is about atoms.", "Page two is about molecules.", "", "Page four covers bonds."].join(PAGE_BREAK);
  assert.deepEqual(chunkDocument(pdf).map((c) => c.page), [1, 2, 4]);
  assert.deepEqual(chunkDocument("Plain notes. No pages."), [{ text: "Plain notes. No pages.", page: null }]);
});
