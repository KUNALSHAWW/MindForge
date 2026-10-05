// Gamification rules: XP, levels, streaks and achievements.
// Single source of truth used by the server actions, the UI and the tests.
// Pure module (no imports) so it runs under `node --test`.

export const XP_PER_MINUTE = 3;
export const XP_PER_LEVEL = 1000;
export const XP_PER_REVIEW = 2;
export const XP_PER_QUIZ_POINT = 5;
export const MAX_STREAK_MULTIPLIER = 2;

/** XP for a session. The streak passed in must already include today's session. */
export function calculateXP(durationMinutes: number, streak: number): number {
  const base = Math.floor(Math.max(0, durationMinutes) * XP_PER_MINUTE);
  const multiplier = Math.min(1 + Math.max(0, streak) * 0.1, MAX_STREAK_MULTIPLIER);
  return Math.floor(base * multiplier);
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.max(0, totalXP) / XP_PER_LEVEL) + 1;
}

export function levelProgress(totalXP: number): { level: number; progress: number; xpToNext: number } {
  const level = calculateLevel(totalXP);
  const intoLevel = totalXP - (level - 1) * XP_PER_LEVEL;
  return {
    level,
    progress: Math.floor((intoLevel / XP_PER_LEVEL) * 100),
    xpToNext: level * XP_PER_LEVEL - totalXP,
  };
}

/** Calendar day ("YYYY-MM-DD") of `date` in the learner's IANA time zone. Falls back to UTC. */
export function dayKey(date: Date, timeZone = "UTC"): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((Date.parse(`${toKey}T00:00:00Z`) - Date.parse(`${fromKey}T00:00:00Z`)) / 86_400_000);
}

/**
 * Streak after a session at `now`, given the previous session time.
 * Same calendar day keeps the streak, the next day extends it, any gap restarts at 1.
 */
export function nextStreak(currentStreak: number, lastSessionAt: Date | null, now: Date, timeZone = "UTC"): number {
  if (!lastSessionAt) return 1;
  const gap = daysBetween(dayKey(lastSessionAt, timeZone), dayKey(now, timeZone));
  if (gap <= 0) return Math.max(1, currentStreak);
  if (gap === 1) return currentStreak + 1;
  return 1;
}

/** Streak still alive today? (last session today or yesterday) */
export function liveStreak(currentStreak: number, lastSessionAt: Date | null, now: Date, timeZone = "UTC"): number {
  if (!lastSessionAt) return 0;
  return daysBetween(dayKey(lastSessionAt, timeZone), dayKey(now, timeZone)) <= 1 ? currentStreak : 0;
}

export type AchievementMetric =
  | "sessions"
  | "streak"
  | "xp"
  | "longestSession"
  | "totalMinutes"
  | "companionsUsed"
  | "companionsCreated"
  | "bookmarks"
  | "reviews";

export type AchievementCategory = "sessions" | "streak" | "xp" | "time" | "special" | "memory";

export interface AchievementDefinition {
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  metric: AchievementMetric;
  requirement: number;
}

export type AchievementStats = Record<AchievementMetric, number>;

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { title: "First Steps", description: "Complete your first learning session", icon: "🎯", category: "sessions", metric: "sessions", requirement: 1 },
  { title: "Getting Started", description: "Complete 5 learning sessions", icon: "📚", category: "sessions", metric: "sessions", requirement: 5 },
  { title: "Consistent Learner", description: "Complete 10 learning sessions", icon: "📖", category: "sessions", metric: "sessions", requirement: 10 },
  { title: "Dedicated Learner", description: "Complete 25 learning sessions", icon: "🎓", category: "sessions", metric: "sessions", requirement: 25 },
  { title: "Session Pro", description: "Complete 50 learning sessions", icon: "🏅", category: "sessions", metric: "sessions", requirement: 50 },
  { title: "Century Club", description: "Complete 100 learning sessions", icon: "💯", category: "sessions", metric: "sessions", requirement: 100 },

  { title: "3-Day Streak", description: "Maintain a 3-day learning streak", icon: "🔥", category: "streak", metric: "streak", requirement: 3 },
  { title: "Week Warrior", description: "Maintain a 7-day learning streak", icon: "⚡", category: "streak", metric: "streak", requirement: 7 },
  { title: "Two Week Champion", description: "Maintain a 14-day learning streak", icon: "💪", category: "streak", metric: "streak", requirement: 14 },
  { title: "Streak Master", description: "Maintain a 30-day learning streak", icon: "🌟", category: "streak", metric: "streak", requirement: 30 },
  { title: "Unstoppable", description: "Maintain a 60-day learning streak", icon: "🚀", category: "streak", metric: "streak", requirement: 60 },
  { title: "Legendary Streak", description: "Maintain a 100-day learning streak", icon: "👑", category: "streak", metric: "streak", requirement: 100 },

  { title: "XP Starter", description: "Earn 500 total XP", icon: "⭐", category: "xp", metric: "xp", requirement: 500 },
  { title: "XP Hunter", description: "Earn 1,000 total XP", icon: "✨", category: "xp", metric: "xp", requirement: 1000 },
  { title: "XP Collector", description: "Earn 5,000 total XP", icon: "🌠", category: "xp", metric: "xp", requirement: 5000 },
  { title: "XP Champion", description: "Earn 10,000 total XP", icon: "🏆", category: "xp", metric: "xp", requirement: 10000 },
  { title: "XP Master", description: "Earn 25,000 total XP", icon: "💎", category: "xp", metric: "xp", requirement: 25000 },
  { title: "Knowledge Seeker", description: "Earn 50,000 total XP", icon: "🧠", category: "xp", metric: "xp", requirement: 50000 },

  { title: "Focus Mode", description: "Complete a 30+ minute session", icon: "🧘", category: "time", metric: "longestSession", requirement: 30 },
  { title: "Deep Dive", description: "Complete a 60+ minute session", icon: "🌊", category: "time", metric: "longestSession", requirement: 60 },
  { title: "Marathon Learner", description: "Complete a 90+ minute session", icon: "🏃", category: "time", metric: "longestSession", requirement: 90 },
  { title: "Hour Master", description: "Spend 10 total hours learning", icon: "⏰", category: "time", metric: "totalMinutes", requirement: 600 },
  { title: "Time Investor", description: "Spend 50 total hours learning", icon: "⌛", category: "time", metric: "totalMinutes", requirement: 3000 },
  { title: "Time Champion", description: "Spend 100 total hours learning", icon: "🕐", category: "time", metric: "totalMinutes", requirement: 6000 },

  { title: "Explorer", description: "Learn from 5 different companions", icon: "🧭", category: "special", metric: "companionsUsed", requirement: 5 },
  { title: "Creator", description: "Create your first AI companion", icon: "🎨", category: "special", metric: "companionsCreated", requirement: 1 },
  { title: "Companion Master", description: "Create 5 AI companions", icon: "🤖", category: "special", metric: "companionsCreated", requirement: 5 },
  { title: "Bookworm", description: "Bookmark 10 companions", icon: "📌", category: "special", metric: "bookmarks", requirement: 10 },

  { title: "Recall Rookie", description: "Complete 10 flashcard reviews", icon: "🃏", category: "memory", metric: "reviews", requirement: 10 },
  { title: "Memory Athlete", description: "Complete 250 flashcard reviews", icon: "🏋️", category: "memory", metric: "reviews", requirement: 250 },
];

/** Achievements whose threshold is met and that are not unlocked yet. */
export function newlyUnlocked(stats: AchievementStats, unlockedTitles: Iterable<string>): AchievementDefinition[] {
  const owned = new Set(unlockedTitles);
  return ACHIEVEMENTS.filter((a) => !owned.has(a.title) && stats[a.metric] >= a.requirement);
}

/** Next milestone above `current` for one metric, or null when every milestone is reached. */
export function nextMilestone(metric: AchievementMetric, current: number): number | null {
  const milestones = ACHIEVEMENTS.filter((a) => a.metric === metric).map((a) => a.requirement).sort((a, b) => a - b);
  return milestones.find((m) => current < m) ?? null;
}
