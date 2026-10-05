// Demo mode: sample data served when no database is reachable, so the whole UI can be
// explored without infrastructure. Writes go to process memory and are lost on restart.

const DAY = 86_400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY);

export interface DemoCompanion {
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
  createdAt: Date;
}

const seedCompanions: DemoCompanion[] = [
  { id: "demo-1", name: "Dr. Physics", subject: "physics", topic: "Quantum Mechanics", description: "Explains wave-particle duality and entanglement through analogies, then makes you predict the result before revealing it.", duration: 45, style: "socratic", voice: "male", authorId: "demo-author", authorName: "MindForge", sessionsCount: 128, bookmarksCount: 45, createdAt: daysAgo(30) },
  { id: "demo-2", name: "Math Master", subject: "maths", topic: "Calculus & Linear Algebra", description: "Patient tutor for calculus, algebra and proofs with a step-by-step problem solving approach.", duration: 60, style: "formal", voice: "female", authorId: "demo-author", authorName: "MindForge", sessionsCount: 256, bookmarksCount: 89, createdAt: daysAgo(25) },
  { id: "demo-3", name: "Code Coach", subject: "coding", topic: "Python & JavaScript", description: "Friendly coding mentor who teaches through practical examples and small projects.", duration: 45, style: "casual", voice: "male", authorId: "demo-author", authorName: "MindForge", sessionsCount: 312, bookmarksCount: 156, createdAt: daysAgo(20) },
  { id: "demo-4", name: "History Guide", subject: "history", topic: "World History", description: "Storyteller who brings historical events to life, from ancient civilisations to the modern world.", duration: 30, style: "storytelling", voice: "female", authorId: "demo-author", authorName: "MindForge", sessionsCount: 89, bookmarksCount: 34, createdAt: daysAgo(15) },
  { id: "demo-5", name: "Language Pro", subject: "language", topic: "English & Spanish", description: "Conversational practice, grammar and vocabulary building through immersive dialogue.", duration: 30, style: "casual", voice: "female", authorId: "demo-author", authorName: "MindForge", sessionsCount: 167, bookmarksCount: 78, createdAt: daysAgo(10) },
  { id: "demo-6", name: "Economics Expert", subject: "economics", topic: "Micro & Macro Economics", description: "Economic concepts with real-world examples for students and professionals.", duration: 45, style: "formal", voice: "male", authorId: "demo-author", authorName: "MindForge", sessionsCount: 56, bookmarksCount: 23, createdAt: daysAgo(5) },
];

const store = globalThis as unknown as { mindforgeDemo?: { companions: DemoCompanion[]; bookmarks: Set<string> } };
store.mindforgeDemo ??= { companions: [...seedCompanions], bookmarks: new Set(["demo-2", "demo-5"]) };

export const demo = store.mindforgeDemo;

export const DEMO_STATS = {
  totalXP: 3450,
  currentStreak: 7,
  longestStreak: 14,
  totalSessionMinutes: 1470,
  totalSessions: 31,
};

export const DEMO_UNLOCKED: { title: string; daysAgo: number }[] = [
  { title: "Week Warrior", daysAgo: 1 },
  { title: "Deep Dive", daysAgo: 3 },
  { title: "XP Starter", daysAgo: 6 },
  { title: "First Steps", daysAgo: 28 },
];

export const DEMO_SESSIONS = [
  { id: "demo-s1", companionId: "demo-1", minutes: 45, xp: 216, daysAgo: 0, notes: "Covered the double-slit experiment and why observing which slit changes the pattern. Struggled with the idea of superposition collapse." },
  { id: "demo-s2", companionId: "demo-2", minutes: 60, xp: 288, daysAgo: 1, notes: "Worked through the chain rule and implicit differentiation. Confident with polynomials, needs practice with trig functions." },
  { id: "demo-s3", companionId: "demo-4", minutes: 30, xp: 135, daysAgo: 3, notes: "Causes of World War I using the MAIN framework: militarism, alliances, imperialism and nationalism." },
  { id: "demo-s4", companionId: "demo-3", minutes: 25, xp: 90, daysAgo: 6, notes: "Python list comprehensions versus loops, and when generators save memory." },
].map((s) => ({ ...s, createdAt: daysAgo(s.daysAgo) }));

/** Deterministic pseudo-random minutes per day for the demo activity heatmap. */
export function demoActivity(days: number): { date: Date; minutes: number }[] {
  return Array.from({ length: days }, (_, i) => {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const r = seed - Math.floor(seed);
    return { date: daysAgo(days - 1 - i), minutes: r < 0.35 ? 0 : Math.round(r * 70) };
  });
}

export const DEMO_MEMORY = [
  { subject: "physics", cards: 18, retention: 0.82 },
  { subject: "maths", cards: 24, retention: 0.91 },
  { subject: "history", cards: 9, retention: 0.67 },
  { subject: "coding", cards: 12, retention: 0.88 },
];
