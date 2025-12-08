"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

// Types
export interface AchievementData {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface AchievementDefinition {
  title: string;
  description: string;
  icon: string;
  category: "streak" | "xp" | "sessions" | "time" | "special";
  requirement: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

// All available achievements
const ACHIEVEMENT_DEFINITIONS: Omit<AchievementDefinition, "isUnlocked" | "unlockedAt">[] = [
  // Session achievements
  { title: "First Steps", description: "Complete your first learning session", icon: "🎯", category: "sessions", requirement: 1 },
  { title: "Getting Started", description: "Complete 5 learning sessions", icon: "📚", category: "sessions", requirement: 5 },
  { title: "Consistent Learner", description: "Complete 10 learning sessions", icon: "📖", category: "sessions", requirement: 10 },
  { title: "Dedicated Learner", description: "Complete 25 learning sessions", icon: "🎓", category: "sessions", requirement: 25 },
  { title: "Session Pro", description: "Complete 50 learning sessions", icon: "🏅", category: "sessions", requirement: 50 },
  { title: "Century Club", description: "Complete 100 learning sessions", icon: "💯", category: "sessions", requirement: 100 },
  
  // Streak achievements
  { title: "3-Day Streak", description: "Maintain a 3-day learning streak", icon: "🔥", category: "streak", requirement: 3 },
  { title: "Week Warrior", description: "Maintain a 7-day learning streak", icon: "⚡", category: "streak", requirement: 7 },
  { title: "Two Week Champion", description: "Maintain a 14-day learning streak", icon: "💪", category: "streak", requirement: 14 },
  { title: "Streak Master", description: "Maintain a 30-day learning streak", icon: "🌟", category: "streak", requirement: 30 },
  { title: "Unstoppable", description: "Maintain a 60-day learning streak", icon: "🚀", category: "streak", requirement: 60 },
  { title: "Legendary Streak", description: "Maintain a 100-day learning streak", icon: "👑", category: "streak", requirement: 100 },
  
  // XP achievements
  { title: "XP Starter", description: "Earn 500 total XP", icon: "⭐", category: "xp", requirement: 500 },
  { title: "XP Hunter", description: "Earn 1,000 total XP", icon: "✨", category: "xp", requirement: 1000 },
  { title: "XP Collector", description: "Earn 5,000 total XP", icon: "🌠", category: "xp", requirement: 5000 },
  { title: "XP Champion", description: "Earn 10,000 total XP", icon: "🏆", category: "xp", requirement: 10000 },
  { title: "XP Master", description: "Earn 25,000 total XP", icon: "💎", category: "xp", requirement: 25000 },
  { title: "Knowledge Seeker", description: "Earn 50,000 total XP", icon: "👑", category: "xp", requirement: 50000 },
  
  // Time achievements
  { title: "Focus Mode", description: "Complete a 30+ minute session", icon: "🧘", category: "time", requirement: 30 },
  { title: "Deep Dive", description: "Complete a 60+ minute session", icon: "🌊", category: "time", requirement: 60 },
  { title: "Marathon Learner", description: "Complete a 90+ minute session", icon: "🏃", category: "time", requirement: 90 },
  { title: "Hour Master", description: "Spend 10 total hours learning", icon: "⏰", category: "time", requirement: 600 },
  { title: "Time Investor", description: "Spend 50 total hours learning", icon: "⌛", category: "time", requirement: 3000 },
  { title: "Time Champion", description: "Spend 100 total hours learning", icon: "🕐", category: "time", requirement: 6000 },
  
  // Special achievements
  { title: "Explorer", description: "Learn from 5 different companions", icon: "🧭", category: "special", requirement: 5 },
  { title: "Creator", description: "Create your first AI companion", icon: "🎨", category: "special", requirement: 1 },
  { title: "Companion Master", description: "Create 5 AI companions", icon: "🤖", category: "special", requirement: 5 },
  { title: "Bookworm", description: "Bookmark 10 companions", icon: "📌", category: "special", requirement: 10 },
];

// Get user achievements with all available achievements
export async function getAchievements(): Promise<{ 
  success: boolean; 
  data?: { 
    unlocked: AchievementData[]; 
    all: AchievementDefinition[];
    stats: {
      totalUnlocked: number;
      totalAvailable: number;
      percentComplete: number;
    };
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
      include: {
        achievements: {
          orderBy: { unlockedAt: "desc" },
        },
      },
    });

    if (!user) {
      // Return empty achievements for new users
      const allAchievements: AchievementDefinition[] = ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        isUnlocked: false,
      }));

      return {
        success: true,
        data: {
          unlocked: [],
          all: allAchievements,
          stats: {
            totalUnlocked: 0,
            totalAvailable: ACHIEVEMENT_DEFINITIONS.length,
            percentComplete: 0,
          },
        },
      };
    }

    const unlockedTitles = new Set(user.achievements.map(a => a.title));
    
    const allAchievements: AchievementDefinition[] = ACHIEVEMENT_DEFINITIONS.map(def => {
      const unlockedAchievement = user.achievements.find(a => a.title === def.title);
      return {
        ...def,
        isUnlocked: unlockedTitles.has(def.title),
        unlockedAt: unlockedAchievement?.unlockedAt,
      };
    });

    const unlocked: AchievementData[] = user.achievements.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      unlockedAt: a.unlockedAt,
    }));

    return {
      success: true,
      data: {
        unlocked,
        all: allAchievements,
        stats: {
          totalUnlocked: unlocked.length,
          totalAvailable: ACHIEVEMENT_DEFINITIONS.length,
          percentComplete: Math.round((unlocked.length / ACHIEVEMENT_DEFINITIONS.length) * 100),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return { success: false, error: "Failed to fetch achievements" };
  }
}

// Get recent achievements (for dashboard)
export async function getRecentAchievements(limit: number = 5): Promise<{ success: boolean; data?: AchievementData[]; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: {
        achievements: {
          orderBy: { unlockedAt: "desc" },
          take: limit,
        },
      },
    });

    if (!user) {
      return { success: true, data: [] };
    }

    const achievements: AchievementData[] = user.achievements.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      unlockedAt: a.unlockedAt,
    }));

    return { success: true, data: achievements };
  } catch (error) {
    console.error("Error fetching recent achievements:", error);
    return { success: false, error: "Failed to fetch achievements" };
  }
}

// Get achievement progress
export async function getAchievementProgress(): Promise<{ 
  success: boolean; 
  data?: {
    sessions: { current: number; next: number };
    streak: { current: number; next: number };
    xp: { current: number; next: number };
    time: { current: number; next: number };
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
      include: {
        achievements: true,
        _count: {
          select: { sessions: true },
        },
      },
    });

    if (!user) {
      return {
        success: true,
        data: {
          sessions: { current: 0, next: 1 },
          streak: { current: 0, next: 3 },
          xp: { current: 0, next: 500 },
          time: { current: 0, next: 30 },
        },
      };
    }

    // Find next milestone for each category
    const sessionMilestones = [1, 5, 10, 25, 50, 100];
    const streakMilestones = [3, 7, 14, 30, 60, 100];
    const xpMilestones = [500, 1000, 5000, 10000, 25000, 50000];
    const timeMilestones = [30, 60, 90, 600, 3000, 6000];

    const findNextMilestone = (current: number, milestones: number[]): number => {
      for (const milestone of milestones) {
        if (current < milestone) return milestone;
      }
      return milestones[milestones.length - 1];
    };

    return {
      success: true,
      data: {
        sessions: { 
          current: user._count.sessions, 
          next: findNextMilestone(user._count.sessions, sessionMilestones) 
        },
        streak: { 
          current: user.currentStreak, 
          next: findNextMilestone(user.currentStreak, streakMilestones) 
        },
        xp: { 
          current: user.totalXP, 
          next: findNextMilestone(user.totalXP, xpMilestones) 
        },
        time: { 
          current: user.totalSessionMinutes, 
          next: findNextMilestone(user.totalSessionMinutes, timeMilestones) 
        },
      },
    };
  } catch (error) {
    console.error("Error fetching achievement progress:", error);
    return { success: false, error: "Failed to fetch achievement progress" };
  }
}
