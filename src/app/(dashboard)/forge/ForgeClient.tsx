"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Trash2, Upload, X } from "lucide-react";
import { createDocument, createDocumentFromPdf, deleteDocument, type DocumentSummary } from "@/lib/actions/knowledge";
import { SUBJECTS, subjectIcon, subjectLabel } from "@/lib/subjects";
import { MAX_DOCUMENT_CHARS, MAX_PDF_BYTES } from "@/lib/validators";

const MAX_CHARS = MAX_DOCUMENT_CHARS;
const field = "w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]";

export default function ForgeClient({ documents, demo, semantic }: { documents: DocumentSummary[]; demo: boolean; semantic: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0].value);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [pdf, setPdf] = useState<File | null>(null);

  async function loadFile(file: File) {
    if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") {
      if (file.size > MAX_PDF_BYTES) return toast.error("PDFs are limited to 10 MB");
      setPdf(file);
      setContent("");
      if (!title) setTitle(file.name.replace(/\.pdf$/i, ""));
      return;
    }
    if (!/\.(txt|md|markdown|csv)$/i.test(file.name)) return toast.error("Upload a PDF, .txt or .md file, or paste the text");
    setPdf(null);
    const text = await file.text();
    if (text.length > MAX_CHARS) toast.warning(`Only the first ${MAX_CHARS.toLocaleString()} characters will be used`);
    setContent(text.slice(0, MAX_CHARS));
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    let result;
    if (pdf) {
      const form = new FormData();
      form.set("file", pdf);
      form.set("title", title);
      form.set("subject", subject);
      result = await createDocumentFromPdf(form);
    } else {
      result = await createDocument({ title, subject, content });
    }
    setSaving(false);
    if (!result.success) return toast.error(result.error);
    toast.success(`Saved as ${result.data.chunks} searchable passages${result.data.embedded ? " with semantic embeddings" : ""}`);
    setTitle("");
    setContent("");
    setPdf(null);
    router.refresh();
  }

  async function remove(doc: DocumentSummary) {
    if (!confirm(`Delete "${doc.title}"?`)) return;
    const result = await deleteDocument(doc.id);
    if (!result.success) return toast.error(result.error);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-[hsl(var(--foreground-muted))]">
        Retrieval mode: <strong>{semantic ? "hybrid (BM25 keyword + semantic embeddings, fused with reciprocal rank fusion)" : "BM25 keyword search"}</strong>
        {!semantic && " · add HUGGINGFACE_API_KEY to enable semantic search"}
      </p>

      <form
        onSubmit={submit}
        className="card p-6 space-y-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) loadFile(file);
        }}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} placeholder="Chapter 5: Laws of Motion" className={`${field} mt-1`} />
          </label>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
            Subject
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={`${field} mt-1`}>
              {SUBJECTS.map((s) => (
                <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
              ))}
            </select>
          </label>
        </div>
        {pdf ? (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--primary)/0.04)] text-sm">
            <FileText className="w-5 h-5 shrink-0 text-[hsl(var(--primary))]" />
            <span className="flex-1 min-w-0 truncate text-[hsl(var(--foreground))]">
              {pdf.name} · {(pdf.size / 1024 / 1024).toFixed(1)} MB · text is extracted page by page so answers can cite page numbers
            </span>
            <button type="button" onClick={() => setPdf(null)} aria-label="Remove PDF" className="p-1 rounded hover:bg-[hsl(var(--muted))]">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
            Notes
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              maxLength={MAX_CHARS}
              placeholder="Paste your notes here, or drop a PDF / .txt / .md file onto this card"
              className={`${field} mt-1 font-mono text-sm`}
            />
          </label>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-[hsl(var(--primary))] cursor-pointer hover:underline">
            <Upload className="w-4 h-4" />
            Choose a PDF or text file
            <input
              type="file"
              accept=".pdf,.txt,.md,.markdown,.csv,application/pdf,text/plain,text/markdown"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
            />
          </label>
          {!pdf && <span className="text-xs text-[hsl(var(--foreground-muted))] tabular-nums">{content.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}</span>}
          <button type="submit" disabled={saving || demo} className="px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium disabled:opacity-50">
            {saving ? "Indexing…" : "Add to knowledge base"}
          </button>
        </div>
        {demo && <p className="text-xs text-[hsl(var(--foreground-muted))]">Demo mode: connect a database to save notes.</p>}
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Your notes ({documents.length})</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-[hsl(var(--foreground-muted))]">Nothing here yet. Tutors answer from general knowledge until you add notes for their subject.</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="card p-4 flex items-center gap-4">
              <span className="text-2xl" aria-hidden>{subjectIcon(doc.subject)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[hsl(var(--foreground))] truncate">
                  <FileText className="w-4 h-4 inline mr-1" />
                  {doc.title}
                </p>
                <p className="text-xs text-[hsl(var(--foreground-muted))]">
                  {subjectLabel(doc.subject)} · {doc.pages ? `PDF, ${doc.pages} pages · ` : ""}{doc.characters.toLocaleString()} characters · {doc.chunks} passages
                  {doc.embedded ? " · embedded" : ""} · {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link href={`/quiz?subject=${doc.subject}`} className="px-3 py-1.5 rounded-lg text-sm text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.06)]">
                Quiz me
              </Link>
              <button onClick={() => remove(doc)} aria-label={`Delete ${doc.title}`} className="p-2 rounded-lg text-[hsl(var(--foreground-muted))] hover:text-red-500 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
