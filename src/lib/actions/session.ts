"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

// Types
export interface SessionInput {
  companionId: string;
  durationMinutes: number;
  transcript: string;
  notes?: string;
}

export interface SessionWithDetails {
  id: string;
  companionId: string;
  companionName: string;
  companionSubject: string;
  companionTopic: string;
  durationMinutes: number;
  transcript: string;
  xpEarned: number;
  notes: string | null;
  createdAt: Date;
}

// Ensure user exists in database
async function ensureUserExists(clerkUser: { id: string; emailAddresses: { emailAddress: string }[]; firstName?: string | null; lastName?: string | null; imageUrl?: string | null }) {
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;
  
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        name,
        image: clerkUser.imageUrl ?? null,
      },
    });
  }

  return user;
}

// Calculate XP based on session duration and streak
function calculateXP(durationMinutes: number, currentStreak: number): number {
  const baseXP = Math.floor(durationMinutes * 3); // 3 XP per minute
  const streakMultiplier = 1 + (currentStreak * 0.1); // 10% bonus per streak day
  return Math.floor(baseXP * Math.min(streakMultiplier, 2)); // Cap at 2x
}

// Calculate level from total XP
function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 1000) + 1;
}

// Create a new session
export async function createSession(input: SessionInput): Promise<{ success: boolean; data?: SessionWithDetails; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await ensureUserExists(clerkUser);

    // Check if companion exists
    const companion = await prisma.companion.findUnique({
      where: { id: input.companionId },
    });

    if (!companion) {
      return { success: false, error: "Companion not found" };
    }

    // Calculate XP earned
    const xpEarned = calculateXP(input.durationMinutes, user.currentStreak);

    // Update streak (check if last session was yesterday or today)
    const lastSession = await prisma.sessionHistory.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    let newStreak = user.currentStreak;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (lastSession) {
      const lastSessionDate = new Date(lastSession.createdAt);
      const lastDate = new Date(lastSessionDate.getFullYear(), lastSessionDate.getMonth(), lastSessionDate.getDate());
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Yesterday - increment streak
        newStreak = user.currentStreak + 1;
      } else if (daysDiff > 1) {
        // More than 1 day - reset streak
        newStreak = 1;
      }
      // daysDiff === 0 means same day, keep streak
    } else {
      // First session ever
      newStreak = 1;
    }

    // Create session and update user stats in a transaction
    const [session] = await prisma.$transaction([
      prisma.sessionHistory.create({
        data: {
          userId: user.id,
          companionId: input.companionId,
          durationMinutes: input.durationMinutes,
          transcript: input.transcript,
          xpEarned,
          notes: input.notes ?? null,
        },
        include: {
          companion: {
            select: { name: true, subject: true, topic: true },
          },
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          totalXP: { increment: xpEarned },
          totalSessionMinutes: { increment: input.durationMinutes },
          currentStreak: newStreak,
          longestStreak: Math.max(user.longestStreak, newStreak),
          level: calculateLevel(user.totalXP + xpEarned),
        },
      }),
    ]);

    // Check for achievements
    await checkAndAwardAchievements(user.id, {
      newStreak,
      totalXP: user.totalXP + xpEarned,
      sessionDuration: input.durationMinutes,
      totalSessions: await prisma.sessionHistory.count({ where: { userId: user.id } }),
    });

    revalidatePath("/dashboard");
    revalidatePath("/journey");

    return {
      success: true,
      data: {
        id: session.id,
        companionId: session.companionId,
        companionName: session.companion.name,
        companionSubject: session.companion.subject,
        companionTopic: session.companion.topic,
        durationMinutes: session.durationMinutes,
        transcript: session.transcript,
        xpEarned: session.xpEarned,
        notes: session.notes,
        createdAt: session.createdAt,
      },
    };
  } catch (error) {
    console.error("Error creating session:", error);
    return { success: false, error: "Failed to create session" };
  }
}

// Get user's session history
export async function getUserSessions(limit?: number): Promise<{ success: boolean; data?: SessionWithDetails[]; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return { success: true, data: [] };
    }

    const sessions = await prisma.sessionHistory.findMany({
      where: { userId: user.id },
      include: {
        companion: {
          select: { name: true, subject: true, topic: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const sessionsWithDetails: SessionWithDetails[] = sessions.map((session) => ({
      id: session.id,
      companionId: session.companionId,
      companionName: session.companion.name,
      companionSubject: session.companion.subject,
      companionTopic: session.companion.topic,
      durationMinutes: session.durationMinutes,
      transcript: session.transcript,
      xpEarned: session.xpEarned,
      notes: session.notes,
      createdAt: session.createdAt,
    }));

    return { success: true, data: sessionsWithDetails };
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return { success: false, error: "Failed to fetch sessions" };
  }
}

// Get a single session by ID
export async function getSession(id: string): Promise<{ success: boolean; data?: SessionWithDetails; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const session = await prisma.sessionHistory.findUnique({
      where: { id },
      include: {
        companion: {
          select: { name: true, subject: true, topic: true },
        },
      },
    });

    if (!session || session.userId !== user.id) {
      return { success: false, error: "Session not found" };
    }

    return {
      success: true,
      data: {
        id: session.id,
        companionId: session.companionId,
        companionName: session.companion.name,
        companionSubject: session.companion.subject,
        companionTopic: session.companion.topic,
        durationMinutes: session.durationMinutes,
        transcript: session.transcript,
        xpEarned: session.xpEarned,
        notes: session.notes,
        createdAt: session.createdAt,
      },
    };
  } catch (error) {
    console.error("Error fetching session:", error);
    return { success: false, error: "Failed to fetch session" };
  }
}

// Achievement definitions
const ACHIEVEMENTS = [
  { title: "First Steps", description: "Complete your first learning session", icon: "🎯", condition: (stats: AchievementCheckStats) => stats.totalSessions >= 1 },
  { title: "Getting Started", description: "Complete 5 learning sessions", icon: "📚", condition: (stats: AchievementCheckStats) => stats.totalSessions >= 5 },
  { title: "Dedicated Learner", description: "Complete 25 learning sessions", icon: "🎓", condition: (stats: AchievementCheckStats) => stats.totalSessions >= 25 },
  { title: "Century Club", description: "Complete 100 learning sessions", icon: "💯", condition: (stats: AchievementCheckStats) => stats.totalSessions >= 100 },
  { title: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", condition: (stats: AchievementCheckStats) => stats.newStreak >= 7 },
  { title: "Streak Master", description: "Maintain a 30-day streak", icon: "⚡", condition: (stats: AchievementCheckStats) => stats.newStreak >= 30 },
  { title: "Focus Mode", description: "Complete a 30+ minute session", icon: "🧘", condition: (stats: AchievementCheckStats) => stats.sessionDuration >= 30 },
  { title: "Deep Dive", description: "Complete a 60+ minute session", icon: "🌊", condition: (stats: AchievementCheckStats) => stats.sessionDuration >= 60 },
  { title: "XP Hunter", description: "Earn 1,000 total XP", icon: "⭐", condition: (stats: AchievementCheckStats) => stats.totalXP >= 1000 },
  { title: "XP Champion", description: "Earn 10,000 total XP", icon: "🏆", condition: (stats: AchievementCheckStats) => stats.totalXP >= 10000 },
  { title: "Knowledge Seeker", description: "Earn 50,000 total XP", icon: "👑", condition: (stats: AchievementCheckStats) => stats.totalXP >= 50000 },
];

interface AchievementCheckStats {
  newStreak: number;
  totalXP: number;
  sessionDuration: number;
  totalSessions: number;
}

// Check and award achievements
async function checkAndAwardAchievements(userId: string, stats: AchievementCheckStats): Promise<void> {
  try {
    const existingAchievements = await prisma.achievement.findMany({
      where: { userId },
      select: { title: true },
    });

    const existingTitles = new Set(existingAchievements.map(a => a.title));

    const newAchievements = ACHIEVEMENTS.filter(
      achievement => !existingTitles.has(achievement.title) && achievement.condition(stats)
    );

    if (newAchievements.length > 0) {
      await prisma.achievement.createMany({
        data: newAchievements.map(achievement => ({
          userId,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
        })),
      });
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
}

// Get session statistics
export async function getSessionStats(): Promise<{ 
  success: boolean; 
  data?: { 
    totalSessions: number; 
    totalMinutes: number; 
    totalXP: number; 
    averageSessionLength: number;
    sessionsThisWeek: number;
    sessionsThisMonth: number;
  }; 
  error?: string 
}> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return { success: true, data: { totalSessions: 0, totalMinutes: 0, totalXP: 0, averageSessionLength: 0, sessionsThisWeek: 0, sessionsThisMonth: 0 } };
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalSessions, sessionsThisWeek, sessionsThisMonth, aggregateResult] = await Promise.all([
      prisma.sessionHistory.count({ where: { userId: user.id } }),
      prisma.sessionHistory.count({ where: { userId: user.id, createdAt: { gte: startOfWeek } } }),
      prisma.sessionHistory.count({ where: { userId: user.id, createdAt: { gte: startOfMonth } } }),
      prisma.sessionHistory.aggregate({
        where: { userId: user.id },
        _sum: { durationMinutes: true, xpEarned: true },
        _avg: { durationMinutes: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalSessions,
        totalMinutes: aggregateResult._sum.durationMinutes ?? 0,
        totalXP: aggregateResult._sum.xpEarned ?? 0,
        averageSessionLength: Math.round(aggregateResult._avg.durationMinutes ?? 0),
        sessionsThisWeek,
        sessionsThisMonth,
      },
    };
  } catch (error) {
    console.error("Error fetching session stats:", error);
    return { success: false, error: "Failed to fetch session stats" };
  }
}
