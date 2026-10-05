// Hybrid retrieval over a learner's notes: Okapi BM25 (lexical) fused with
// embedding cosine similarity (semantic) through Reciprocal Rank Fusion.
// BM25 needs no API key, so retrieval keeps working when embeddings are off.
// Pure module (no imports) so it runs under `node --test`.

const STOPWORDS = new Set(
  "a an and are as at be but by for from has have how i in is it its of on or that the this to was were what when where which who why will with you your".split(" "),
);

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/**
 * Split text into ~`size` character chunks on paragraph, then sentence boundaries,
 * carrying the last sentence over as overlap so ideas are not cut in half.
 */
export function chunkText(text: string, size = 800): string[] {
  const sentences = text
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .flatMap((p) => p.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]*\s*/g) ?? [])
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current: string[] = [];
  let length = 0;
  for (const sentence of sentences) {
    if (length + sentence.length > size && current.length) {
      chunks.push(current.join(" "));
      const overlap = current[current.length - 1];
      current = overlap.length < size / 2 ? [overlap] : [];
      length = current.join(" ").length;
    }
    current.push(sentence);
    length += sentence.length + 1;
  }
  if (current.length) chunks.push(current.join(" "));
  return chunks;
}

/** Okapi BM25 scores of `query` against every document (k1 = 1.5, b = 0.75). */
export function bm25Scores(query: string, documents: string[], k1 = 1.5, b = 0.75): number[] {
  const docs = documents.map(tokenize);
  const n = docs.length;
  if (!n) return [];
  const avgLength = docs.reduce((sum, d) => sum + d.length, 0) / n || 1;
  const docFreq = new Map<string, number>();
  for (const doc of docs) for (const term of new Set(doc)) docFreq.set(term, (docFreq.get(term) ?? 0) + 1);

  const terms = [...new Set(tokenize(query))];
  return docs.map((doc) => {
    const tf = new Map<string, number>();
    for (const term of doc) tf.set(term, (tf.get(term) ?? 0) + 1);
    let score = 0;
    for (const term of terms) {
      const f = tf.get(term);
      if (!f) continue;
      const df = docFreq.get(term) ?? 0;
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * doc.length) / avgLength));
    }
    return score;
  });
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA && normB ? dot / Math.sqrt(normA * normB) : 0;
}

/** Indices sorted by descending score, dropping non-positive scores. */
export function rankIndices(scores: number[]): number[] {
  return scores
    .map((score, index) => ({ score, index }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.index);
}

/** Reciprocal Rank Fusion: score(d) = sum over rankings of 1 / (k + rank(d)). */
export function reciprocalRankFusion(rankings: number[][], k = 60): number[] {
  const fused = new Map<number, number>();
  for (const ranking of rankings) {
    ranking.forEach((index, rank) => fused.set(index, (fused.get(index) ?? 0) + 1 / (k + rank + 1)));
  }
  return [...fused.entries()].sort((a, b) => b[1] - a[1]).map(([index]) => index);
}

export interface Passage {
  text: string;
  embedding?: number[];
}

/** Top `k` passage indices for a query, hybrid when embeddings are available. */
export function hybridSearch(query: string, passages: Passage[], queryEmbedding: number[] | null, k = 4): number[] {
  const lexical = rankIndices(bm25Scores(query, passages.map((p) => p.text)));
  if (!queryEmbedding) return lexical.slice(0, k);
  const semantic = rankIndices(passages.map((p) => (p.embedding ? cosineSimilarity(queryEmbedding, p.embedding) : 0)));
  return reciprocalRankFusion([lexical, semantic]).slice(0, k);
}
