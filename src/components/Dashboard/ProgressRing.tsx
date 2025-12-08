interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  label,
  subLabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-2xl font-semibold text-[hsl(var(--foreground))]">
            {label}
          </span>
        )}
        {subLabel && (
          <span className="text-xs text-[hsl(var(--foreground-muted))]">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}
