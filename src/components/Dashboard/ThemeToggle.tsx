"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // false on the server and during hydration, so the icon never mismatches
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-[hsl(var(--foreground-muted))]" />
      ) : (
        <Moon className="w-5 h-5 text-[hsl(var(--foreground-muted))]" />
      )}
    </button>
  );
}
