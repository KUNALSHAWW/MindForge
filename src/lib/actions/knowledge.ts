"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { embed, isEmbeddingConfigured } from "@/lib/ai/embeddings";
import { rateLimit } from "@/lib/rate-limit";
import { chunkDocument, PAGE_BREAK } from "@/lib/retrieval";
import { CreateDocumentSchema, MAX_DOCUMENT_CHARS, MAX_PDF_BYTES, firstError } from "@/lib/validators";

const MAX_EMBEDDED_CHUNKS = 400;

export interface DocumentSummary {
  id: string;
  title: string;
  subject: string;
  characters: number;
  chunks: number;
  pages: number | null;
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
          chunks: chunkDocument(d.content).length,
          pages: d.content.includes(PAGE_BREAK) ? d.content.split(PAGE_BREAK).length : null,
          embedded: d.embeddings.length > 2,
          createdAt: d.createdAt,
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
    const chunks = chunkDocument(parsed.data.content);
    const vectors = await embed(chunks.slice(0, MAX_EMBEDDED_CHUNKS).map((c) => c.text));
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

/**
 * Extracts the text layer of an uploaded PDF page by page (pages joined with PAGE_BREAK
 * so answers can cite page numbers) and stores it like any other notes.
 */
export async function createDocumentFromPdf(formData: FormData): Promise<Result<{ id: string; chunks: number; embedded: boolean; pages: number }>> {
  const file = formData.get("file");
  if (!(file instanceof File)) return { success: false, error: "Choose a PDF file" };
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) return { success: false, error: "That file is not a PDF" };
  if (file.size > MAX_PDF_BYTES) return { success: false, error: "PDFs are limited to 10 MB" };

  let pages: string[];
  try {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
    pages = (await extractText(pdf, { mergePages: false })).text.map((p) => p.replace(/[ \t]+/g, " ").trim());
  } catch (error) {
    console.error("PDF extraction failed:", error);
    return { success: false, error: "Could not read this PDF. Is it password protected?" };
  }

  if (pages.join("").trim().length < 10) {
    return { success: false, error: "This PDF has no selectable text (it may be a scan). Paste the text instead." };
  }
  let content = pages.join(PAGE_BREAK);
  if (content.length > MAX_DOCUMENT_CHARS) content = content.slice(0, MAX_DOCUMENT_CHARS);

  const result = await createDocument({
    title: String(formData.get("title") || file.name.replace(/\.pdf$/i, "")).slice(0, 200),
    subject: String(formData.get("subject") ?? ""),
    content,
  });
  return result.success ? { success: true, data: { ...result.data, pages: content.split(PAGE_BREAK).length } } : result;
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
