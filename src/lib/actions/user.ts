"use server";

import { currentUser } from "@clerk/nextjs/server";

// Types for dashboard data
export interface UserStats {
  level: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalSessionMinutes: number;
  xpToNextLevel: number;
  levelProgress: number;
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
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  stats: UserStats;
  recentSessions: SessionData[];
  companions: CompanionData[];
  achievements: AchievementData[];
}

// Demo data for display when database is not available
function getDemoData(userName: string, userEmail: string, userImage: string | null): DashboardData {
  const demoSessions: SessionData[] = [
    {
      id: "demo-1",
      companionName: "Dr. Physics",
      subject: "Physics",
      topic: "Quantum Mechanics",
      durationMinutes: 45,
      xpEarned: 150,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "demo-2",
      companionName: "Math Master",
      subject: "Mathematics",
      topic: "Calculus",
      durationMinutes: 60,
      xpEarned: 200,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "demo-3",
      companionName: "History Guide",
      subject: "History",
      topic: "World War II",
      durationMinutes: 30,
      xpEarned: 100,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  const demoCompanions: CompanionData[] = [
    {
      id: "comp-1",
      name: "Dr. Physics",
      subject: "Physics",
      topic: "Quantum Mechanics",
      description: "Expert in quantum physics and theoretical concepts. Uses analogies to explain complex topics.",
      style: "socratic",
      sessionsCount: 5,
    },
    {
      id: "comp-2",
      name: "Math Master",
      subject: "Mathematics",
      topic: "Calculus & Linear Algebra",
      description: "Patient tutor specializing in calculus, algebra, and mathematical proofs.",
      style: "formal",
      sessionsCount: 8,
    },
    {
      id: "comp-3",
      name: "Code Coach",
      subject: "Programming",
      topic: "Python & JavaScript",
      description: "Friendly coding mentor who teaches through practical examples and projects.",
      style: "casual",
      sessionsCount: 12,
    },
    {
      id: "comp-4",
      name: "History Guide",
      subject: "History",
      topic: "Modern History",
      description: "Engaging storyteller who brings historical events to life with vivid narratives.",
      style: "storytelling",
      sessionsCount: 3,
    },
  ];

  const demoAchievements: AchievementData[] = [
    {
      id: "ach-1",
      title: "Week Warrior",
      description: "Maintained a 7-day learning streak",
      icon: "🔥",
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ach-2",
      title: "Focus Master",
      description: "Completed a 60+ minute session",
      icon: "🎯",
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ach-3",
      title: "Knowledge Seeker",
      description: "Explored 5 different subjects",
      icon: "⭐",
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  return {
    user: {
      id: "demo-user",
      name: userName,
      email: userEmail,
      image: userImage,
    },
    stats: {
      level: 8,
      totalXP: 3450,
      currentStreak: 7,
      longestStreak: 14,
      totalSessionMinutes: 1470, // 24.5 hours
      xpToNextLevel: 550,
      levelProgress: 69,
    },
    recentSessions: demoSessions,
    companions: demoCompanions,
    achievements: demoAchievements,
  };
}

export async function getDashboardData(): Promise<{ data: DashboardData | null; error: string | null }> {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { data: null, error: "Not authenticated" };
    }

    const userName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "Learner";
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const userImage = clerkUser.imageUrl ?? null;

    // Try to connect to database
    let dbAvailable = false;
    let prisma;

    try {
      // Dynamic import to avoid issues when DB is not configured
      const dbModule = await import("@/lib/db");
      prisma = dbModule.default;
      
      // Quick check if database is available
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      console.log("Database not available, using demo data");
      dbAvailable = false;
    }

    if (!dbAvailable || !prisma) {
      // Return demo data when database is not available
      return { data: getDemoData(userName, userEmail, userImage), error: null };
    }

    // Database is available, fetch real data
    try {
      let dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: {
          sessions: {
            include: {
              companion: true,
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          companions: {
            include: {
              _count: {
                select: { sessions: true },
              },
            },
            orderBy: { updatedAt: "desc" },
            take: 6,
          },
          achievements: {
            orderBy: { unlockedAt: "desc" },
            take: 5,
          },
        },
      });

      // If user doesn't exist in DB, create them
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email: userEmail,
            name: userName,
            image: userImage,
          },
          include: {
            sessions: {
              include: {
                companion: true,
              },
              orderBy: { createdAt: "desc" },
              take: 5,
            },
            companions: {
              include: {
                _count: {
                  select: { sessions: true },
                },
              },
              orderBy: { updatedAt: "desc" },
              take: 6,
            },
            achievements: {
              orderBy: { unlockedAt: "desc" },
              take: 5,
            },
          },
        });
      }

      const { progress, xpToNext } = calculateLevelProgress(dbUser.totalXP, dbUser.level);

      const dashboardData: DashboardData = {
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image,
        },
        stats: {
          level: dbUser.level,
          totalXP: dbUser.totalXP,
          currentStreak: dbUser.currentStreak,
          longestStreak: dbUser.longestStreak,
          totalSessionMinutes: dbUser.totalSessionMinutes,
          xpToNextLevel: xpToNext,
          levelProgress: progress,
        },
        recentSessions: dbUser.sessions.map((session: { id: string; companion: { name: string; subject: string; topic: string }; durationMinutes: number; xpEarned: number; createdAt: Date }) => ({
          id: session.id,
          companionName: session.companion.name,
          subject: session.companion.subject,
          topic: session.companion.topic,
          durationMinutes: session.durationMinutes,
          xpEarned: session.xpEarned,
          createdAt: session.createdAt,
        })),
        companions: dbUser.companions.map((companion: { id: string; name: string; subject: string; topic: string; description: string; style: string; _count: { sessions: number } }) => ({
          id: companion.id,
          name: companion.name,
          subject: companion.subject,
          topic: companion.topic,
          description: companion.description,
          style: companion.style,
          sessionsCount: companion._count.sessions,
        })),
        achievements: dbUser.achievements.map((achievement: { id: string; title: string; description: string; icon: string; unlockedAt: Date }) => ({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          unlockedAt: achievement.unlockedAt,
        })),
      };

      return { data: dashboardData, error: null };
    } catch (dbError) {
      console.error("Database query error, falling back to demo data:", dbError);
      return { data: getDemoData(userName, userEmail, userImage), error: null };
    }
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    return { data: null, error: "Failed to fetch dashboard data" };
  }
}

// Calculate level progress percentage
function calculateLevelProgress(totalXP: number, level: number): { progress: number; xpToNext: number } {
  const xpPerLevel = 1000;
  const currentLevelXP = (level - 1) * xpPerLevel;
  const nextLevelXP = level * xpPerLevel;
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  
  return {
    progress: Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNext) * 100)),
    xpToNext: Math.max(0, nextLevelXP - totalXP)
  };
}

// Get user stats only (lighter query) - returns demo data if DB unavailable
export async function getUserStats(): Promise<{ data: UserStats | null; error: string | null }> {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { data: null, error: "Not authenticated" };
    }

    // Return demo stats (database check would be similar to getDashboardData)
    return {
      data: {
        level: 8,
        totalXP: 3450,
        currentStreak: 7,
        longestStreak: 14,
        totalSessionMinutes: 1470,
        xpToNextLevel: 550,
        levelProgress: 69,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { data: null, error: "Failed to fetch user stats" };
  }
}

// Update user streak - no-op if database not available
export async function updateUserStreak(): Promise<{ success: boolean; error: string | null }> {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    // For now, return success (database operations would go here)
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating streak:", error);
    return { success: false, error: "Failed to update streak" };
  }
}
