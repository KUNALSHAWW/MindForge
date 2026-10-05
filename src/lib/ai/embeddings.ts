// Sentence embeddings through Hugging Face Inference Providers (hf-inference feature extraction).
// Optional: without HUGGINGFACE_API_KEY retrieval runs on BM25 alone.

const MODEL = process.env.EMBEDDING_MODEL ?? "BAAI/bge-small-en-v1.5";
const KEY = process.env.HUGGINGFACE_API_KEY ?? "";
const BATCH = 32;

export function isEmbeddingConfigured(): boolean {
  return KEY.length > 0;
}

/** One vector per input, or null when embeddings are unavailable (never throws). */
export async function embed(texts: string[]): Promise<number[][] | null> {
  if (!KEY || texts.length === 0) return null;
  try {
    const vectors: number[][] = [];
    for (let i = 0; i < texts.length; i += BATCH) {
      const res = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}/pipeline/feature-extraction`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: texts.slice(i, i + BATCH), normalize: true }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) throw new Error(`embedding request failed (${res.status})`);
      const batch = (await res.json()) as number[][];
      if (!Array.isArray(batch) || !Array.isArray(batch[0])) throw new Error("unexpected embedding shape");
      vectors.push(...batch);
    }
    return vectors;
  } catch (error) {
    console.warn("Embeddings unavailable, falling back to BM25:", error);
    return null;
  }
}
