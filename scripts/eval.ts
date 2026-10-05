// Reproducible evaluation of MindForge's two core algorithms.
//   npm run eval            (needs network once; data is cached in .cache/)
//
// 1. Retrieval: SQuAD v1.1 validation questions must retrieve their source paragraph from a
//    pool of distractor paragraphs, using the same chunker and ranking code as the app.
// 2. Memory model: simulated learners whose memory differs from the FSRS defaults;
//    personalised weights vs defaults on held-out cards.
//
// Writes docs/EVALUATION.md.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { DEFAULT_WEIGHTS } from "../src/lib/fsrs.ts";
import { optimizeWeights, seededRandom, simulateLearner } from "../src/lib/fsrs-optimizer.ts";
import { bm25Scores, chunkText, cosineSimilarity, rankIndices, reciprocalRankFusion, tokenize } from "../src/lib/retrieval.ts";

interface Row {
  question: string;
  context: string;
}

const CACHE = ".cache/squad-validation-sample.json";

async function loadSquad(): Promise<Row[]> {
  if (existsSync(CACHE)) return JSON.parse(readFileSync(CACHE, "utf8"));
  const rows: Row[] = [];
  // 21 slices of 100 rows spread across the 10,570-question validation split.
  for (let offset = 0; offset <= 10_000; offset += 500) {
    const url = `https://datasets-server.huggingface.co/rows?dataset=rajpurkar/squad&config=plain_text&split=validation&offset=${offset}&length=100`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`SQuAD download failed (${res.status})`);
    const json = (await res.json()) as { rows: { row: Row }[] };
    rows.push(...json.rows.map((r) => ({ question: r.row.question, context: r.row.context })));
  }
  mkdirSync(".cache", { recursive: true });
  writeFileSync(CACHE, JSON.stringify(rows));
  return rows;
}

async function embedAll(texts: string[]): Promise<number[][] | null> {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key) return null;
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += 32) {
    const res = await fetch("https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5/pipeline/feature-extraction", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: texts.slice(i, i + 32), normalize: true }),
    });
    if (!res.ok) throw new Error(`embedding failed (${res.status})`);
    out.push(...((await res.json()) as number[][]));
  }
  return out;
}

type Ranker = (qi: number) => number[];

function evaluate(name: string, rows: Row[], chunkOwner: number[], contextOf: number[], rank: Ranker) {
  let hit1 = 0;
  let hit4 = 0;
  let rr = 0;
  rows.forEach((_, qi) => {
    const ranked = rank(qi).map((chunk) => chunkOwner[chunk]);
    const seen: number[] = [];
    for (const c of ranked) if (!seen.includes(c)) seen.push(c); // rank of paragraphs, not chunks
    const pos = seen.indexOf(contextOf[qi]);
    if (pos === 0) hit1++;
    if (pos >= 0 && pos < 4) hit4++;
    if (pos >= 0 && pos < 10) rr += 1 / (pos + 1);
  });
  const n = rows.length;
  return { name, hit1: hit1 / n, hit4: hit4 / n, mrr: rr / n };
}

async function retrievalEval() {
  const rows = await loadSquad();
  const contexts = [...new Set(rows.map((r) => r.context))];
  const contextIndex = new Map(contexts.map((c, i) => [c, i]));
  const chunks: string[] = [];
  const chunkOwner: number[] = [];
  contexts.forEach((c, i) => chunkText(c).forEach((t) => (chunks.push(t), chunkOwner.push(i))));
  const contextOf = rows.map((r) => contextIndex.get(r.context)!);

  const random = seededRandom(1);
  const results = [
    evaluate("Random ranking", rows, chunkOwner, contextOf, () => chunks.map((_, i) => ({ i, k: random() })).sort((a, b) => a.k - b.k).map((x) => x.i)),
    evaluate("Word overlap (no IDF, no length norm)", rows, chunkOwner, contextOf, (qi) => {
      const q = new Set(tokenize(rows[qi].question));
      return rankIndices(chunks.map((c) => tokenize(c).filter((t) => q.has(t)).length));
    }),
    evaluate("BM25 (MindForge default)", rows, chunkOwner, contextOf, (qi) => rankIndices(bm25Scores(rows[qi].question, chunks))),
  ];

  const chunkVectors = await embedAll(chunks).catch((e) => (console.warn(String(e)), null));
  const questionVectors = chunkVectors ? await embedAll(rows.map((r) => r.question)).catch(() => null) : null;
  if (chunkVectors && questionVectors) {
    results.push(
      evaluate("Embeddings only (bge-small-en-v1.5)", rows, chunkOwner, contextOf, (qi) => rankIndices(chunkVectors.map((v) => cosineSimilarity(questionVectors[qi], v)))),
      evaluate("Hybrid BM25 + embeddings (RRF)", rows, chunkOwner, contextOf, (qi) =>
        reciprocalRankFusion([rankIndices(bm25Scores(rows[qi].question, chunks)), rankIndices(chunkVectors.map((v) => cosineSimilarity(questionVectors[qi], v)))]),
      ),
    );
  }
  return { questions: rows.length, paragraphs: contexts.length, chunks: chunks.length, results, embeddings: !!chunkVectors };
}

function memoryEval() {
  const learners = 40;
  const outcomes = [];
  for (let seed = 1; seed <= learners; seed++) {
    const random = seededRandom(seed * 7919);
    // Box-Muller normal noise: each learner's memory differs from the population defaults.
    const noise = () => Math.sqrt(-2 * Math.log(random() || 1e-9)) * Math.cos(2 * Math.PI * random());
    const truth = DEFAULT_WEIGHTS.map((w, i) => ([0, 1, 2, 3, 8, 11].includes(i) ? w * Math.exp(0.5 * noise()) : w));
    const events = simulateLearner(truth, { cards: 150, days: 180, seed });
    const r = optimizeWeights(events, { iterations: 60 });
    outcomes.push(r);
  }
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  return {
    learners,
    reviewsPerLearner: Math.round(mean(outcomes.map((o) => o.scoredReviews))),
    defaultLoss: mean(outcomes.map((o) => o.defaultLoss)),
    optimizedLoss: mean(outcomes.map((o) => o.optimizedLoss)),
    improvedShare: outcomes.filter((o) => o.improved).length / learners,
    medianGain: outcomes.map((o) => 1 - o.optimizedLoss / o.defaultLoss).sort((a, b) => a - b)[Math.floor(learners / 2)],
  };
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

const started = Date.now();
const retrieval = await retrievalEval();
const memory = memoryEval();

const report = `# Evaluation

Generated by \`npm run eval\` (scripts/eval.ts) on ${new Date().toISOString().slice(0, 10)}. Every number below is reproducible: the
retrieval sample is cached in \`.cache/\` and the learner simulation is seeded.

## 1. Retrieval: finding the right passage in your notes

**Setup.** ${retrieval.questions.toLocaleString()} questions from the SQuAD v1.1 validation split (21 evenly spaced slices of 100).
Each question must retrieve its own source paragraph from a pool of **${retrieval.paragraphs} paragraphs**
(${retrieval.chunks} chunks after MindForge's sentence-aware chunker), so every other paragraph is a distractor.
Ranking uses the exact functions the tutor uses at answer time (\`src/lib/retrieval.ts\`).

| Method | Hit@1 | Hit@4 (passages given to the tutor) | MRR@10 |
|--------|------:|------:|------:|
${retrieval.results.map((r) => `| ${r.name} | ${pct(r.hit1)} | ${pct(r.hit4)} | ${r.mrr.toFixed(3)} |`).join("\n")}

${retrieval.embeddings ? "" : "_Embedding and hybrid rows appear when the script runs with `HUGGINGFACE_API_KEY` set._\n"}
## 2. Memory model: personalised FSRS vs defaults

**Setup.** ${memory.learners} simulated learners whose true memory parameters (initial stability for each rating,
recall growth and lapse stability) are drawn around the FSRS-4.5 defaults with log-normal noise (sigma = 0.5).
Each studies 150 cards for 180 days while the app schedules them with the default weights
(about ${memory.reviewsPerLearner} scored reviews each). The optimizer (\`src/lib/fsrs-optimizer.ts\`) fits weights on 80% of
a learner's cards; the metric is recall-prediction log loss on the held-out 20%.

| Model | Mean held-out log loss |
|-------|-----:|
| FSRS-4.5 defaults | ${memory.defaultLoss.toFixed(4)} |
| Personalised weights | ${memory.optimizedLoss.toFixed(4)} |

- Personalisation lowered held-out log loss for **${pct(memory.improvedShare)}** of learners; median relative improvement **${pct(memory.medianGain)}**.
- In the app, fitted weights are saved only when they beat the defaults on that learner's held-out cards.

## Limitations

- SQuAD paragraphs are Wikipedia text, not student notes, and the distractor pool is a few hundred paragraphs.
- The memory study uses simulated learners whose memory follows the FSRS model family, which favours an FSRS-based optimizer.
  Real review logs are noisier; that is why the app validates on held-out cards before switching.

_Runtime: ${((Date.now() - started) / 1000).toFixed(1)} s._
`;

mkdirSync("docs", { recursive: true });
writeFileSync("docs/EVALUATION.md", report);
console.log(report);
