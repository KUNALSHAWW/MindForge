import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl
        ${paddingClasses[padding]}
        ${hover ? "hover:border-[hsl(var(--border-hover))] hover:shadow-md transition-all duration-200" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[hsl(var(--foreground-muted))] mt-0.5">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

// Empty state component for cards
interface CardEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function CardEmptyState({
  icon,
  title,
  description,
  action,
}: CardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
        {title}
      </h4>
      <p className="text-sm text-[hsl(var(--foreground-muted))] mb-4 max-w-[200px]">
        {description}
      </p>
      {action}
    </div>
  );
}

// Skeleton for card
export function CardSkeleton({ height = "200px" }: { height?: string }) {
  return (
    <div
      className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5"
      style={{ height }}
    >
      <div className="space-y-3">
        <div className="skeleton h-5 w-1/3" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-20 w-full mt-4" />
      </div>
    </div>
  );
}
