import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    maths: "#FFD93D",
    mathematics: "#FFD93D",
    science: "#A855F7",
    language: "#3B82F6",
    languages: "#3B82F6",
    coding: "#EC4899",
    programming: "#EC4899",
    history: "#F97316",
    economics: "#10B981",
    finance: "#10B981",
    business: "#10B981",
    geography: "#0EA5E9",
    physics: "#8B5CF6",
    chemistry: "#14B8A6",
    biology: "#22C55E",
    literature: "#F472B6",
    art: "#F59E0B",
    music: "#EF4444",
  };
  return colors[subject.toLowerCase()] || "#6366F1";
}

export function getSubjectGradient(subject: string): string {
  const gradients: Record<string, string> = {
    maths: "from-yellow-400 to-orange-500",
    mathematics: "from-yellow-400 to-orange-500",
    science: "from-purple-500 to-violet-600",
    language: "from-blue-500 to-cyan-500",
    languages: "from-blue-500 to-cyan-500",
    coding: "from-pink-500 to-rose-500",
    programming: "from-pink-500 to-rose-500",
    history: "from-orange-500 to-red-500",
    economics: "from-emerald-500 to-teal-500",
    finance: "from-emerald-500 to-teal-500",
    business: "from-emerald-500 to-teal-500",
  };
  return gradients[subject.toLowerCase()] || "from-indigo-500 to-purple-500";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function calculateStreak(dates: Date[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = dates
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  const uniqueDates = [...new Set(sortedDates)];
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000;

  // Check current streak
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      if (uniqueDates[i - 1] - uniqueDates[i] === 86400000) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    if (uniqueDates[i - 1] - uniqueDates[i] === 86400000) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak };
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(target);
}

export const SUBJECTS = [
  "maths",
  "science",
  "language",
  "coding",
  "history",
  "economics",
  "physics",
  "chemistry",
  "biology",
  "geography",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const TEACHING_STYLES = [
  { value: "formal", label: "Formal", description: "Professional and structured teaching approach" },
  { value: "casual", label: "Casual", description: "Friendly and conversational style" },
  { value: "socratic", label: "Socratic", description: "Question-based learning method" },
  { value: "storytelling", label: "Storytelling", description: "Narrative-driven explanations" },
] as const;

export type TeachingStyle = (typeof TEACHING_STYLES)[number]["value"];

export const VOICE_OPTIONS = {
  male: {
    casual: "2BJW5coyhAzSr8STdHbE",
    formal: "c6SfcYrb2t09NHXiT80T",
  },
  female: {
    casual: "ZIlrSGI4jZqobxRKprJz",
    formal: "sarah",
  },
} as const;
