"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Trash2, Upload } from "lucide-react";
import { createDocument, deleteDocument, type DocumentSummary } from "@/lib/actions/knowledge";
import { SUBJECTS, subjectIcon, subjectLabel } from "@/lib/subjects";

const MAX_CHARS = 100_000;
const field = "w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]";

export default function ForgeClient({ documents, demo, semantic }: { documents: DocumentSummary[]; demo: boolean; semantic: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0].value);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadFile(file: File) {
    if (!/\.(txt|md|markdown|csv)$/i.test(file.name)) return toast.error("Upload a .txt or .md file, or paste the text");
    const text = await file.text();
    if (text.length > MAX_CHARS) toast.warning(`Only the first ${MAX_CHARS.toLocaleString()} characters will be used`);
    setContent(text.slice(0, MAX_CHARS));
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await createDocument({ title, subject, content });
    setSaving(false);
    if (!result.success) return toast.error(result.error);
    toast.success(`Saved as ${result.data.chunks} searchable passages${result.data.embedded ? " with semantic embeddings" : ""}`);
    setTitle("");
    setContent("");
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
        <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
          Notes
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            maxLength={MAX_CHARS}
            placeholder="Paste your notes here, or drop a .txt / .md file onto this card"
            className={`${field} mt-1 font-mono text-sm`}
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-[hsl(var(--primary))] cursor-pointer hover:underline">
            <Upload className="w-4 h-4" />
            Choose a file
            <input type="file" accept=".txt,.md,.markdown,.csv,text/plain,text/markdown" className="sr-only" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
          </label>
          <span className="text-xs text-[hsl(var(--foreground-muted))] tabular-nums">{content.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}</span>
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
                  {subjectLabel(doc.subject)} · {doc.characters.toLocaleString()} characters · {doc.chunks} passages
                  {doc.embedded ? " · embedded" : ""} · {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
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
