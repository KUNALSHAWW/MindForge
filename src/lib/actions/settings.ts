"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { DEFAULT_SETTINGS, SettingsSchema, UpdateProfileSchema, firstError, type Settings } from "@/lib/validators";

type Result<T> = { success: true; data: T } | { success: false; error: string };

export interface ProfileAndSettings {
  name: string;
  bio: string;
  settings: Settings;
  demo: boolean;
}

export async function getProfileAndSettings(): Promise<Result<ProfileAndSettings>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  const fallbackName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();

  try {
    if (!(await isDatabaseAvailable())) return { success: true, data: { name: fallbackName, bio: "", settings: DEFAULT_SETTINGS, demo: true } };
    const user = await ensureUser(clerkUser);
    // Stored settings are merged over defaults so new preference keys never break old rows.
    const stored = SettingsSchema.deepPartial().safeParse(user.settings ?? {});
    const s = stored.success ? stored.data : {};
    const settings: Settings = {
      appearance: { ...DEFAULT_SETTINGS.appearance, ...s.appearance },
      learning: { ...DEFAULT_SETTINGS.learning, ...s.learning },
    };
    return { success: true, data: { name: user.name ?? fallbackName, bio: user.bio ?? "", settings, demo: false } };
  } catch (error) {
    console.error("Error loading settings:", error);
    return { success: false, error: "Failed to load settings" };
  }
}

export async function updateSettings(input: Settings): Promise<Result<null>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  const parsed = SettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };
  if (!(await isDatabaseAvailable())) return { success: false, error: "Settings need a database (DATABASE_URL) to be saved" };

  try {
    const user = await ensureUser(clerkUser);
    await prisma.user.update({ where: { id: user.id }, data: { settings: parsed.data } });
    revalidatePath("/settings");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}

export async function updateProfile(input: { name?: string; bio?: string }): Promise<Result<null>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  const parsed = UpdateProfileSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };
  if (!(await isDatabaseAvailable())) return { success: false, error: "Your profile needs a database (DATABASE_URL) to be saved" };

  try {
    const user = await ensureUser(clerkUser);
    await prisma.user.update({ where: { id: user.id }, data: parsed.data });
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

/** Everything stored about the user as one JSON document (data portability). */
export async function exportUserData(): Promise<Result<object>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  if (!(await isDatabaseAvailable())) return { success: false, error: "Nothing to export in demo mode" };

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: {
        companions: true,
        sessions: { include: { companion: { select: { name: true } } }, orderBy: { createdAt: "asc" } },
        achievements: true,
        bookmarks: { include: { companion: { select: { name: true } } } },
        documents: { select: { title: true, subject: true, content: true, createdAt: true } },
        flashcards: true,
      },
    });
    if (!user) return { success: false, error: "No data stored yet" };

    return {
      success: true,
      data: {
        exportedAt: new Date().toISOString(),
        profile: { email: user.email, name: user.name, bio: user.bio, timeZone: user.timeZone, settings: user.settings, createdAt: user.createdAt },
        progress: {
          level: user.level, totalXP: user.totalXP, currentStreak: user.currentStreak,
          longestStreak: user.longestStreak, totalSessionMinutes: user.totalSessionMinutes,
        },
        companions: user.companions.map(({ name, subject, topic, description, duration, style, voice, createdAt }) => ({ name, subject, topic, description, duration, style, voice, createdAt })),
        sessions: user.sessions.map((s) => ({
          companion: s.companion.name, durationMinutes: s.durationMinutes, xpEarned: s.xpEarned, summary: s.notes, transcript: s.transcript, date: s.createdAt,
        })),
        achievements: user.achievements.map(({ title, description, unlockedAt }) => ({ title, description, unlockedAt })),
        bookmarks: user.bookmarks.map((b) => ({ companion: b.companion.name, createdAt: b.createdAt })),
        notes: user.documents,
        flashcards: user.flashcards.map(({ front, back, subject, stability, difficulty, reps, lapses, due, lastReview }) => ({ front, back, subject, stability, difficulty, reps, lapses, due, lastReview })),
      },
    };
  } catch (error) {
    console.error("Error exporting data:", error);
    return { success: false, error: "Failed to export data" };
  }
}

/** Deletes all app data (cascading through every relation) and the Clerk account itself. */
export async function deleteAccount(): Promise<Result<null>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };

  try {
    if (await isDatabaseAvailable()) await prisma.user.deleteMany({ where: { clerkId: clerkUser.id } });
    const clerk = await clerkClient();
    await clerk.users.deleteUser(clerkUser.id);
    return { success: true, data: null };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
