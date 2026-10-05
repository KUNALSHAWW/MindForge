"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, CircleDashed, FileText, ListChecks, XCircle } from "lucide-react";
import { answerQuestion, startQuiz, type AnswerResult, type QuizOverview, type StartedQuiz } from "@/lib/actions/quiz";
import { subjectIcon } from "@/lib/subjects";

const SIZES = [5, 10, 15];
const field = "w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]";

export default function QuizClient({ overview, initialSubject }: { overview: QuizOverview; initialSubject?: string }) {
  const router = useRouter();
  const available = overview.subjects;
  const [subject, setSubject] = useState(available.find((s) => s.subject === initialSubject)?.subject ?? available[0]?.subject ?? "");
  const [size, setSize] = useState(5);
  const [quiz, setQuiz] = useState<StartedQuiz | null>(null);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function begin() {
    setBusy(true);
    const started = await startQuiz({ subject, size });
    setBusy(false);
    if (!started.success) return toast.error(started.error);
    setQuiz(started.data);
    setIndex(0);
    setResponse("");
    setResult(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!quiz) return;
    setBusy(true);
    const graded = await answerQuestion({ quizId: quiz.quizId, index, response });
    setBusy(false);
    if (!graded.success) return toast.error(graded.error);
    setResult(graded.data);
    const f = graded.data.finished;
    if (f) {
      toast.success(`Quiz complete: ${f.correct}/${f.total} correct · +${f.xpEarned} XP`);
      if (f.flashcardsCreated) toast(`${f.flashcardsCreated} missed question${f.flashcardsCreated === 1 ? "" : "s"} added to your review queue`);
      for (const a of f.newAchievements) toast.success(`Achievement unlocked: ${a}`);
    }
  }

  function next() {
    setIndex((i) => i + 1);
    setResponse("");
    setResult(null);
  }

  if (overview.demo) {
    return <Empty text="Quizzes are generated from notes saved in your database. Connect DATABASE_URL to try them." />;
  }
  if (!available.length) {
    return (
      <Empty text="Upload notes first: every question is written from your own material.">
        <Link href="/forge" className="inline-block mt-4 text-sm text-[hsl(var(--primary))] hover:underline">Go to the Knowledge Forge</Link>
      </Empty>
    );
  }

  if (quiz) {
    const q = quiz.questions[index];
    const finished = result?.finished;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-[hsl(var(--foreground-muted))]">
          <span>
            Question {index + 1} of {quiz.questions.length} · {quiz.mode === "llm" ? "short answer" : "fill in the blank (offline mode)"}
          </span>
          <button onClick={() => setQuiz(null)} className="hover:text-[hsl(var(--foreground))]">Quit</button>
        </div>
        <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
          <div className="h-full bg-[hsl(var(--primary))] transition-all" style={{ width: `${((index + (result ? 1 : 0)) / quiz.questions.length) * 100}%` }} />
        </div>

        <form onSubmit={submit} className="card p-6 space-y-4">
          <p className="text-lg font-medium text-[hsl(var(--foreground))]">{q.question}</p>
          <p className="text-xs text-[hsl(var(--foreground-muted))]">
            <FileText className="w-3 h-3 inline mr-1" />
            From: {q.sourceTitle}
          </p>
          <label htmlFor="quiz-answer" className="sr-only">Your answer</label>
          {q.kind === "cloze" ? (
            <input id="quiz-answer" value={response} onChange={(e) => setResponse(e.target.value)} disabled={!!result} autoFocus autoComplete="off" className={field} placeholder="The missing word" />
          ) : (
            <textarea id="quiz-answer" value={response} onChange={(e) => setResponse(e.target.value)} disabled={!!result} autoFocus rows={4} maxLength={2000} className={field} placeholder="Answer in your own words" />
          )}

          {result ? (
            <div className="space-y-3">
              <div
                className={`flex gap-2 p-3 rounded-lg text-sm ${
                  result.grade.score === 1 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : result.grade.score === 0.5 ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
                }`}
                role="status"
              >
                {result.grade.score === 1 ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : result.grade.score === 0.5 ? <CircleDashed className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                <span>{result.grade.feedback}</span>
              </div>
              <details className="text-sm text-[hsl(var(--foreground-muted))]">
                <summary className="cursor-pointer">Model answer and source</summary>
                <p className="mt-2 text-[hsl(var(--foreground))]">{result.answer}</p>
                <blockquote className="mt-2 pl-3 border-l-2 border-[hsl(var(--border))]">
                  {result.source.text}
                  <footer className="mt-1 text-xs">({result.source.title})</footer>
                </blockquote>
              </details>
              {finished ? (
                <div className="p-4 rounded-lg bg-[hsl(var(--background-secondary))] text-sm">
                  <p className="font-medium text-[hsl(var(--foreground))]">
                    Score {Math.round(finished.score * 100)}% · {finished.correct}/{finished.total} fully correct · +{finished.xpEarned} XP
                  </p>
                  <div className="flex gap-3 mt-3">
                    <button type="button" onClick={() => { setQuiz(null); router.refresh(); }} className="px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white font-medium">New quiz</button>
                    {finished.flashcardsCreated > 0 && (
                      <Link href="/review" className="px-4 py-2 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))]">Review missed cards</Link>
                    )}
                  </div>
                </div>
              ) : (
                <button type="button" onClick={next} autoFocus className="px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white font-medium">Next question</button>
              )}
            </div>
          ) : (
            <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white font-medium disabled:opacity-50">
              {busy ? "Grading…" : response.trim() ? "Check answer" : "I don't know"}
            </button>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
            Subject
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={`${field} mt-1`}>
              {available.map((s) => (
                <option key={s.subject} value={s.subject}>
                  {subjectIcon(s.subject)} {s.label} ({s.documents} note{s.documents === 1 ? "" : "s"})
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="text-sm font-medium text-[hsl(var(--foreground))]">Questions</legend>
            <div className="flex gap-2 mt-1">
              {SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSize(n)}
                  aria-pressed={size === n}
                  className={`flex-1 py-2 rounded-lg border text-sm ${size === n ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.06)] text-[hsl(var(--primary))]" : "border-[hsl(var(--border))] text-[hsl(var(--foreground-muted))]"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <button onClick={begin} disabled={busy || !subject} className="w-full py-3 rounded-lg bg-[hsl(var(--primary))] text-white font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2">
          <ListChecks className="w-5 h-5" />
          {busy ? "Writing questions from your notes…" : "Start quiz"}
        </button>
      </div>

      {overview.recent.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-3">Recent quizzes</h2>
          <ul className="space-y-2 text-sm">
            {overview.recent.map((r) => (
              <li key={r.id} className="flex justify-between">
                <span className="text-[hsl(var(--foreground))]">{subjectIcon(r.subject)} {r.label} · {r.questions} questions</span>
                <span className="text-[hsl(var(--foreground-muted))] tabular-nums">
                  {Math.round(r.score * 100)}% · {new Date(r.completedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Empty({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="card p-8 text-center">
      <ListChecks className="w-10 h-10 mx-auto mb-4 text-[hsl(var(--primary))]" />
      <p className="text-sm text-[hsl(var(--foreground-muted))]">{text}</p>
      {children}
    </div>
  );
}
