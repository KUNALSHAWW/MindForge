"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { demo, demoActivity, DEMO_MEMORY, DEMO_SESSIONS, DEMO_STATS } from "@/lib/demo";
import { currentRetrievability } from "@/lib/fsrs";
import { dayKey } from "@/lib/gamification";
import { subjectLabel } from "@/lib/subjects";

export interface JourneyData {
  heatmap: { date: string; minutes: number }[]; // last 84 days, oldest first
  weekly: { week: string; minutes: number; sessions: number }[]; // last 8 weeks
  subjects: { subject: string; label: string; minutes: number; percentage: number }[];
  memory: { subject: string; label: string; cards: number; retention: number }[];
  totals: { minutes: number; sessions: number; activeDays: number; averageSession: number; cards: number; retention: number | null };
  recentNotes: { id: string; companionName: string; subject: string; notes: string; createdAt: Date }[];
  demo: boolean;
}

type Result<T> = { success: true; data: T } | { success: false; error: string };

const HEATMAP_DAYS = 84;
const DAY = 86_400_000;

function aggregate(
  sessions: { minutes: number; createdAt: Date; subject: string }[],
  timeZone: string,
): Pick<JourneyData, "heatmap" | "weekly" | "subjects"> {
  const now = Date.now();
  const byDay = new Map<string, number>();
  for (const s of sessions) {
    const key = dayKey(s.createdAt, timeZone);
    byDay.set(key, (byDay.get(key) ?? 0) + s.minutes);
  }
  const heatmap = Array.from({ length: HEATMAP_DAYS }, (_, i) => {
    const date = dayKey(new Date(now - (HEATMAP_DAYS - 1 - i) * DAY), timeZone);
    return { date, minutes: byDay.get(date) ?? 0 };
  });

  const weekly = Array.from({ length: 8 }, (_, i) => {
    const end = now - (7 - i) * 7 * DAY;
    const inWeek = sessions.filter((s) => s.createdAt.getTime() > end - 7 * DAY && s.createdAt.getTime() <= end);
    const label = new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone });
    return { week: label, minutes: inWeek.reduce((sum, s) => sum + s.minutes, 0), sessions: inWeek.length };
  });

  const bySubject = new Map<string, number>();
  for (const s of sessions) bySubject.set(s.subject, (bySubject.get(s.subject) ?? 0) + s.minutes);
  const total = [...bySubject.values()].reduce((a, b) => a + b, 0) || 1;
  const subjects = [...bySubject.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([subject, minutes]) => ({ subject, label: subjectLabel(subject), minutes, percentage: Math.round((minutes / total) * 100) }));

  return { heatmap, weekly, subjects };
}

export async function getJourneyData(): Promise<Result<JourneyData>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };

  try {
    if (!(await isDatabaseAvailable())) {
      const subjectOf = new Map(demo.companions.map((c) => [c.id, c]));
      const activity = demoActivity(HEATMAP_DAYS);
      const sessions = activity
        .filter((a) => a.minutes > 0)
        .map((a, i) => ({ minutes: a.minutes, createdAt: a.date, subject: demo.companions[i % demo.companions.length].subject }));
      const memory = DEMO_MEMORY.map((m) => ({ ...m, label: subjectLabel(m.subject) }));
      const cards = memory.reduce((s, m) => s + m.cards, 0);
      return {
        success: true,
        data: {
          ...aggregate(sessions, "UTC"),
          memory,
          totals: {
            minutes: DEMO_STATS.totalSessionMinutes, sessions: DEMO_STATS.totalSessions, activeDays: sessions.length,
            averageSession: Math.round(DEMO_STATS.totalSessionMinutes / DEMO_STATS.totalSessions), cards,
            retention: memory.reduce((s, m) => s + m.retention * m.cards, 0) / cards,
          },
          recentNotes: DEMO_SESSIONS.map((s) => ({
            id: s.id, companionName: subjectOf.get(s.companionId)!.name, subject: subjectOf.get(s.companionId)!.subject, notes: s.notes, createdAt: s.createdAt,
          })),
          demo: true,
        },
      };
    }

    const user = await ensureUser(clerkUser);
    const since = new Date(Date.now() - HEATMAP_DAYS * DAY);
    const [recent, totals, cards, notes] = await Promise.all([
      prisma.sessionHistory.findMany({
        where: { userId: user.id, createdAt: { gte: since } },
        select: { durationMinutes: true, createdAt: true, companion: { select: { subject: true } } },
      }),
      prisma.sessionHistory.aggregate({ where: { userId: user.id }, _count: true, _sum: { durationMinutes: true } }),
      prisma.flashcard.findMany({ where: { userId: user.id, reps: { gt: 0 } }, select: { subject: true, stability: true, lastReview: true } }),
      prisma.sessionHistory.findMany({
        where: { userId: user.id, notes: { not: null } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, notes: true, createdAt: true, companion: { select: { name: true, subject: true } } },
      }),
    ]);

    const sessions = recent.map((s) => ({ minutes: s.durationMinutes, createdAt: s.createdAt, subject: s.companion.subject }));
    const agg = aggregate(sessions, user.timeZone);

    // Memory health: mean FSRS recall probability of reviewed cards, per subject.
    const now = new Date();
    const memoryMap = new Map<string, { cards: number; sum: number }>();
    for (const c of cards) {
      const m = memoryMap.get(c.subject) ?? { cards: 0, sum: 0 };
      m.cards++;
      m.sum += currentRetrievability(c, now);
      memoryMap.set(c.subject, m);
    }
    const memory = [...memoryMap.entries()]
      .map(([subject, m]) => ({ subject, label: subjectLabel(subject), cards: m.cards, retention: m.sum / m.cards }))
      .sort((a, b) => a.retention - b.retention);
    const minutes = totals._sum.durationMinutes ?? 0;

    return {
      success: true,
      data: {
        ...agg,
        memory,
        totals: {
          minutes,
          sessions: totals._count,
          activeDays: agg.heatmap.filter((d) => d.minutes > 0).length,
          averageSession: totals._count ? Math.round(minutes / totals._count) : 0,
          cards: cards.length,
          retention: cards.length ? memory.reduce((s, m) => s + m.retention * m.cards, 0) / cards.length : null,
        },
        recentNotes: notes.map((n) => ({ id: n.id, companionName: n.companion.name, subject: n.companion.subject, notes: n.notes ?? "", createdAt: n.createdAt })),
        demo: false,
      },
    };
  } catch (error) {
    console.error("Error loading journey:", error);
    return { success: false, error: "Failed to load your journey" };
  }
}
