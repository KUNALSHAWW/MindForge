"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Brain, CheckCircle2, Cpu, Plus, Trash2 } from "lucide-react";
import { createFlashcard, deleteFlashcard, optimizeMemoryModel, reviewCard, type ReviewCard, type ReviewQueue } from "@/lib/actions/review";
import { formatInterval, RATING_LABELS, scheduleAll, type Rating } from "@/lib/fsrs";
import { SUBJECTS, subjectLabel } from "@/lib/subjects";

const RATING_STYLES: Record<Rating, string> = {
  1: "border-red-500/40 text-red-600 hover:bg-red-500/10",
  2: "border-amber-500/40 text-amber-600 hover:bg-amber-500/10",
  3: "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10",
  4: "border-sky-500/40 text-sky-600 hover:bg-sky-500/10",
};

export default function ReviewClient({ queue, dailyGoal }: { queue: ReviewQueue; dailyGoal: number }) {
  const router = useRouter();
  const [cards, setCards] = useState<ReviewCard[]>(queue.cards);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [saving, setSaving] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const card = cards[0];

  const rate = useCallback(
    async (rating: Rating) => {
      if (!card || !revealed || saving) return;
      setSaving(true);
      const result = await reviewCard({ cardId: card.id, rating });
      setSaving(false);
      if (!result.success) return toast.error(result.error);

      const next = scheduleAll(card, new Date(), queue.weights)[rating];
      setCards((prev) => {
        const rest = prev.slice(1);
        // "Again" cards come back at the end of this session (FSRS relearning step).
        return rating === 1 ? [...rest, { ...card, ...next }] : rest;
      });
      setReviewed((n) => n + 1);
      setRevealed(false);
      setNow(new Date());
      for (const a of result.data.newAchievements) toast.success(`Achievement unlocked: ${a}`);
    },
    [card, revealed, saving, queue.weights],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.code === "Space" && !revealed) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && ["1", "2", "3", "4"].includes(e.key)) {
        rate(Number(e.key) as Rating);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rate, revealed]);

  async function remove() {
    if (!card || !confirm("Delete this card?")) return;
    const result = await deleteFlashcard(card.id);
    if (!result.success) return toast.error(result.error);
    setCards((prev) => prev.slice(1));
    setRevealed(false);
  }

  const previews = card ? scheduleAll(card, now, queue.weights) : null;
  const goalProgress = Math.min(100, Math.round((reviewed / dailyGoal) * 100));

  if (queue.demo) {
    return (
      <div className="card p-8 text-center">
        <Brain className="w-10 h-10 mx-auto mb-4 text-[hsl(var(--primary))]" />
        <p className="text-[hsl(var(--foreground))] font-medium">Spaced repetition needs a database</p>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-2">
          Set <code>DATABASE_URL</code> and an LLM key, run <code>npm run db:push</code>, then finish a tutor session: its key ideas become flashcards here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Due now" value={Math.max(queue.dueCount - reviewed, cards.length)} />
        <Stat label="Reviewed today" value={`${reviewed} / ${dailyGoal}`} />
        <Stat label="Total cards" value={queue.totalCards} />
      </div>
      <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden" role="progressbar" aria-valuenow={goalProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Daily review goal">
        <div className="h-full bg-[hsl(var(--primary))] transition-all" style={{ width: `${goalProgress}%` }} />
      </div>

      {card && previews ? (
        <div className="card p-6">
          <div className="flex items-center justify-between text-xs text-[hsl(var(--foreground-muted))] mb-4">
            <span>
              {subjectLabel(card.subject)}
              {card.companionName && ` · from ${card.companionName}`}
              {card.reps > 0 && ` · reviewed ${card.reps}× · lapses ${card.lapses}`}
            </span>
            <button onClick={remove} aria-label="Delete card" className="p-1 rounded hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-lg font-medium text-[hsl(var(--foreground))] whitespace-pre-wrap">{card.front}</p>

          {revealed ? (
            <>
              <div className="mt-6 pt-6 border-t border-[hsl(var(--border))] text-[hsl(var(--foreground))] whitespace-pre-wrap">{card.back}</div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([1, 2, 3, 4] as Rating[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => rate(r)}
                    disabled={saving}
                    className={`py-3 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 ${RATING_STYLES[r]}`}
                  >
                    {RATING_LABELS[r]}
                    <span className="block text-xs opacity-70">{formatInterval(now, previews[r].due)} · {r}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="mt-6 w-full py-3 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary)/0.9)]"
            >
              Show answer <span className="opacity-70 text-xs">(space)</span>
            </button>
          )}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-[hsl(var(--success))]" />
          <p className="text-[hsl(var(--foreground))] font-medium">All caught up</p>
          <p className="text-sm text-[hsl(var(--foreground-muted))] mt-2">
            {queue.nextDue
              ? `Next card is due ${new Date(queue.nextDue).toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })}.`
              : "Finish a tutor session to generate cards, or add your own below."}
          </p>
          <Link href="/companions" className="inline-block mt-4 text-sm text-[hsl(var(--primary))] hover:underline">
            Start a session
          </Link>
        </div>
      )}

      <MemoryModelPanel queue={queue} onOptimized={() => router.refresh()} />
      <AddCard onAdded={() => router.refresh()} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <p className="text-2xl font-semibold text-[hsl(var(--foreground))] tabular-nums">{value}</p>
      <p className="text-sm text-[hsl(var(--foreground-muted))]">{label}</p>
    </div>
  );
}

function AddCard({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0].value);
  const [saving, setSaving] = useState(false);
  const field = "w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]";

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 text-sm text-[hsl(var(--primary))] hover:underline">
        <Plus className="w-4 h-4" /> Add your own card
      </button>
    );
  }

  return (
    <form
      className="card p-6 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        const result = await createFlashcard({ front, back, subject });
        setSaving(false);
        if (!result.success) return toast.error(result.error);
        toast.success("Card added and due now");
        setFront("");
        setBack("");
        onAdded();
      }}
    >
      <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
        Question
        <input value={front} onChange={(e) => setFront(e.target.value)} required maxLength={500} className={`${field} mt-1`} />
      </label>
      <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
        Answer
        <textarea value={back} onChange={(e) => setBack(e.target.value)} required maxLength={2000} rows={3} className={`${field} mt-1`} />
      </label>
      <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
        Subject
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className={`${field} mt-1`}>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium disabled:opacity-50">
          {saving ? "Adding…" : "Add card"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm text-[hsl(var(--foreground-muted))]">
          Cancel
        </button>
      </div>
    </form>
  );
}

function MemoryModelPanel({ queue, onOptimized }: { queue: ReviewQueue; onOptimized: () => void }) {
  const [running, setRunning] = useState(false);
  const model = queue.model;
  const gain = model ? Math.round((1 - model.optimizedLoss / model.defaultLoss) * 100) : 0;

  async function optimize() {
    setRunning(true);
    const result = await optimizeMemoryModel();
    setRunning(false);
    if (!result.success) return toast.error(result.error);
    const r = result.data;
    if (r.improved) {
      toast.success(`Personal model saved: ${Math.round((1 - r.optimizedLoss / r.defaultLoss) * 100)}% lower prediction error on held-out cards`);
      onOptimized();
    } else {
      toast("The default model still predicts your memory best. Keeping it.");
    }
  }

  return (
    <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <Cpu className="w-8 h-8 text-[hsl(var(--primary))] shrink-0" />
      <div className="flex-1 text-sm">
        <p className="font-medium text-[hsl(var(--foreground))]">
          {model ? "Personal memory model active" : "Using the default FSRS-4.5 model"}
        </p>
        <p className="text-[hsl(var(--foreground-muted))]">
          {model
            ? `Fitted to ${model.scoredReviews} of your reviews on ${new Date(model.optimizedAt).toLocaleDateString()}: log loss ${model.defaultLoss.toFixed(3)} → ${model.optimizedLoss.toFixed(3)} on held-out cards (${gain}% better).`
            : `After about 100 reviews spaced a day or more apart, MindForge can fit the scheduler to how you forget. ${queue.reviewCount} reviews logged so far.`}
        </p>
      </div>
      <button
        onClick={optimize}
        disabled={running}
        className="px-4 py-2 rounded-lg border border-[hsl(var(--primary))] text-[hsl(var(--primary))] text-sm font-medium hover:bg-[hsl(var(--primary)/0.06)] disabled:opacity-50 whitespace-nowrap"
      >
        {running ? "Fitting…" : model ? "Re-optimise" : "Personalise"}
      </button>
    </div>
  );
}
