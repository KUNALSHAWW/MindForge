import prisma from "@/lib/db";
import { newlyUnlocked, type AchievementDefinition, type AchievementStats } from "@/lib/gamification";

/** Current value of every achievement metric for a user, read from the database. */
export async function getAchievementStats(userId: string): Promise<AchievementStats> {
  const [user, sessions, longest, companionsUsed, companionsCreated, bookmarks, reviews] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { totalXP: true, longestStreak: true, totalSessionMinutes: true } }),
    prisma.sessionHistory.count({ where: { userId } }),
    prisma.sessionHistory.aggregate({ where: { userId }, _max: { durationMinutes: true } }),
    prisma.sessionHistory.groupBy({ by: ["companionId"], where: { userId } }),
    prisma.companion.count({ where: { authorId: userId } }),
    prisma.bookmark.count({ where: { userId } }),
    prisma.flashcard.aggregate({ where: { userId }, _sum: { reps: true } }),
  ]);
  return {
    sessions,
    streak: user.longestStreak,
    xp: user.totalXP,
    longestSession: longest._max.durationMinutes ?? 0,
    totalMinutes: user.totalSessionMinutes,
    companionsUsed: companionsUsed.length,
    companionsCreated,
    bookmarks,
    reviews: reviews._sum.reps ?? 0,
  };
}

/**
 * Evaluates all achievements and stores the newly earned ones.
 * Called after every action that can move a metric (session, companion, bookmark, review).
 */
export async function awardAchievements(userId: string): Promise<AchievementDefinition[]> {
  try {
    const [stats, owned] = await Promise.all([
      getAchievementStats(userId),
      prisma.achievement.findMany({ where: { userId }, select: { title: true } }),
    ]);
    const earned = newlyUnlocked(stats, owned.map((a) => a.title));
    if (earned.length) {
      await prisma.achievement.createMany({
        data: earned.map((a) => ({ userId, title: a.title, description: a.description, icon: a.icon })),
        skipDuplicates: true,
      });
    }
    return earned;
  } catch (error) {
    console.error("Achievement check failed:", error);
    return [];
  }
}
