import prisma from "@/lib/db";
import { embed } from "@/lib/ai/embeddings";
import type { SourcePassage } from "@/lib/ai/tutor";
import { currentRetrievability } from "@/lib/fsrs";
import { chunkText, hybridSearch, type Passage } from "@/lib/retrieval";

const MAX_DOCS = 30;

/** Top passages from the learner's notes for this subject, hybrid BM25 + embedding search. */
export async function retrievePassages(userId: string, subject: string, query: string, k = 4): Promise<SourcePassage[]> {
  const docs = await prisma.rAGDocument.findMany({
    where: { userId, subject },
    orderBy: { updatedAt: "desc" },
    take: MAX_DOCS,
    select: { title: true, content: true, embeddings: true },
  });
  if (!docs.length) return [];

  const passages: (Passage & { title: string })[] = docs.flatMap((doc) => {
    let vectors: number[][] = [];
    try {
      vectors = JSON.parse(doc.embeddings);
    } catch {
      // stored before embeddings were enabled
    }
    return chunkText(doc.content).map((text, i) => ({ title: doc.title, text, embedding: vectors[i] }));
  });

  const hasVectors = passages.some((p) => p.embedding);
  const queryVector = hasVectors ? (await embed([query]))?.[0] ?? null : null;
  return hybridSearch(query, passages, queryVector, k).map((i) => ({ title: passages[i].title, text: passages[i].text }));
}

/** Fronts of this companion's cards with the lowest recall probability right now (< 85%). */
export async function fadingCards(userId: string, companionId: string, limit = 3): Promise<string[]> {
  const cards = await prisma.flashcard.findMany({
    where: { userId, companionId, reps: { gt: 0 } },
    select: { front: true, stability: true, lastReview: true },
    take: 200,
  });
  const now = new Date();
  return cards
    .map((c) => ({ front: c.front, r: currentRetrievability(c, now) }))
    .filter((c) => c.r < 0.85)
    .sort((a, b) => a.r - b.r)
    .slice(0, limit)
    .map((c) => c.front);
}
