import { forwardRef, ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-hover))] focus:ring-[hsl(var(--primary)/0.3)]",
  secondary:
    "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--background-secondary))] hover:border-[hsl(var(--border-hover))] focus:ring-[hsl(var(--border)/0.5)]",
  ghost:
    "bg-transparent text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] focus:ring-[hsl(var(--border)/0.3)]",
  danger:
    "bg-[hsl(var(--error))] text-white hover:bg-[hsl(var(--error)/0.9)] focus:ring-[hsl(var(--error)/0.3)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

const iconSizes: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "left",
      loading = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium rounded-lg
          transition-all duration-150 ease-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className={`animate-spin ${iconSizes[size]}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === "left" && (
              <Icon className={iconSizes[size]} />
            )}
            {children}
            {Icon && iconPosition === "right" && (
              <Icon className={iconSizes[size]} />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
