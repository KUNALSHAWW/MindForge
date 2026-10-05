import Link from "next/link";
import { Brain, CalendarDays, Clock, Target } from "lucide-react";
import { getJourneyData } from "@/lib/actions/journey";
import { subjectIcon, subjectLabel } from "@/lib/subjects";
import WeeklyChart from "./WeeklyChart";

export const metadata = {
  title: "My Journey",
  description: "Learning time, activity, subject focus and memory health from your real sessions",
};

function heatColor(minutes: number): string {
  if (minutes === 0) return "bg-[hsl(var(--muted))]";
  if (minutes < 15) return "bg-[hsl(var(--primary)/0.3)]";
  if (minutes < 30) return "bg-[hsl(var(--primary)/0.55)]";
  if (minutes < 60) return "bg-[hsl(var(--primary)/0.8)]";
  return "bg-[hsl(var(--primary))]";
}

function retentionColor(r: number): string {
  if (r >= 0.85) return "bg-emerald-500";
  if (r >= 0.7) return "bg-amber-500";
  return "bg-red-500";
}

export default async function MyJourneyPage() {
  const result = await getJourneyData();
  if (!result.success) return <p className="text-sm text-[hsl(var(--error))]">{result.error}</p>;
  const { heatmap, weekly, subjects, memory, totals, recentNotes, demo } = result.data;

  // Pad so the first column starts on Sunday, giving a GitHub-style week grid.
  const firstDay = new Date(`${heatmap[0].date}T00:00:00Z`).getUTCDay();
  const cells = [...Array(firstDay).fill(null), ...heatmap];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">My Learning Journey</h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          {demo ? "Demo mode: sample data. Connect a database to see your own." : "Everything here is computed from your sessions and flashcard reviews."}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Clock} label="Learning time" value={`${Math.round((totals.minutes / 60) * 10) / 10}h`} sub={`${totals.sessions} sessions`} />
        <Stat icon={CalendarDays} label="Active days" value={totals.activeDays} sub="in the last 12 weeks" />
        <Stat icon={Target} label="Average session" value={`${totals.averageSession}m`} sub="per session" />
        <Stat
          icon={Brain}
          label="Predicted recall"
          value={totals.retention === null ? "–" : `${Math.round(totals.retention * 100)}%`}
          sub={`${totals.cards} reviewed cards`}
        />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Activity, last 12 weeks</h2>
        <div className="grid grid-rows-7 grid-flow-col gap-1 w-fit" role="img" aria-label={`${totals.activeDays} active days in the last 12 weeks`}>
          {cells.map((day, i) =>
            day ? (
              <div key={day.date} title={`${day.date}: ${day.minutes} min`} className={`w-4 h-4 rounded-sm ${heatColor(day.minutes)}`} />
            ) : (
              <div key={`pad-${i}`} className="w-4 h-4" />
            ),
          )}
        </div>
        <div className="flex items-center gap-1 mt-3 text-xs text-[hsl(var(--foreground-muted))]">
          Less {[0, 10, 20, 45, 60].map((m) => <span key={m} className={`w-3 h-3 rounded-sm ${heatColor(m)}`} />)} More
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Minutes per week</h2>
          <WeeklyChart data={weekly} />
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">Memory health</h2>
          <p className="text-xs text-[hsl(var(--foreground-muted))] mb-4">Average chance you would recall a reviewed card today (FSRS forgetting curve)</p>
          {memory.length === 0 ? (
            <p className="text-sm text-[hsl(var(--foreground-muted))]">
              Review a few flashcards and this shows which subjects are fading. <Link href="/review" className="text-[hsl(var(--primary))] hover:underline">Go to review</Link>
            </p>
          ) : (
            <div className="space-y-4">
              {memory.map((m) => (
                <div key={m.subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[hsl(var(--foreground))]">{subjectIcon(m.subject)} {m.label}</span>
                    <span className="text-[hsl(var(--foreground-muted))] tabular-nums">{Math.round(m.retention * 100)}% · {m.cards} cards</span>
                  </div>
                  <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                    <div className={`h-full ${retentionColor(m.retention)}`} style={{ width: `${Math.round(m.retention * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Where your time went</h2>
          {subjects.length === 0 ? (
            <p className="text-sm text-[hsl(var(--foreground-muted))]">No sessions in the last 12 weeks.</p>
          ) : (
            <div className="space-y-4">
              {subjects.map((s) => (
                <div key={s.subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[hsl(var(--foreground))]">{subjectIcon(s.subject)} {s.label}</span>
                    <span className="text-[hsl(var(--foreground-muted))] tabular-nums">{s.minutes} min · {s.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                    <div className="h-full bg-[hsl(var(--primary))]" style={{ width: `${s.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Session summaries</h2>
          {recentNotes.length === 0 ? (
            <p className="text-sm text-[hsl(var(--foreground-muted))]">AI summaries of your sessions appear here once an LLM key is configured.</p>
          ) : (
            <ul className="space-y-4">
              {recentNotes.map((n) => (
                <li key={n.id} className="text-sm">
                  <p className="font-medium text-[hsl(var(--foreground))]">
                    {subjectIcon(n.subject)} {n.companionName}
                    <span className="font-normal text-[hsl(var(--foreground-muted))]"> · {subjectLabel(n.subject)} · {new Date(n.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="text-[hsl(var(--foreground-muted))] mt-1">{n.notes}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-sm text-[hsl(var(--foreground-muted))]">
        {label}
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-semibold text-[hsl(var(--foreground))] mt-1 tabular-nums">{value}</p>
      <p className="text-xs text-[hsl(var(--foreground-muted))]">{sub}</p>
    </div>
  );
}
