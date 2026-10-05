"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GraduationCap, School, Users } from "lucide-react";
import { createClassroom, joinClassroom, type ClassroomSummary } from "@/lib/actions/classroom";

const field = "flex-1 px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]";
const button = "px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium disabled:opacity-50";

export default function ClassesClient({ classes, demo }: { classes: ClassroomSummary[]; demo: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy("create");
    const result = await createClassroom(name);
    setBusy(null);
    if (!result.success) return toast.error(result.error);
    toast.success(`Class created. Share the code ${result.data.joinCode} with your students.`);
    router.push(`/classes/${result.data.id}`);
  }

  async function join(e: React.FormEvent) {
    e.preventDefault();
    setBusy("join");
    const result = await joinClassroom(code);
    setBusy(null);
    if (!result.success) return toast.error(result.error);
    toast.success(`Joined ${result.data.name}`);
    setCode("");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {demo && <p className="text-sm text-[hsl(var(--foreground-muted))]">Demo mode: classes need a database.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <form onSubmit={create} className="card p-5 space-y-3">
          <h2 className="font-semibold text-[hsl(var(--foreground))] flex items-center gap-2"><School className="w-5 h-5" /> Teach a class</h2>
          <div className="flex gap-2">
            <label htmlFor="class-name" className="sr-only">Class name</label>
            <input id="class-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Class 12 Physics, Section B" maxLength={80} required className={field} />
            <button type="submit" disabled={busy !== null || demo} className={button}>{busy === "create" ? "Creating…" : "Create"}</button>
          </div>
        </form>
        <form onSubmit={join} className="card p-5 space-y-3">
          <h2 className="font-semibold text-[hsl(var(--foreground))] flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Join a class</h2>
          <div className="flex gap-2">
            <label htmlFor="join-code" className="sr-only">Join code</label>
            <input
              id="join-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="6-character code"
              maxLength={6}
              required
              autoComplete="off"
              className={`${field} font-mono tracking-widest uppercase`}
            />
            <button type="submit" disabled={busy !== null || demo} className={button}>{busy === "join" ? "Joining…" : "Join"}</button>
          </div>
        </form>
      </div>

      {classes.length === 0 ? (
        <p className="text-sm text-[hsl(var(--foreground-muted))]">You are not in any class yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {classes.map((c) => (
            <Link key={c.id} href={`/classes/${c.id}`} className="card p-5 hover:border-[hsl(var(--primary)/0.4)] transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{c.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--foreground-muted))]">{c.isOwner ? "Teacher" : "Student"}</span>
              </div>
              <p className="text-sm text-[hsl(var(--foreground-muted))] mt-2 flex items-center gap-1">
                <Users className="w-4 h-4" /> {c.members} student{c.members === 1 ? "" : "s"} · taught by {c.isOwner ? "you" : c.teacher}
              </p>
              {c.joinCode && <p className="text-sm mt-1">Join code <span className="font-mono font-semibold tracking-widest">{c.joinCode}</span></p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
