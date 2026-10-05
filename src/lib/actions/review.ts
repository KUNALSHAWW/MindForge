"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { awardAchievements } from "@/lib/achievements";
import { schedule, type Rating } from "@/lib/fsrs";
import { calculateLevel, XP_PER_REVIEW } from "@/lib/gamification";
import { CreateFlashcardSchema, ReviewSchema, firstError } from "@/lib/validators";

export interface ReviewCard {
  id: string;
  front: string;
  back: string;
  subject: string;
  companionName: string | null;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  due: Date;
  lastReview: Date | null;
}

export interface ReviewQueue {
  cards: ReviewCard[];
  dueCount: number;
  totalCards: number;
  nextDue: Date | null;
  demo: boolean;
}

type Result<T> = { success: true; data: T } | { success: false; error: string };

const QUEUE_SIZE = 50;

export async function getReviewQueue(): Promise<Result<ReviewQueue>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };

  try {
    if (!(await isDatabaseAvailable())) {
      return { success: true, data: { cards: [], dueCount: 0, totalCards: 0, nextDue: null, demo: true } };
    }
    const user = await ensureUser(clerkUser);
    const now = new Date();
    const [cards, dueCount, totalCards, next] = await Promise.all([
      prisma.flashcard.findMany({
        where: { userId: user.id, due: { lte: now } },
        orderBy: { due: "asc" },
        take: QUEUE_SIZE,
        include: { companion: { select: { name: true } } },
      }),
      prisma.flashcard.count({ where: { userId: user.id, due: { lte: now } } }),
      prisma.flashcard.count({ where: { userId: user.id } }),
      prisma.flashcard.findFirst({ where: { userId: user.id, due: { gt: now } }, orderBy: { due: "asc" }, select: { due: true } }),
    ]);
    return {
      success: true,
      data: {
        cards: cards.map(({ companion, ...c }) => ({
          id: c.id, front: c.front, back: c.back, subject: c.subject, companionName: companion?.name ?? null,
          stability: c.stability, difficulty: c.difficulty, reps: c.reps, lapses: c.lapses, due: c.due, lastReview: c.lastReview,
        })),
        dueCount,
        totalCards,
        nextDue: next?.due ?? null,
        demo: false,
      },
    };
  } catch (error) {
    console.error("Error loading review queue:", error);
    return { success: false, error: "Failed to load flashcards" };
  }
}

/** Applies an FSRS-4.5 rating to a card the user owns and grants review XP. */
export async function reviewCard(input: { cardId: string; rating: Rating }): Promise<Result<{ due: Date; newAchievements: string[] }>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  const parsed = ReviewSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };

  try {
    const user = await ensureUser(clerkUser);
    const card = await prisma.flashcard.findFirst({ where: { id: parsed.data.cardId, userId: user.id } });
    if (!card) return { success: false, error: "Card not found" };

    const next = schedule(card, parsed.data.rating, new Date());
    await prisma.$transaction([
      prisma.flashcard.update({
        where: { id: card.id },
        data: {
          stability: next.stability, difficulty: next.difficulty, reps: next.reps,
          lapses: next.lapses, due: next.due, lastReview: next.lastReview,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { totalXP: { increment: XP_PER_REVIEW }, level: calculateLevel(user.totalXP + XP_PER_REVIEW) },
      }),
    ]);
    const earned = await awardAchievements(user.id);
    return { success: true, data: { due: next.due, newAchievements: earned.map((a) => `${a.icon} ${a.title}`) } };
  } catch (error) {
    console.error("Error reviewing card:", error);
    return { success: false, error: "Failed to save review" };
  }
}

export async function createFlashcard(input: { front: string; back: string; subject: string }): Promise<Result<{ id: string }>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  const parsed = CreateFlashcardSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };
  if (!(await isDatabaseAvailable())) return { success: false, error: "Flashcards need a database (DATABASE_URL) to be saved" };

  try {
    const user = await ensureUser(clerkUser);
    const card = await prisma.flashcard.create({ data: { ...parsed.data, userId: user.id } });
    revalidatePath("/review");
    return { success: true, data: { id: card.id } };
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return { success: false, error: "Failed to create flashcard" };
  }
}

export async function deleteFlashcard(cardId: string): Promise<Result<null>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  try {
    const { count } = await prisma.flashcard.deleteMany({ where: { id: cardId, user: { clerkId: clerkUser.id } } });
    if (!count) return { success: false, error: "Card not found" };
    revalidatePath("/review");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return { success: false, error: "Failed to delete flashcard" };
  }
}
