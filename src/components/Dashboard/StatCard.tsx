import { LucideIcon } from "lucide-react";

type StatVariant = "indigo" | "emerald" | "amber" | "purple";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  variant?: StatVariant;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const variantStyles: Record<StatVariant, { border: string; iconBg: string; iconColor: string }> = {
  indigo: {
    border: "border-l-[hsl(234_89%_54%)]",
    iconBg: "bg-[hsl(234_89%_54%/0.1)]",
    iconColor: "text-[hsl(234_89%_54%)]",
  },
  emerald: {
    border: "border-l-[hsl(160_84%_39%)]",
    iconBg: "bg-[hsl(160_84%_39%/0.1)]",
    iconColor: "text-[hsl(160_84%_39%)]",
  },
  amber: {
    border: "border-l-[hsl(38_92%_50%)]",
    iconBg: "bg-[hsl(38_92%_50%/0.1)]",
    iconColor: "text-[hsl(38_92%_50%)]",
  },
  purple: {
    border: "border-l-[hsl(280_68%_60%)]",
    iconBg: "bg-[hsl(280_68%_60%/0.1)]",
    iconColor: "text-[hsl(280_68%_60%)]",
  },
};

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  variant = "indigo",
  trend,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5
        border-l-[3px] ${styles.border}
        hover:border-[hsl(var(--border-hover))] hover:shadow-md
        transition-all duration-200
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-[hsl(var(--foreground-muted))]">
          {label}
        </span>
        <div
          className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-semibold text-[hsl(var(--foreground))] tracking-tight">
          {value}
        </p>
        {trend && (
          <p
            className={`text-sm font-medium flex items-center gap-1 ${
              trend.positive
                ? "text-[hsl(var(--success))]"
                : "text-[hsl(var(--error))]"
            }`}
          >
            <span>{trend.positive ? "↑" : "↓"}</span>
            {trend.value}
          </p>
        )}
        {subValue && !trend && (
          <p className="text-sm text-[hsl(var(--foreground-muted))]">{subValue}</p>
        )}
      </div>
    </div>
  );
}

// Skeleton version for loading state
export function StatCardSkeleton() {
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-10 w-10 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-8 w-20" />
        <div className="skeleton h-4 w-16" />
      </div>
    </div>
  );
}
