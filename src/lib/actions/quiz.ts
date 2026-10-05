"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { awardAchievements } from "@/lib/achievements";
import { generateQuestions, gradeAnswer } from "@/lib/ai/quiz";
import { calculateLevel, XP_PER_QUIZ_POINT } from "@/lib/gamification";
import { makeClozeQuestions, type Grade, type QuizQuestion } from "@/lib/quiz";
import { rateLimit } from "@/lib/rate-limit";
import { chunkDocument } from "@/lib/retrieval";
import { SUBJECT_VALUES, subjectLabel } from "@/lib/subjects";
import { firstError } from "@/lib/validators";

type Result<T> = { success: true; data: T } | { success: false; error: string };

type StoredQuestion = QuizQuestion & { response?: string; score?: number; feedback?: string };

export interface QuizOverview {
  subjects: { subject: string; label: string; documents: number }[];
  recent: { id: string; subject: string; label: string; score: number; questions: number; completedAt: Date }[];
  demo: boolean;
}

export interface StartedQuiz {
  quizId: string;
  subject: string;
  mode: "llm" | "cloze";
  questions: { question: string; kind: "cloze" | "open"; sourceTitle: string }[];
}

export interface AnswerResult {
  grade: Grade;
  answer: string;
  source: { title: string; text: string };
  finished: { score: number; correct: number; total: number; xpEarned: number; flashcardsCreated: number; newAchievements: string[] } | null;
}

export async function getQuizOverview(): Promise<Result<QuizOverview>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  try {
    if (!(await isDatabaseAvailable())) return { success: true, data: { subjects: [], recent: [], demo: true } };
    const user = await ensureUser(clerkUser);
    const [docs, recent] = await Promise.all([
      prisma.rAGDocument.groupBy({ by: ["subject"], where: { userId: user.id }, _count: true }),
      prisma.quiz.findMany({
        where: { userId: user.id, completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        take: 8,
        select: { id: true, subject: true, score: true, questions: true, completedAt: true },
      }),
    ]);
    return {
      success: true,
      data: {
        demo: false,
        subjects: docs.map((d) => ({ subject: d.subject, label: subjectLabel(d.subject), documents: d._count })),
        recent: recent.map((q) => ({
          id: q.id, subject: q.subject, label: subjectLabel(q.subject), score: q.score ?? 0,
          questions: Array.isArray(q.questions) ? q.questions.length : 0, completedAt: q.completedAt!,
        })),
      },
    };
  } catch (error) {
    console.error("Error loading quizzes:", error);
    return { success: false, error: "Failed to load quizzes" };
  }
}

const StartSchema = z.object({ subject: z.enum(SUBJECT_VALUES), size: z.number().int().min(3).max(15) });

/** Builds a quiz from the learner's notes for one subject: LLM short-answer questions, or cloze questions offline. */
export async function startQuiz(input: { subject: string; size: number }): Promise<Result<StartedQuiz>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  const parsed = StartSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };
  if (!(await isDatabaseAvailable())) return { success: false, error: "Quizzes need a database and uploaded notes" };
  const limit = await rateLimit("quiz", clerkUser.id, 20, 3600);
  if (!limit.success) return { success: false, error: "Quiz limit reached for this hour" };

  try {
    const user = await ensureUser(clerkUser);
    const { subject, size } = parsed.data;
    const docs = await prisma.rAGDocument.findMany({ where: { userId: user.id, subject }, select: { title: true, content: true }, take: 30 });
    const passages = docs.flatMap((d) =>
      chunkDocument(d.content).map((c) => ({ title: c.page ? `${d.title}, p. ${c.page}` : d.title, text: c.text })),
    );
    if (!passages.length) return { success: false, error: `Add notes for ${subjectLabel(subject)} in the Knowledge Forge first` };

    // Random but spread-out sample of passages so each quiz covers different material.
    const sample = passages
      .map((p) => ({ p, k: Math.random() }))
      .sort((a, b) => a.k - b.k)
      .slice(0, Math.min(passages.length, size * 2))
      .map((x) => x.p);

    const generated = await generateQuestions(sample.slice(0, 12), size);
    const questions = generated?.length ? generated : makeClozeQuestions(sample, size, Date.now());
    if (!questions.length) return { success: false, error: "Your notes are too short to build a quiz. Add a few more paragraphs." };

    const quiz = await prisma.quiz.create({ data: { userId: user.id, subject, questions: questions } });
    return {
      success: true,
      data: {
        quizId: quiz.id,
        subject,
        mode: generated?.length ? "llm" : "cloze",
        questions: questions.map((q) => ({ question: q.question, kind: q.kind, sourceTitle: q.source.title })),
      },
    };
  } catch (error) {
    console.error("Error starting quiz:", error);
    return { success: false, error: "Failed to build the quiz" };
  }
}

const AnswerSchema = z.object({ quizId: z.string().min(1).max(64), index: z.number().int().min(0).max(20), response: z.string().max(2000) });

/**
 * Grades one answer server-side (answers never reach the browser before submission).
 * After the last question: score, XP, and every missed question becomes a flashcard.
 */
export async function answerQuestion(input: { quizId: string; index: number; response: string }): Promise<Result<AnswerResult>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  const parsed = AnswerSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };
  const { quizId, index, response } = parsed.data;

  try {
    const user = await ensureUser(clerkUser);
    const quiz = await prisma.quiz.findFirst({ where: { id: quizId, userId: user.id } });
    if (!quiz) return { success: false, error: "Quiz not found" };
    const questions = quiz.questions as unknown as StoredQuestion[];
    const question = questions[index];
    if (!question) return { success: false, error: "Question not found" };
    if (question.score !== undefined) return { success: false, error: "Already answered" };

    const grade = await gradeAnswer(question, response);
    questions[index] = { ...question, response, score: grade.score, feedback: grade.feedback };
    const answered = questions.filter((q) => q.score !== undefined);
    const done = answered.length === questions.length;

    let finished: AnswerResult["finished"] = null;
    if (done) {
      const points = questions.reduce((sum, q) => sum + (q.score ?? 0), 0);
      const xpEarned = Math.round(points * XP_PER_QUIZ_POINT);
      const missed = questions.filter((q) => (q.score ?? 0) < 1);
      await prisma.$transaction(async (tx) => {
        await tx.quiz.update({ where: { id: quiz.id }, data: { questions, score: points / questions.length, completedAt: new Date() } });
        if (missed.length) {
          await tx.flashcard.createMany({
            data: missed.map((q) => ({ userId: user.id, subject: quiz.subject, front: q.question.slice(0, 500), back: q.answer.slice(0, 2000) })),
          });
        }
        const updated = await tx.user.update({ where: { id: user.id }, data: { totalXP: { increment: xpEarned } } });
        await tx.user.update({ where: { id: user.id }, data: { level: calculateLevel(updated.totalXP) } });
      });
      const earned = await awardAchievements(user.id);
      revalidatePath("/quiz");
      revalidatePath("/review");
      finished = {
        score: points / questions.length,
        correct: questions.filter((q) => q.score === 1).length,
        total: questions.length,
        xpEarned,
        flashcardsCreated: missed.length,
        newAchievements: earned.map((a) => `${a.icon} ${a.title}`),
      };
    } else {
      await prisma.quiz.update({ where: { id: quiz.id }, data: { questions } });
    }

    return { success: true, data: { grade, answer: question.answer, source: question.source, finished } };
  } catch (error) {
    console.error("Error grading answer:", error);
    return { success: false, error: "Failed to grade your answer" };
  }
}
