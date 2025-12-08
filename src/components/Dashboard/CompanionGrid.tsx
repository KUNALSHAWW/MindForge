import Link from "next/link";
import { Users, Play, ArrowRight } from "lucide-react";
import type { CompanionData } from "@/lib/actions/user";

interface CompanionGridProps {
  companions: CompanionData[];
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

function getStyleBadge(style: string): { label: string; color: string } {
  const styles: Record<string, { label: string; color: string }> = {
    formal: { label: "Formal", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    casual: { label: "Casual", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    socratic: { label: "Socratic", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    storytelling: { label: "Story", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  };
  return styles[style] || { label: style, color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };
}

export function CompanionGrid({ companions }: CompanionGridProps) {
  if (companions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-[hsl(var(--foreground-muted))]" />
        </div>
        <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
          No companions yet
        </h4>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mb-4">
          Create your first AI learning companion
        </p>
        <Link
          href="/companions/create"
          className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--primary))] hover:underline"
        >
          Create Companion
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {companions.map((companion) => {
        const styleBadge = getStyleBadge(companion.style);
        return (
          <Link
            key={companion.id}
            href={`/companions/${companion.id}`}
            className="group p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--background-secondary))] hover:border-[hsl(var(--border-hover))] transition-all duration-150"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0 text-lg">
                {getSubjectEmoji(companion.subject)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-[hsl(var(--foreground))] truncate group-hover:text-[hsl(var(--primary))] transition-colors">
                  {companion.name}
                </h4>
                <p className="text-xs text-[hsl(var(--foreground-muted))] truncate">
                  {companion.subject}
                </p>
              </div>
            </div>

            <p className="mt-2 text-xs text-[hsl(var(--foreground-muted))] line-clamp-2">
              {companion.description}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full ${styleBadge.color}`}>
                {styleBadge.label}
              </span>
              <div className="flex items-center gap-1 text-xs text-[hsl(var(--foreground-subtle))]">
                <Play className="w-3 h-3" />
                {companion.sessionsCount} sessions
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function CompanionGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-[hsl(var(--border))]"
        >
          <div className="flex items-start gap-3">
            <div className="skeleton w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
          <div className="skeleton h-8 w-full mt-3" />
          <div className="flex items-center justify-between mt-3">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
