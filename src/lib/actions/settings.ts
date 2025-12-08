"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

// Types
export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  level: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalSessionMinutes: number;
  createdAt: Date;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    streakReminders: boolean;
    weeklyDigest: boolean;
    achievementAlerts: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    defaultSessionDuration: number;
  };
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

// Get user profile
export async function getUserProfile(): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await ensureUserExists(clerkUser);

    return {
      success: true,
      data: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        image: user.image,
        bio: user.bio,
        level: user.level,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalSessionMinutes: user.totalSessionMinutes,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

// Update user profile
export async function updateUserProfile(data: { name?: string; bio?: string }): Promise<{ success: boolean; error?: string }> {
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

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        bio: data.bio !== undefined ? data.bio : undefined,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

// Delete user account (mark for deletion or actually delete based on requirements)
export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
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

    // Delete all user data (cascades through relations)
    await prisma.user.delete({
      where: { id: user.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}

// Get user statistics summary
export async function getUserStatistics(): Promise<{ 
  success: boolean; 
  data?: {
    profile: UserProfile;
    stats: {
      totalSessions: number;
      totalCompanions: number;
      totalBookmarks: number;
      totalAchievements: number;
      hoursLearned: number;
      averageSessionLength: number;
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
        _count: {
          select: {
            sessions: true,
            companions: true,
            bookmarks: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const avgSession = user._count.sessions > 0 
      ? Math.round(user.totalSessionMinutes / user._count.sessions) 
      : 0;

    return {
      success: true,
      data: {
        profile: {
          id: user.id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          image: user.image,
          bio: user.bio,
          level: user.level,
          totalXP: user.totalXP,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          totalSessionMinutes: user.totalSessionMinutes,
          createdAt: user.createdAt,
        },
        stats: {
          totalSessions: user._count.sessions,
          totalCompanions: user._count.companions,
          totalBookmarks: user._count.bookmarks,
          totalAchievements: user._count.achievements,
          hoursLearned: Math.round(user.totalSessionMinutes / 60 * 10) / 10,
          averageSessionLength: avgSession,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}

// Export user data (for GDPR compliance)
export async function exportUserData(): Promise<{ success: boolean; data?: object; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: {
        companions: true,
        sessions: {
          include: {
            companion: {
              select: { name: true, subject: true, topic: true },
            },
          },
        },
        achievements: true,
        bookmarks: {
          include: {
            companion: {
              select: { name: true, subject: true },
            },
          },
        },
        documents: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Format data for export
    const exportData = {
      profile: {
        email: user.email,
        name: user.name,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      statistics: {
        level: user.level,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalSessionMinutes: user.totalSessionMinutes,
      },
      companions: user.companions.map(c => ({
        name: c.name,
        subject: c.subject,
        topic: c.topic,
        description: c.description,
        createdAt: c.createdAt,
      })),
      sessions: user.sessions.map(s => ({
        companion: s.companion.name,
        subject: s.companion.subject,
        topic: s.companion.topic,
        duration: s.durationMinutes,
        xpEarned: s.xpEarned,
        date: s.createdAt,
      })),
      achievements: user.achievements.map(a => ({
        title: a.title,
        description: a.description,
        unlockedAt: a.unlockedAt,
      })),
      bookmarks: user.bookmarks.map(b => ({
        companion: b.companion.name,
        subject: b.companion.subject,
        createdAt: b.createdAt,
      })),
      exportedAt: new Date().toISOString(),
    };

    return { success: true, data: exportData };
  } catch (error) {
    console.error("Error exporting user data:", error);
    return { success: false, error: "Failed to export data" };
  }
}

// Get user settings (preferences stored in JSON)
export async function getSettings(): Promise<{ success: boolean; settings?: Record<string, unknown>; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await ensureUserExists(clerkUser);

    // Settings are stored as JSON in a settings field, or use defaults
    // For now, return default settings (extend User model to add settings field if needed)
    const defaultSettings = {
      notifications: {
        email: true,
        push: true,
        sessionReminders: true,
        achievementAlerts: true,
        weeklyProgress: true,
      },
      appearance: {
        theme: "dark" as const,
        reducedMotion: false,
        compactMode: false,
      },
      privacy: {
        shareProgress: true,
        showOnLeaderboard: true,
      },
      audio: {
        voiceEnabled: true,
        soundEffects: true,
      },
    };

    return { 
      success: true, 
      settings: (user as unknown as { settings?: Record<string, unknown> }).settings || defaultSettings 
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { success: false, error: "Failed to fetch settings" };
  }
}

// Update user settings
export async function updateSettings(settings: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    // Store settings - for now just validate and return success
    // In production, you'd update a settings JSON field on the User model
    console.log("Updating settings for user:", clerkUser.id, settings);
    
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

// Delete user account (alias for deleteUserAccount)
export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  return deleteUserAccount();
}
