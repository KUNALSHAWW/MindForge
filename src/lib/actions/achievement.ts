"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma, { isDatabaseAvailable } from "@/lib/db";
import { getAchievementStats } from "@/lib/achievements";
import { DEMO_STATS, DEMO_UNLOCKED, demo } from "@/lib/demo";
import { ACHIEVEMENTS, nextMilestone, type AchievementDefinition, type AchievementMetric, type AchievementStats } from "@/lib/gamification";

export interface AchievementView extends AchievementDefinition {
  isUnlocked: boolean;
  unlockedAt?: Date;
  current: number;
}

export interface AchievementsData {
  all: AchievementView[];
  progress: Partial<Record<AchievementMetric, { current: number; next: number | null }>>;
  stats: { totalUnlocked: number; totalAvailable: number; percentComplete: number };
  demo: boolean;
}

type Result<T> = { success: true; data: T } | { success: false; error: string };

const DEMO_METRICS: AchievementStats = {
  sessions: DEMO_STATS.totalSessions,
  streak: DEMO_STATS.longestStreak,
  xp: DEMO_STATS.totalXP,
  longestSession: 60,
  totalMinutes: DEMO_STATS.totalSessionMinutes,
  companionsUsed: 4,
  companionsCreated: 0,
  bookmarks: demo.bookmarks.size,
  reviews: 0,
};

function build(stats: AchievementStats, unlocked: Map<string, Date>, isDemo: boolean): AchievementsData {
  const all = ACHIEVEMENTS.map((a) => ({
    ...a,
    current: stats[a.metric],
    isUnlocked: unlocked.has(a.title),
    unlockedAt: unlocked.get(a.title),
  }));
  const metrics: AchievementMetric[] = ["sessions", "streak", "xp", "totalMinutes", "reviews"];
  const progress = Object.fromEntries(metrics.map((m) => [m, { current: stats[m], next: nextMilestone(m, stats[m]) }]));
  const totalUnlocked = all.filter((a) => a.isUnlocked).length;
  return {
    all,
    progress,
    stats: { totalUnlocked, totalAvailable: all.length, percentComplete: Math.round((totalUnlocked / all.length) * 100) },
    demo: isDemo,
  };
}

export async function getAchievements(): Promise<Result<AchievementsData>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };

  try {
    if (!(await isDatabaseAvailable())) {
      const unlocked = new Map(DEMO_UNLOCKED.map((u) => [u.title, new Date(Date.now() - u.daysAgo * 86_400_000)]));
      return { success: true, data: build(DEMO_METRICS, unlocked, true) };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: { achievements: { select: { title: true, unlockedAt: true } } },
    });
    if (!user) {
      const empty = Object.fromEntries(Object.keys(DEMO_METRICS).map((k) => [k, 0])) as AchievementStats;
      return { success: true, data: build(empty, new Map(), false) };
    }
    const stats = await getAchievementStats(user.id);
    return { success: true, data: build(stats, new Map(user.achievements.map((a) => [a.title, a.unlockedAt])), false) };
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return { success: false, error: "Failed to load achievements" };
  }
}
