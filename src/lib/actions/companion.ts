"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

// Types
export interface CreateCompanionInput {
  name: string;
  subject: string;
  topic: string;
  description: string;
  duration: number;
  style: "formal" | "casual" | "socratic" | "storytelling";
  voice: "male" | "female";
}

export interface CompanionWithStats {
  id: string;
  name: string;
  subject: string;
  topic: string;
  description: string;
  duration: number;
  style: string;
  voice: string;
  authorId: string;
  authorName: string | null;
  sessionsCount: number;
  bookmarksCount: number;
  isBookmarked: boolean;
  createdAt: Date;
}

// Ensure user exists in database, create if not
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

// Create a new companion
export async function createCompanion(input: CreateCompanionInput): Promise<{ success: boolean; data?: CompanionWithStats; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await ensureUserExists(clerkUser);

    const companion = await prisma.companion.create({
      data: {
        name: input.name,
        subject: input.subject,
        topic: input.topic,
        description: input.description,
        duration: input.duration,
        style: input.style,
        voice: input.voice,
        authorId: user.id,
      },
      include: {
        author: {
          select: { name: true },
        },
        _count: {
          select: { sessions: true, bookmarks: true },
        },
      },
    });

    revalidatePath("/companions");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        id: companion.id,
        name: companion.name,
        subject: companion.subject,
        topic: companion.topic,
        description: companion.description,
        duration: companion.duration,
        style: companion.style,
        voice: companion.voice,
        authorId: companion.authorId,
        authorName: companion.author.name,
        sessionsCount: companion._count.sessions,
        bookmarksCount: companion._count.bookmarks,
        isBookmarked: false,
        createdAt: companion.createdAt,
      },
    };
  } catch (error) {
    console.error("Error creating companion:", error);
    return { success: false, error: "Failed to create companion" };
  }
}

// Get all companions with filtering
export async function getCompanions(filter?: { subject?: string; search?: string }): Promise<{ success: boolean; data?: CompanionWithStats[]; error?: string }> {
  try {
    const clerkUser = await currentUser();
    let userId: string | null = null;

    if (clerkUser) {
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      });
      userId = user?.id ?? null;
    }

    const whereClause: {
      subject?: string;
      OR?: Array<{ name: { contains: string; mode: "insensitive" } } | { topic: { contains: string; mode: "insensitive" } } | { description: { contains: string; mode: "insensitive" } }>;
    } = {};

    if (filter?.subject && filter.subject !== "all") {
      whereClause.subject = filter.subject;
    }

    if (filter?.search) {
      whereClause.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { topic: { contains: filter.search, mode: "insensitive" } },
        { description: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const companions = await prisma.companion.findMany({
      where: whereClause,
      include: {
        author: {
          select: { name: true },
        },
        _count: {
          select: { sessions: true, bookmarks: true },
        },
        bookmarks: userId ? {
          where: { userId },
        } : false,
      },
      orderBy: { createdAt: "desc" },
    });

    const companionsWithStats: CompanionWithStats[] = companions.map((companion) => ({
      id: companion.id,
      name: companion.name,
      subject: companion.subject,
      topic: companion.topic,
      description: companion.description,
      duration: companion.duration,
      style: companion.style,
      voice: companion.voice,
      authorId: companion.authorId,
      authorName: companion.author.name,
      sessionsCount: companion._count.sessions,
      bookmarksCount: companion._count.bookmarks,
      isBookmarked: userId ? (companion.bookmarks as { userId: string }[]).length > 0 : false,
      createdAt: companion.createdAt,
    }));

    return { success: true, data: companionsWithStats };
  } catch (error) {
    console.error("Error fetching companions:", error);
    return { success: false, error: "Failed to fetch companions" };
  }
}

// Get a single companion by ID
export async function getCompanion(id: string): Promise<{ success: boolean; data?: CompanionWithStats; error?: string }> {
  try {
    const clerkUser = await currentUser();
    let userId: string | null = null;

    if (clerkUser) {
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      });
      userId = user?.id ?? null;
    }

    const companion = await prisma.companion.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true },
        },
        _count: {
          select: { sessions: true, bookmarks: true },
        },
        bookmarks: userId ? {
          where: { userId },
        } : false,
      },
    });

    if (!companion) {
      return { success: false, error: "Companion not found" };
    }

    return {
      success: true,
      data: {
        id: companion.id,
        name: companion.name,
        subject: companion.subject,
        topic: companion.topic,
        description: companion.description,
        duration: companion.duration,
        style: companion.style,
        voice: companion.voice,
        authorId: companion.authorId,
        authorName: companion.author.name,
        sessionsCount: companion._count.sessions,
        bookmarksCount: companion._count.bookmarks,
        isBookmarked: userId ? (companion.bookmarks as { userId: string }[]).length > 0 : false,
        createdAt: companion.createdAt,
      },
    };
  } catch (error) {
    console.error("Error fetching companion:", error);
    return { success: false, error: "Failed to fetch companion" };
  }
}

// Toggle bookmark for a companion
export async function toggleBookmark(companionId: string): Promise<{ success: boolean; isBookmarked?: boolean; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await ensureUserExists(clerkUser);

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_companionId: {
          userId: user.id,
          companionId,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      revalidatePath("/companions");
      return { success: true, isBookmarked: false };
    } else {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          companionId,
        },
      });
      revalidatePath("/companions");
      return { success: true, isBookmarked: true };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to toggle bookmark" };
  }
}

// Delete a companion (only by author)
export async function deleteCompanion(companionId: string): Promise<{ success: boolean; error?: string }> {
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

    const companion = await prisma.companion.findUnique({
      where: { id: companionId },
    });

    if (!companion) {
      return { success: false, error: "Companion not found" };
    }

    if (companion.authorId !== user.id) {
      return { success: false, error: "Not authorized to delete this companion" };
    }

    await prisma.companion.delete({
      where: { id: companionId },
    });

    revalidatePath("/companions");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting companion:", error);
    return { success: false, error: "Failed to delete companion" };
  }
}

// Get user's companions
export async function getUserCompanions(): Promise<{ success: boolean; data?: CompanionWithStats[]; error?: string }> {
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

    const companions = await prisma.companion.findMany({
      where: { authorId: user.id },
      include: {
        author: {
          select: { name: true },
        },
        _count: {
          select: { sessions: true, bookmarks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const companionsWithStats: CompanionWithStats[] = companions.map((companion) => ({
      id: companion.id,
      name: companion.name,
      subject: companion.subject,
      topic: companion.topic,
      description: companion.description,
      duration: companion.duration,
      style: companion.style,
      voice: companion.voice,
      authorId: companion.authorId,
      authorName: companion.author.name,
      sessionsCount: companion._count.sessions,
      bookmarksCount: companion._count.bookmarks,
      isBookmarked: true,
      createdAt: companion.createdAt,
    }));

    return { success: true, data: companionsWithStats };
  } catch (error) {
    console.error("Error fetching user companions:", error);
    return { success: false, error: "Failed to fetch companions" };
  }
}

// Get bookmarked companions
export async function getBookmarkedCompanions(): Promise<{ success: boolean; data?: CompanionWithStats[]; error?: string }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: {
        bookmarks: {
          include: {
            companion: {
              include: {
                author: {
                  select: { name: true },
                },
                _count: {
                  select: { sessions: true, bookmarks: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { success: true, data: [] };
    }

    const companionsWithStats: CompanionWithStats[] = user.bookmarks.map((bookmark) => ({
      id: bookmark.companion.id,
      name: bookmark.companion.name,
      subject: bookmark.companion.subject,
      topic: bookmark.companion.topic,
      description: bookmark.companion.description,
      duration: bookmark.companion.duration,
      style: bookmark.companion.style,
      voice: bookmark.companion.voice,
      authorId: bookmark.companion.authorId,
      authorName: bookmark.companion.author.name,
      sessionsCount: bookmark.companion._count.sessions,
      bookmarksCount: bookmark.companion._count.bookmarks,
      isBookmarked: true,
      createdAt: bookmark.companion.createdAt,
    }));

    return { success: true, data: companionsWithStats };
  } catch (error) {
    console.error("Error fetching bookmarked companions:", error);
    return { success: false, error: "Failed to fetch bookmarked companions" };
  }
}
