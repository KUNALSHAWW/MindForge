"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { ACHIEVEMENTS, levelProgress, liveStreak } from "@/lib/gamification";
import { demo, DEMO_SESSIONS, DEMO_STATS, DEMO_UNLOCKED } from "@/lib/demo";

export interface UserStats {
  level: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalSessionMinutes: number;
  totalSessions: number;
  xpToNextLevel: number;
  levelProgress: number;
  dueCards: number;
}

export interface SessionData {
  id: string;
  companionName: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  xpEarned: number;
  createdAt: Date;
}

export interface CompanionData {
  id: string;
  name: string;
  subject: string;
  topic: string;
  description: string;
  style: string;
  sessionsCount: number;
}

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface DashboardData {
  userName: string;
  stats: UserStats;
  recentSessions: SessionData[];
  companions: CompanionData[];
  achievements: AchievementData[];
  demo: boolean;
}

function demoDashboard(userName: string): DashboardData {
  const byId = new Map(demo.companions.map((c) => [c.id, c]));
  const { level, progress, xpToNext } = levelProgress(DEMO_STATS.totalXP);
  return {
    userName,
    demo: true,
    stats: {
      ...DEMO_STATS, level, levelProgress: progress, xpToNextLevel: xpToNext, dueCards: 0,
    },
    recentSessions: DEMO_SESSIONS.map((s) => {
      const c = byId.get(s.companionId)!;
      return { id: s.id, companionName: c.name, subject: c.subject, topic: c.topic, durationMinutes: s.minutes, xpEarned: s.xp, createdAt: s.createdAt };
    }),
    companions: demo.companions.slice(0, 4).map((c) => ({ ...c, sessionsCount: c.sessionsCount })),
    achievements: DEMO_UNLOCKED.map((u) => {
      const a = ACHIEVEMENTS.find((d) => d.title === u.title)!;
      return { id: a.title, title: a.title, description: a.description, icon: a.icon, unlockedAt: new Date(Date.now() - u.daysAgo * 86_400_000) };
    }),
  };
}

export async function getDashboardData(): Promise<{ data: DashboardData | null; error: string | null }> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { data: null, error: "Not authenticated" };
  const firstName = clerkUser.firstName || "Learner";

  try {
    if (!(await isDatabaseAvailable())) return { data: demoDashboard(firstName), error: null };

    const { id: userId } = await ensureUser(clerkUser);
    const now = new Date();
    const [user, totalSessions, dueCards] = await Promise.all([
      prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
          sessions: { include: { companion: true }, orderBy: { createdAt: "desc" }, take: 5 },
          companions: { include: { _count: { select: { sessions: true } } }, orderBy: { updatedAt: "desc" }, take: 4 },
          achievements: { orderBy: { unlockedAt: "desc" }, take: 3 },
        },
      }),
      prisma.sessionHistory.count({ where: { userId } }),
      prisma.flashcard.count({ where: { userId, due: { lte: now } } }),
    ]);

    const { level, progress, xpToNext } = levelProgress(user.totalXP);
    return {
      error: null,
      data: {
        userName: user.name?.split(" ")[0] || firstName,
        demo: false,
        stats: {
          level,
          totalXP: user.totalXP,
          // A streak only counts while it is alive (session today or yesterday).
          currentStreak: liveStreak(user.currentStreak, user.sessions[0]?.createdAt ?? null, now, user.timeZone),
          longestStreak: user.longestStreak,
          totalSessionMinutes: user.totalSessionMinutes,
          totalSessions,
          xpToNextLevel: xpToNext,
          levelProgress: progress,
          dueCards,
        },
        recentSessions: user.sessions.map((s) => ({
          id: s.id, companionName: s.companion.name, subject: s.companion.subject, topic: s.companion.topic,
          durationMinutes: s.durationMinutes, xpEarned: s.xpEarned, createdAt: s.createdAt,
        })),
        companions: user.companions.map((c) => ({
          id: c.id, name: c.name, subject: c.subject, topic: c.topic, description: c.description, style: c.style, sessionsCount: c._count.sessions,
        })),
        achievements: user.achievements,
      },
    };
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return { data: null, error: "Failed to load dashboard" };
  }
}
