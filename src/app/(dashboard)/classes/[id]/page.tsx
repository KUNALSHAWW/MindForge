import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Brain, Clock, Users } from "lucide-react";
import { getClassroom } from "@/lib/actions/classroom";
import { subjectIcon, subjectLabel } from "@/lib/subjects";
import ClassActions from "./ClassActions";

export const metadata = { title: "Class" };

function recallCell(r: number | null): string {
  if (r === null) return "bg-[hsl(var(--muted))] text-[hsl(var(--foreground-subtle))]";
  if (r >= 0.85) return "bg-emerald-500/80 text-white";
  if (r >= 0.7) return "bg-amber-400/80 text-black";
  return "bg-red-500/80 text-white";
}
const pct = (r: number | null) => (r === null ? "–" : `${Math.round(r * 100)}%`);

export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getClassroom(id);
  if (!result.success) notFound();
  const c = result.data;
  const insights = c.insights;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/classes" className="inline-flex items-center gap-2 text-sm text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))]">
        <ArrowLeft className="w-4 h-4" /> All classes
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{c.name}</h1>
          <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
            {c.isOwner ? (
              <>Share the join code <span className="font-mono font-semibold tracking-widest text-[hsl(var(--foreground))]">{c.joinCode}</span> with your students.</>
            ) : (
              <>Taught by {c.teacher}. Your teacher sees your activity, predicted recall and quiz scores, not your conversations or notes.</>
            )}
          </p>
        </div>
        <ClassActions classroomId={c.id} isOwner={c.isOwner} />
      </div>

      {insights && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={Users} label="Students" value={insights.totals.students} />
            <Stat icon={Users} label="Active this week" value={insights.totals.activeThisWeek} />
            <Stat icon={Clock} label="Minutes this week" value={insights.totals.minutes7d} />
            <Stat icon={Brain} label="Average recall" value={pct(insights.totals.averageRecall)} />
          </div>

          {insights.students.length === 0 ? (
            <p className="text-sm text-[hsl(var(--foreground-muted))]">No students yet. Once they join with the code, their progress appears here.</p>
          ) : (
            <>
              <div className="card p-6 overflow-x-auto">
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">Recall heatmap</h2>
                <p className="text-xs text-[hsl(var(--foreground-muted))] mb-4">Predicted chance each student recalls their reviewed cards today, by subject (FSRS forgetting curve).</p>
                {insights.subjects.length === 0 ? (
                  <p className="text-sm text-[hsl(var(--foreground-muted))]">No reviewed flashcards in this class yet.</p>
                ) : (
                  <table className="text-sm border-separate border-spacing-1">
                    <thead>
                      <tr>
                        <th className="text-left font-medium text-[hsl(var(--foreground-muted))] pr-4">Student</th>
                        {insights.subjects.map((s) => (
                          <th key={s} className="font-medium text-[hsl(var(--foreground-muted))] px-2 whitespace-nowrap">{subjectIcon(s)} {subjectLabel(s)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {insights.students.map((st) => (
                        <tr key={st.userId}>
                          <td className="pr-4 whitespace-nowrap text-[hsl(var(--foreground))]">{st.name}</td>
                          {insights.subjects.map((s) => (
                            <td key={s} className={`text-center rounded px-3 py-1.5 tabular-nums ${recallCell(insights.heatmap[st.userId][s])}`}>{pct(insights.heatmap[st.userId][s])}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Students</h2>
                  <ul className="divide-y divide-[hsl(var(--border))]">
                    {insights.students.map((st) => (
                      <li key={st.userId} className="py-3 text-sm flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-[hsl(var(--foreground))]">{st.name}</p>
                          <p className="text-[hsl(var(--foreground-muted))]">
                            {st.minutes7d} min this week · {st.reviewedCards} cards · recall {pct(st.recall)} · quizzes {pct(st.quizAverage)}
                          </p>
                          {st.flags.map((f) => (
                            <p key={f} className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" /> {f}</p>
                          ))}
                        </div>
                        <ClassActions classroomId={c.id} isOwner removeStudentId={st.userId} studentName={st.name} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-3">Weakest subjects</h2>
                    {insights.subjectRecall.length === 0 ? (
                      <p className="text-sm text-[hsl(var(--foreground-muted))]">No data yet.</p>
                    ) : (
                      insights.subjectRecall.map((s) => (
                        <div key={s.subject} className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{subjectIcon(s.subject)} {subjectLabel(s.subject)}</span>
                            <span className="text-[hsl(var(--foreground-muted))] tabular-nums">{pct(s.recall)} · {s.students} students</span>
                          </div>
                          <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                            <div className={`h-full ${s.recall >= 0.85 ? "bg-emerald-500" : s.recall >= 0.7 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.round(s.recall * 100)}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-3">Most-forgotten cards</h2>
                    {insights.forgotten.length === 0 ? (
                      <p className="text-sm text-[hsl(var(--foreground-muted))]">Nothing is slipping yet.</p>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {insights.forgotten.map((f, i) => (
                          <li key={i} className="flex justify-between gap-3">
                            <span className="text-[hsl(var(--foreground))]">{subjectIcon(f.subject)} {f.front}</span>
                            <span className="text-[hsl(var(--foreground-muted))] whitespace-nowrap tabular-nums">{f.lapses} lapses · {pct(f.recall)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-sm text-[hsl(var(--foreground-muted))]">
        {label}
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-semibold text-[hsl(var(--foreground))] mt-1 tabular-nums">{value}</p>
    </div>
  );
}
