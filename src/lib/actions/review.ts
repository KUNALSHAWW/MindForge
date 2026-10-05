"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { awardAchievements } from "@/lib/achievements";
import { z } from "zod";
import { DEFAULT_WEIGHTS, schedule, type Rating } from "@/lib/fsrs";
import { MIN_SCORED_REVIEWS, optimizeWeights, type OptimizationResult } from "@/lib/fsrs-optimizer";
import { rateLimit } from "@/lib/rate-limit";
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

// a type alias (not an interface) so it is assignable to Prisma's Json input
export type MemoryModel = {
  weights: number[];
  optimizedAt: string;
  defaultLoss: number;
  optimizedLoss: number;
  scoredReviews: number;
};

export interface ReviewQueue {
  cards: ReviewCard[];
  dueCount: number;
  totalCards: number;
  nextDue: Date | null;
  weights: number[];
  model: MemoryModel | null;
  reviewCount: number;
  demo: boolean;
}

const MemoryModelSchema = z.object({
  weights: z.array(z.number().finite()).length(17),
  optimizedAt: z.string(),
  defaultLoss: z.number(),
  optimizedLoss: z.number(),
  scoredReviews: z.number(),
});

/** The learner's personalised FSRS model, or null while they use the defaults. */
function parseModel(value: unknown): MemoryModel | null {
  const parsed = MemoryModelSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

type Result<T> = { success: true; data: T } | { success: false; error: string };

const QUEUE_SIZE = 50;

export async function getReviewQueue(): Promise<Result<ReviewQueue>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };

  try {
    if (!(await isDatabaseAvailable())) {
      return {
        success: true,
        data: { cards: [], dueCount: 0, totalCards: 0, nextDue: null, weights: [...DEFAULT_WEIGHTS], model: null, reviewCount: 0, demo: true },
      };
    }
    const user = await ensureUser(clerkUser);
    const now = new Date();
    const model = parseModel(user.fsrsModel);
    const [cards, dueCount, totalCards, next, reviewCount] = await Promise.all([
      prisma.flashcard.findMany({
        where: { userId: user.id, due: { lte: now } },
        orderBy: { due: "asc" },
        take: QUEUE_SIZE,
        include: { companion: { select: { name: true } } },
      }),
      prisma.flashcard.count({ where: { userId: user.id, due: { lte: now } } }),
      prisma.flashcard.count({ where: { userId: user.id } }),
      prisma.flashcard.findFirst({ where: { userId: user.id, due: { gt: now } }, orderBy: { due: "asc" }, select: { due: true } }),
      prisma.reviewLog.count({ where: { userId: user.id } }),
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
        weights: model?.weights ?? [...DEFAULT_WEIGHTS],
        model,
        reviewCount,
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

    const now = new Date();
    const next = schedule(card, parsed.data.rating, now, parseModel(user.fsrsModel)?.weights ?? DEFAULT_WEIGHTS);
    await prisma.$transaction(async (tx) => {
      await tx.flashcard.update({
        where: { id: card.id },
        data: {
          stability: next.stability, difficulty: next.difficulty, reps: next.reps,
          lapses: next.lapses, due: next.due, lastReview: next.lastReview,
        },
      });
      await tx.reviewLog.create({ data: { userId: user.id, cardId: card.id, rating: parsed.data.rating, reviewedAt: now } });
      const updated = await tx.user.update({ where: { id: user.id }, data: { totalXP: { increment: XP_PER_REVIEW } } });
      await tx.user.update({ where: { id: user.id }, data: { level: calculateLevel(updated.totalXP) } });
    });
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

/**
 * Fits FSRS weights to the learner's own review history and keeps them only if they
 * predict recall better than the defaults on held-out cards.
 */
export async function optimizeMemoryModel(): Promise<Result<OptimizationResult>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  if (!(await isDatabaseAvailable())) return { success: false, error: "Optimisation needs a database" };
  const limit = await rateLimit("fsrs-optimize", clerkUser.id, 5, 3600);
  if (!limit.success) return { success: false, error: "You can re-optimise a few times per hour" };

  try {
    const user = await ensureUser(clerkUser);
    const logs = await prisma.reviewLog.findMany({
      where: { userId: user.id },
      orderBy: { reviewedAt: "asc" },
      take: 20_000,
      select: { cardId: true, rating: true, reviewedAt: true },
    });
    const events = logs.map((l) => ({ cardId: l.cardId, rating: l.rating as Rating, at: l.reviewedAt.getTime() }));
    const result = optimizeWeights(events);
    if (result.scoredReviews < MIN_SCORED_REVIEWS) {
      return { success: false, error: `Need ${MIN_SCORED_REVIEWS} reviews spaced at least a day apart; you have ${result.scoredReviews}. Keep reviewing!` };
    }
    if (result.improved) {
      const model: MemoryModel = {
        weights: result.weights,
        optimizedAt: new Date().toISOString(),
        defaultLoss: result.defaultLoss,
        optimizedLoss: result.optimizedLoss,
        scoredReviews: result.scoredReviews,
      };
      await prisma.user.update({ where: { id: user.id }, data: { fsrsModel: model } });
      revalidatePath("/review");
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Error optimising memory model:", error);
    return { success: false, error: "Failed to optimise your memory model" };
  }
}
