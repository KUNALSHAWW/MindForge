"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { demo, DEMO_STATS } from "@/lib/demo";
import { awardAchievements } from "@/lib/achievements";
import { digestSession } from "@/lib/ai/tutor";
import { calculateLevel, calculateXP, isValidTimeZone, nextStreak } from "@/lib/gamification";
import { CreateSessionSchema, firstError, type CreateSessionInput } from "@/lib/validators";

export interface SessionResult {
  sessionId: string | null;
  xpEarned: number;
  streak: number;
  level: number;
  newAchievements: string[];
  flashcardsCreated: number;
  summary: string | null;
  demo: boolean;
}

type Result<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Saves a finished session and updates progress:
 * streak (in the learner's time zone) -> XP with the updated streak bonus -> level,
 * then generates an AI summary and FSRS flashcards from the transcript and awards achievements.
 */
export async function createSession(input: CreateSessionInput): Promise<Result<SessionResult>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };

  const parsed = CreateSessionSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };
  const { companionId, durationMinutes, transcript, notes } = parsed.data;
  const timeZone = parsed.data.timeZone && isValidTimeZone(parsed.data.timeZone) ? parsed.data.timeZone : "UTC";

  try {
    if (!(await isDatabaseAvailable())) {
      const companion = demo.companions.find((c) => c.id === companionId);
      if (!companion) return { success: false, error: "Companion not found" };
      const streak = DEMO_STATS.currentStreak;
      const xpEarned = calculateXP(durationMinutes, streak);
      return {
        success: true,
        data: {
          sessionId: null, xpEarned, streak, level: calculateLevel(DEMO_STATS.totalXP + xpEarned),
          newAchievements: [], flashcardsCreated: 0, summary: null, demo: true,
        },
      };
    }

    const user = await ensureUser(clerkUser);
    const companion = await prisma.companion.findUnique({ where: { id: companionId } });
    if (!companion) return { success: false, error: "Companion not found" };

    const now = new Date();
    // Read-modify-write inside one transaction so two tabs ending sessions at once can't lose XP or streak days.
    const { session, streak, xpEarned, level } = await prisma.$transaction(async (tx) => {
      const fresh = await tx.user.findUniqueOrThrow({ where: { id: user.id } });
      const last = await tx.sessionHistory.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, select: { createdAt: true } });
      const streak = nextStreak(fresh.currentStreak, last?.createdAt ?? null, now, timeZone);
      const xpEarned = calculateXP(durationMinutes, streak);
      const totalXP = fresh.totalXP + xpEarned;
      const level = calculateLevel(totalXP);

      const session = await tx.sessionHistory.create({
        data: { userId: user.id, companionId, durationMinutes, transcript, xpEarned, notes: notes ?? null, createdAt: now },
      });
      await tx.user.update({
        where: { id: user.id },
        data: {
          totalXP,
          level,
          totalSessionMinutes: { increment: durationMinutes },
          currentStreak: streak,
          longestStreak: Math.max(fresh.longestStreak, streak),
          timeZone,
        },
      });
      return { session, streak, xpEarned, level };
    });

    // The LLM call happens after the commit: a slow or failed model never blocks saving progress.
    const digest = await digestSession(transcript, companion);
    if (digest) {
      await prisma.$transaction([
        prisma.sessionHistory.update({ where: { id: session.id }, data: { notes: notes ? `${notes}\n\n${digest.summary}` : digest.summary } }),
        prisma.flashcard.createMany({
          data: digest.flashcards.map((card) => ({
            ...card, userId: user.id, companionId, sessionId: session.id, subject: companion.subject, due: now,
          })),
        }),
      ]);
    }

    const earned = await awardAchievements(user.id);

    revalidatePath("/dashboard");
    revalidatePath("/journey");
    revalidatePath("/review");
    revalidatePath("/achievements");

    return {
      success: true,
      data: {
        sessionId: session.id, xpEarned, streak, level,
        newAchievements: earned.map((a) => `${a.icon} ${a.title}`),
        flashcardsCreated: digest?.flashcards.length ?? 0,
        summary: digest?.summary ?? null,
        demo: false,
      },
    };
  } catch (error) {
    console.error("Error creating session:", error);
    return { success: false, error: "Failed to save session" };
  }
}
