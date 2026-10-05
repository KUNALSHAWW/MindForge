// Class insights for teachers: per-student activity and memory, a subject x student
// recall heatmap, the cards the class forgets most, and who needs attention.
// Pure module so the aggregation is unit tested.

import { currentRetrievability } from "./fsrs.ts";

export interface MemberRow {
  userId: string;
  name: string;
}
export interface CardRow {
  userId: string;
  subject: string;
  front: string;
  stability: number;
  lastReview: Date | null;
  lapses: number;
  reps: number;
}
export interface SessionRow {
  userId: string;
  minutes: number;
  createdAt: Date;
}
export interface QuizRow {
  userId: string;
  score: number;
}

export interface StudentInsight {
  userId: string;
  name: string;
  minutes7d: number;
  sessions7d: number;
  lastActive: Date | null;
  reviewedCards: number;
  recall: number | null; // mean predicted recall of reviewed cards
  quizAverage: number | null;
  flags: string[];
}

export interface ClassInsights {
  students: StudentInsight[];
  subjects: string[];
  heatmap: Record<string, Record<string, number | null>>; // userId -> subject -> recall
  subjectRecall: { subject: string; recall: number; students: number }[];
  forgotten: { front: string; subject: string; lapses: number; recall: number; userId: string }[];
  totals: { students: number; activeThisWeek: number; minutes7d: number; averageRecall: number | null };
}

const DAY = 86_400_000;
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export function buildClassInsights(
  members: MemberRow[],
  cards: CardRow[],
  sessions: SessionRow[],
  quizzes: QuizRow[],
  now = new Date(),
): ClassInsights {
  const weekAgo = now.getTime() - 7 * DAY;
  const reviewed = cards.filter((c) => c.reps > 0 && c.lastReview);
  const recallOf = (c: CardRow) => currentRetrievability(c, now);
  const subjects = [...new Set(reviewed.map((c) => c.subject))].sort();

  const heatmap: ClassInsights["heatmap"] = {};
  const students: StudentInsight[] = members.map((m) => {
    const mine = reviewed.filter((c) => c.userId === m.userId);
    const mySessions = sessions.filter((s) => s.userId === m.userId);
    const recent = mySessions.filter((s) => s.createdAt.getTime() >= weekAgo);
    const lastActive = mySessions.reduce<Date | null>((latest, s) => (!latest || s.createdAt > latest ? s.createdAt : latest), null);
    const recall = mean(mine.map(recallOf));
    const quizAverage = mean(quizzes.filter((q) => q.userId === m.userId).map((q) => q.score));

    heatmap[m.userId] = Object.fromEntries(subjects.map((s) => [s, mean(mine.filter((c) => c.subject === s).map(recallOf))]));

    const flags: string[] = [];
    if (!lastActive || now.getTime() - lastActive.getTime() > 7 * DAY) flags.push("Inactive for 7+ days");
    if (recall !== null && recall < 0.7) flags.push("Low predicted recall");
    if (quizAverage !== null && quizAverage < 0.5) flags.push("Quiz average below 50%");

    return {
      userId: m.userId,
      name: m.name,
      minutes7d: recent.reduce((sum, s) => sum + s.minutes, 0),
      sessions7d: recent.length,
      lastActive,
      reviewedCards: mine.length,
      recall,
      quizAverage,
      flags,
    };
  });

  const subjectRecall = subjects
    .map((subject) => {
      const values = members.map((m) => heatmap[m.userId][subject]).filter((v): v is number => v !== null);
      return { subject, recall: mean(values) ?? 0, students: values.length };
    })
    .sort((a, b) => a.recall - b.recall);

  const forgotten = reviewed
    .map((c) => ({ front: c.front, subject: c.subject, lapses: c.lapses, recall: recallOf(c), userId: c.userId }))
    .filter((c) => c.lapses > 0 || c.recall < 0.7)
    .sort((a, b) => b.lapses - a.lapses || a.recall - b.recall)
    .slice(0, 10);

  const allRecall = students.map((s) => s.recall).filter((r): r is number => r !== null);
  return {
    students: students.sort((a, b) => b.flags.length - a.flags.length || a.name.localeCompare(b.name)),
    subjects,
    heatmap,
    subjectRecall,
    forgotten,
    totals: {
      students: members.length,
      activeThisWeek: students.filter((s) => s.sessions7d > 0).length,
      minutes7d: students.reduce((sum, s) => sum + s.minutes7d, 0),
      averageRecall: mean(allRecall),
    },
  };
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I lookalikes

/** Six-character class join code from a cryptographic RNG. */
export function generateJoinCode(randomValues: (bytes: Uint8Array) => Uint8Array = (b) => crypto.getRandomValues(b)): string {
  return [...randomValues(new Uint8Array(6))].map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}
