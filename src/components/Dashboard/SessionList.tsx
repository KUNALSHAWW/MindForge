import Link from "next/link";
import { Clock, Sparkles, ArrowRight } from "lucide-react";
import type { SessionData } from "@/lib/actions/user";

interface SessionListProps {
  sessions: SessionData[];
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-[hsl(var(--foreground-muted))]" />
        </div>
        <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
          No sessions yet
        </h4>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mb-4">
          Start your first learning session with a companion
        </p>
        <Link
          href="/companions"
          className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--primary))] hover:underline"
        >
          Browse Companions
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="flex items-center justify-between p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--background-secondary))] hover:border-[hsl(var(--border-hover))] transition-all duration-150 cursor-pointer group"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0">
              <span className="text-lg">
                {getSubjectEmoji(session.subject)}
              </span>
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-[hsl(var(--foreground))] truncate group-hover:text-[hsl(var(--primary))] transition-colors">
                {session.companionName}
              </h4>
              <p className="text-xs text-[hsl(var(--foreground-muted))] truncate">
                {session.subject} • {session.topic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-[hsl(var(--foreground-muted))]">
                {session.durationMinutes} min
              </p>
              <p className="text-xs text-[hsl(var(--foreground-subtle))]">
                {formatTimeAgo(session.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium">+{session.xpEarned}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getSubjectEmoji(subject: string): string {
  const subjectEmojis: Record<string, string> = {
    mathematics: "📐",
    physics: "⚛️",
    chemistry: "🧪",
    biology: "🧬",
    history: "📜",
    geography: "🌍",
    literature: "📚",
    language: "🗣️",
    programming: "💻",
    music: "🎵",
    art: "🎨",
    default: "📖",
  };

  const normalizedSubject = subject.toLowerCase();
  for (const [key, emoji] of Object.entries(subjectEmojis)) {
    if (normalizedSubject.includes(key)) return emoji;
  }
  return subjectEmojis.default;
}

export function SessionListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-lg border border-[hsl(var(--border))]"
        >
          <div className="flex items-center gap-4">
            <div className="skeleton w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
