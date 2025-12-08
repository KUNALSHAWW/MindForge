import Link from "next/link";
import { Plus, BookOpen, BarChart3, Trophy, ArrowRight } from "lucide-react";

const actions = [
  {
    href: "/companions/create",
    label: "New Session",
    description: "Start learning with a companion",
    icon: Plus,
    primary: true,
  },
  {
    href: "/companions",
    label: "Browse Companions",
    description: "Explore AI tutors",
    icon: BookOpen,
    primary: false,
  },
  {
    href: "/journey",
    label: "View Analytics",
    description: "Track your progress",
    icon: BarChart3,
    primary: false,
  },
  {
    href: "/achievements",
    label: "Achievements",
    description: "See your badges",
    icon: Trophy,
    primary: false,
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={`
            group flex items-center gap-4 p-4 rounded-xl border transition-all duration-150
            ${
              action.primary
                ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-hover))]"
                : "bg-[hsl(var(--background))] border-[hsl(var(--border))] hover:bg-[hsl(var(--background-secondary))] hover:border-[hsl(var(--border-hover))]"
            }
          `}
        >
          <div
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
              ${
                action.primary
                  ? "bg-white/20"
                  : "bg-[hsl(var(--muted))]"
              }
            `}
          >
            <action.icon
              className={`w-5 h-5 ${
                action.primary
                  ? "text-white"
                  : "text-[hsl(var(--foreground-muted))]"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-medium ${
                action.primary
                  ? "text-white"
                  : "text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))]"
              } transition-colors`}
            >
              {action.label}
            </h4>
            <p
              className={`text-xs ${
                action.primary
                  ? "text-white/70"
                  : "text-[hsl(var(--foreground-muted))]"
              }`}
            >
              {action.description}
            </p>
          </div>
          <ArrowRight
            className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${
              action.primary
                ? "text-white/70"
                : "text-[hsl(var(--foreground-subtle))]"
            }`}
          />
        </Link>
      ))}
    </div>
  );
}
