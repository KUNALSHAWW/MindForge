"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { embed, isEmbeddingConfigured } from "@/lib/ai/embeddings";
import { rateLimit } from "@/lib/rate-limit";
import { chunkText } from "@/lib/retrieval";
import { CreateDocumentSchema, firstError } from "@/lib/validators";

export interface DocumentSummary {
  id: string;
  title: string;
  subject: string;
  characters: number;
  chunks: number;
  embedded: boolean;
  createdAt: Date;
}

type Result<T> = { success: true; data: T } | { success: false; error: string };

export async function listDocuments(): Promise<Result<{ documents: DocumentSummary[]; demo: boolean; semantic: boolean }>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  try {
    if (!(await isDatabaseAvailable())) return { success: true, data: { documents: [], demo: true, semantic: isEmbeddingConfigured() } };
    const user = await ensureUser(clerkUser);
    const docs = await prisma.rAGDocument.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, subject: true, content: true, embeddings: true, createdAt: true },
    });
    return {
      success: true,
      data: {
        demo: false,
        semantic: isEmbeddingConfigured(),
        documents: docs.map((d) => ({
          id: d.id, title: d.title, subject: d.subject, characters: d.content.length,
          chunks: chunkText(d.content).length, embedded: d.embeddings.length > 2, createdAt: d.createdAt,
        })),
      },
    };
  } catch (error) {
    console.error("Error listing documents:", error);
    return { success: false, error: "Failed to load your notes" };
  }
}

/** Stores notes and, when configured, one embedding per chunk for semantic retrieval. */
export async function createDocument(input: { title: string; content: string; subject: string }): Promise<Result<{ id: string; chunks: number; embedded: boolean }>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  const parsed = CreateDocumentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };
  if (!(await isDatabaseAvailable())) return { success: false, error: "Notes need a database (DATABASE_URL) to be saved" };

  const limit = await rateLimit("documents", clerkUser.id, 20, 3600);
  if (!limit.success) return { success: false, error: `Upload limit reached, try again in ${Math.ceil(limit.retryAfterSeconds / 60)} min` };

  try {
    const user = await ensureUser(clerkUser);
    const chunks = chunkText(parsed.data.content);
    const vectors = await embed(chunks);
    const doc = await prisma.rAGDocument.create({
      data: { ...parsed.data, userId: user.id, embeddings: JSON.stringify(vectors ?? []) },
    });
    revalidatePath("/forge");
    return { success: true, data: { id: doc.id, chunks: chunks.length, embedded: vectors !== null } };
  } catch (error) {
    console.error("Error saving document:", error);
    return { success: false, error: "Failed to save notes" };
  }
}

export async function deleteDocument(id: string): Promise<Result<null>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  try {
    const { count } = await prisma.rAGDocument.deleteMany({ where: { id, user: { clerkId: clerkUser.id } } });
    if (!count) return { success: false, error: "Document not found" };
    revalidatePath("/forge");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, error: "Failed to delete notes" };
  }
}
