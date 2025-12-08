"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

// Demo companions for when database is not available
const demoCompanions: CompanionWithStats[] = [
  {
    id: "demo-1",
    name: "Dr. Physics",
    subject: "science",
    topic: "Quantum Mechanics",
    description: "Expert in quantum physics and theoretical concepts. Uses analogies to explain complex topics like wave-particle duality and quantum entanglement.",
    duration: 45,
    style: "socratic",
    voice: "male",
    authorId: "demo-user",
    authorName: "MindForge",
    sessionsCount: 128,
    bookmarksCount: 45,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "demo-2",
    name: "Math Master",
    subject: "maths",
    topic: "Calculus & Linear Algebra",
    description: "Patient tutor specializing in calculus, algebra, and mathematical proofs. Step-by-step problem solving approach.",
    duration: 60,
    style: "formal",
    voice: "female",
    authorId: "demo-user",
    authorName: "MindForge",
    sessionsCount: 256,
    bookmarksCount: 89,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: "demo-3",
    name: "Code Coach",
    subject: "coding",
    topic: "Python & JavaScript",
    description: "Friendly coding mentor who teaches through practical examples and projects. Great for beginners and intermediate developers.",
    duration: 45,
    style: "casual",
    voice: "male",
    authorId: "demo-user",
    authorName: "MindForge",
    sessionsCount: 312,
    bookmarksCount: 156,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: "demo-4",
    name: "History Guide",
    subject: "history",
    topic: "World History",
    description: "Engaging storyteller who brings historical events to life with vivid narratives. From ancient civilizations to modern history.",
    duration: 30,
    style: "storytelling",
    voice: "female",
    authorId: "demo-user",
    authorName: "MindForge",
    sessionsCount: 89,
    bookmarksCount: 34,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: "demo-5",
    name: "Language Pro",
    subject: "language",
    topic: "English & Spanish",
    description: "Multilingual tutor focused on conversational practice, grammar, and vocabulary building through immersive dialogue.",
    duration: 30,
    style: "casual",
    voice: "female",
    authorId: "demo-user",
    authorName: "MindForge",
    sessionsCount: 167,
    bookmarksCount: 78,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "demo-6",
    name: "Economics Expert",
    subject: "economics",
    topic: "Micro & Macro Economics",
    description: "Practical approach to economic concepts with real-world examples. Great for students and professionals alike.",
    duration: 45,
    style: "formal",
    voice: "male",
    authorId: "demo-user",
    authorName: "MindForge",
    sessionsCount: 56,
    bookmarksCount: 23,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// In-memory storage for demo mode
let localCompanions: CompanionWithStats[] = [...demoCompanions];
let localBookmarks: Set<string> = new Set(["demo-2", "demo-5"]);

// Check if database is available
async function isDatabaseAvailable(): Promise<boolean> {
  try {
    const dbModule = await import("@/lib/db");
    const prisma = dbModule.default;
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Get Prisma client (only when database is available)
async function getPrisma() {
  const dbModule = await import("@/lib/db");
  return dbModule.default;
}

// Ensure user exists in database, create if not
async function ensureUserExists(
  prisma: Awaited<ReturnType<typeof getPrisma>>,
  clerkUser: { id: string; emailAddresses: { emailAddress: string }[]; firstName?: string | null; lastName?: string | null; imageUrl?: string | null }
) {
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

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Demo mode: create in local storage
      const newCompanion: CompanionWithStats = {
        id: `local-${Date.now()}`,
        name: input.name,
        subject: input.subject,
        topic: input.topic,
        description: input.description,
        duration: input.duration,
        style: input.style,
        voice: input.voice,
        authorId: clerkUser.id,
        authorName: clerkUser.firstName || "You",
        sessionsCount: 0,
        bookmarksCount: 0,
        isBookmarked: false,
        createdAt: new Date(),
      };
      localCompanions.unshift(newCompanion);
      revalidatePath("/companions");
      return { success: true, data: newCompanion };
    }

    const prisma = await getPrisma();
    const user = await ensureUserExists(prisma, clerkUser);

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
    return { success: false, error: "Failed to create companion. Please set up DATABASE_URL in your .env.local file." };
  }
}

// Get all companions with filtering
export async function getCompanions(filter?: { subject?: string; search?: string }): Promise<{ success: boolean; data?: CompanionWithStats[]; error?: string }> {
  try {
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Demo mode: filter from local storage
      let filtered = [...localCompanions];
      
      if (filter?.subject && filter.subject !== "all") {
        filtered = filtered.filter(c => c.subject === filter.subject);
      }
      
      if (filter?.search) {
        const search = filter.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(search) ||
          c.topic.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search)
        );
      }

      // Update bookmark status
      filtered = filtered.map(c => ({
        ...c,
        isBookmarked: localBookmarks.has(c.id),
      }));

      return { success: true, data: filtered };
    }

    const prisma = await getPrisma();
    const clerkUser = await currentUser();
    let userId: string | null = null;

    if (clerkUser) {
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      });
      userId = user?.id ?? null;
    }

    interface WhereClause {
      subject?: string;
      OR?: Array<{ name: { contains: string; mode: "insensitive" } } | { topic: { contains: string; mode: "insensitive" } } | { description: { contains: string; mode: "insensitive" } }>;
    }
    
    const whereClause: WhereClause = {};

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

    interface CompanionResult {
      id: string;
      name: string;
      subject: string;
      topic: string;
      description: string;
      duration: number;
      style: string;
      voice: string;
      authorId: string;
      author: { name: string | null };
      _count: { sessions: number; bookmarks: number };
      bookmarks: { userId: string }[] | false;
      createdAt: Date;
    }

    const companionsWithStats: CompanionWithStats[] = (companions as CompanionResult[]).map((companion) => ({
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
      isBookmarked: userId && companion.bookmarks ? (companion.bookmarks as { userId: string }[]).length > 0 : false,
      createdAt: companion.createdAt,
    }));

    return { success: true, data: companionsWithStats };
  } catch (error) {
    console.error("Error fetching companions:", error);
    // Return demo data on error
    return { success: true, data: localCompanions };
  }
}

// Get a single companion by ID
export async function getCompanion(id: string): Promise<{ success: boolean; data?: CompanionWithStats; error?: string }> {
  try {
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Demo mode: find from local storage
      const companion = localCompanions.find(c => c.id === id);
      if (!companion) {
        return { success: false, error: "Companion not found" };
      }
      return { 
        success: true, 
        data: { ...companion, isBookmarked: localBookmarks.has(id) } 
      };
    }

    const prisma = await getPrisma();
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
        isBookmarked: userId && companion.bookmarks ? (companion.bookmarks as { userId: string }[]).length > 0 : false,
        createdAt: companion.createdAt,
      },
    };
  } catch (error) {
    console.error("Error fetching companion:", error);
    // Try to find in demo data
    const demoCompanion = localCompanions.find(c => c.id === id);
    if (demoCompanion) {
      return { success: true, data: demoCompanion };
    }
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

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Demo mode: toggle in local storage
      const wasBookmarked = localBookmarks.has(companionId);
      if (wasBookmarked) {
        localBookmarks.delete(companionId);
      } else {
        localBookmarks.add(companionId);
      }
      revalidatePath("/companions");
      return { success: true, isBookmarked: !wasBookmarked };
    }

    const prisma = await getPrisma();
    const user = await ensureUserExists(prisma, clerkUser);

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

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Demo mode: delete from local storage
      const index = localCompanions.findIndex(c => c.id === companionId);
      if (index === -1) {
        return { success: false, error: "Companion not found" };
      }
      const companion = localCompanions[index];
      if (companion.authorId !== clerkUser.id && !companion.id.startsWith("local-")) {
        return { success: false, error: "Not authorized to delete this companion" };
      }
      localCompanions.splice(index, 1);
      localBookmarks.delete(companionId);
      revalidatePath("/companions");
      return { success: true };
    }

    const prisma = await getPrisma();
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

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Demo mode: return locally created companions
      const userCompanions = localCompanions.filter(c => 
        c.authorId === clerkUser.id || c.id.startsWith("local-")
      );
      return { success: true, data: userCompanions };
    }

    const prisma = await getPrisma();
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

    interface CompanionResult {
      id: string;
      name: string;
      subject: string;
      topic: string;
      description: string;
      duration: number;
      style: string;
      voice: string;
      authorId: string;
      author: { name: string | null };
      _count: { sessions: number; bookmarks: number };
      createdAt: Date;
    }

    const companionsWithStats: CompanionWithStats[] = (companions as CompanionResult[]).map((companion) => ({
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

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Demo mode: return bookmarked companions from local storage
      const bookmarked = localCompanions
        .filter(c => localBookmarks.has(c.id))
        .map(c => ({ ...c, isBookmarked: true }));
      return { success: true, data: bookmarked };
    }

    const prisma = await getPrisma();
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

    interface BookmarkResult {
      companion: {
        id: string;
        name: string;
        subject: string;
        topic: string;
        description: string;
        duration: number;
        style: string;
        voice: string;
        authorId: string;
        author: { name: string | null };
        _count: { sessions: number; bookmarks: number };
        createdAt: Date;
      };
    }

    const companionsWithStats: CompanionWithStats[] = (user.bookmarks as BookmarkResult[]).map((bookmark) => ({
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
