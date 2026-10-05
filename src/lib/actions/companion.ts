"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { demo, type DemoCompanion } from "@/lib/demo";
import { awardAchievements } from "@/lib/achievements";
import { CreateCompanionSchema, firstError, type CreateCompanionInput } from "@/lib/validators";

export interface CompanionWithStats {
  id: string;
  name: string;
  subject: string;
  topic: string;
  description: string;
  duration: number;
  style: string;
  voice: string;
  authorName: string | null;
  sessionsCount: number;
  bookmarksCount: number;
  isBookmarked: boolean;
  isOwner: boolean;
  createdAt: Date;
}

type Result<T = undefined> = { success: true; data: T; newAchievements?: string[] } | { success: false; error: string };

function fromDemo(c: DemoCompanion, clerkId: string | null): CompanionWithStats {
  const { authorId, ...rest } = c;
  return { ...rest, isBookmarked: demo.bookmarks.has(c.id), isOwner: authorId === clerkId };
}

const companionInclude = (userId: string | null) => ({
  author: { select: { name: true } },
  _count: { select: { sessions: true, bookmarks: true } },
  bookmarks: { where: { userId: userId ?? "" }, select: { id: true } },
});

type CompanionRow = {
  id: string; name: string; subject: string; topic: string; description: string; duration: number;
  style: string; voice: string; authorId: string; createdAt: Date;
  author: { name: string | null }; _count: { sessions: number; bookmarks: number }; bookmarks: { id: string }[];
};

function toCompanion(c: CompanionRow, userId: string | null): CompanionWithStats {
  return {
    id: c.id, name: c.name, subject: c.subject, topic: c.topic, description: c.description,
    duration: c.duration, style: c.style, voice: c.voice, authorName: c.author.name,
    sessionsCount: c._count.sessions, bookmarksCount: c._count.bookmarks,
    isBookmarked: c.bookmarks.length > 0, isOwner: c.authorId === userId, createdAt: c.createdAt,
  };
}

async function currentDbUserId(): Promise<string | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id }, select: { id: true } });
  return user?.id ?? null;
}

export async function createCompanion(input: CreateCompanionInput): Promise<Result<CompanionWithStats>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };

  const parsed = CreateCompanionSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };
  const data = parsed.data;

  try {
    if (!(await isDatabaseAvailable())) {
      const companion: DemoCompanion = {
        ...data, id: `local-${Date.now()}`, authorId: clerkUser.id, authorName: clerkUser.firstName || "You",
        sessionsCount: 0, bookmarksCount: 0, createdAt: new Date(),
      };
      demo.companions.unshift(companion);
      revalidatePath("/companions");
      return { success: true, data: fromDemo(companion, clerkUser.id) };
    }

    const user = await ensureUser(clerkUser);
    const companion = await prisma.companion.create({ data: { ...data, authorId: user.id }, include: companionInclude(user.id) });
    const earned = await awardAchievements(user.id);

    revalidatePath("/companions");
    revalidatePath("/dashboard");
    return { success: true, data: toCompanion(companion, user.id), newAchievements: earned.map((a) => a.title) };
  } catch (error) {
    console.error("Error creating companion:", error);
    return { success: false, error: "Failed to create companion" };
  }
}

export async function getCompanions(filter?: { subject?: string; search?: string }): Promise<Result<CompanionWithStats[]>> {
  const subject = filter?.subject && filter.subject !== "all" ? filter.subject : undefined;
  const search = filter?.search?.trim().slice(0, 100);

  try {
    if (!(await isDatabaseAvailable())) {
      const clerkUser = await currentUser();
      const q = search?.toLowerCase();
      const data = demo.companions
        .filter((c) => !subject || c.subject === subject)
        .filter((c) => !q || [c.name, c.topic, c.description].some((f) => f.toLowerCase().includes(q)))
        .map((c) => fromDemo(c, clerkUser?.id ?? null));
      return { success: true, data };
    }

    const userId = await currentDbUserId();
    const companions = await prisma.companion.findMany({
      where: {
        ...(subject && { subject }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { topic: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      },
      include: companionInclude(userId),
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return { success: true, data: companions.map((c) => toCompanion(c, userId)) };
  } catch (error) {
    console.error("Error fetching companions:", error);
    return { success: false, error: "Failed to load companions" };
  }
}

export async function getCompanion(id: string): Promise<Result<CompanionWithStats>> {
  try {
    if (!(await isDatabaseAvailable())) {
      const clerkUser = await currentUser();
      const companion = demo.companions.find((c) => c.id === id);
      return companion ? { success: true, data: fromDemo(companion, clerkUser?.id ?? null) } : { success: false, error: "Companion not found" };
    }

    const userId = await currentDbUserId();
    const companion = await prisma.companion.findUnique({ where: { id }, include: companionInclude(userId) });
    return companion ? { success: true, data: toCompanion(companion, userId) } : { success: false, error: "Companion not found" };
  } catch (error) {
    console.error("Error fetching companion:", error);
    return { success: false, error: "Failed to load companion" };
  }
}

export async function toggleBookmark(companionId: string): Promise<Result<{ isBookmarked: boolean }>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };

  try {
    if (!(await isDatabaseAvailable())) {
      const isBookmarked = !demo.bookmarks.delete(companionId);
      if (isBookmarked) demo.bookmarks.add(companionId);
      revalidatePath("/companions");
      return { success: true, data: { isBookmarked } };
    }

    const user = await ensureUser(clerkUser);
    const key = { userId_companionId: { userId: user.id, companionId } };
    const existing = await prisma.bookmark.findUnique({ where: key });
    if (existing) {
      await prisma.bookmark.delete({ where: key });
    } else {
      await prisma.bookmark.create({ data: { userId: user.id, companionId } });
    }
    const earned = existing ? [] : await awardAchievements(user.id);
    revalidatePath("/companions");
    return { success: true, data: { isBookmarked: !existing }, newAchievements: earned.map((a) => a.title) };
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to update bookmark" };
  }
}

export async function deleteCompanion(companionId: string): Promise<Result> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };

  try {
    if (!(await isDatabaseAvailable())) {
      const index = demo.companions.findIndex((c) => c.id === companionId);
      if (index === -1) return { success: false, error: "Companion not found" };
      if (demo.companions[index].authorId !== clerkUser.id) return { success: false, error: "Only the author can delete this companion" };
      demo.companions.splice(index, 1);
      demo.bookmarks.delete(companionId);
    } else {
      // deleteMany with the author in the filter makes the ownership check and delete atomic
      const { count } = await prisma.companion.deleteMany({ where: { id: companionId, author: { clerkId: clerkUser.id } } });
      if (count === 0) return { success: false, error: "Companion not found or you are not its author" };
    }
    revalidatePath("/companions");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting companion:", error);
    return { success: false, error: "Failed to delete companion" };
  }
}
