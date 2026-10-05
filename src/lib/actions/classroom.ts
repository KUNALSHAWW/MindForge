"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma, { ensureUser, isDatabaseAvailable } from "@/lib/db";
import { buildClassInsights, generateJoinCode, type ClassInsights } from "@/lib/classroom";
import { rateLimit } from "@/lib/rate-limit";
import { firstError } from "@/lib/validators";

type Result<T> = { success: true; data: T } | { success: false; error: string };

export interface ClassroomSummary {
  id: string;
  name: string;
  joinCode: string | null; // only shown to the owner
  teacher: string;
  members: number;
  isOwner: boolean;
}

export interface ClassroomDetail {
  id: string;
  name: string;
  joinCode: string | null;
  teacher: string;
  isOwner: boolean;
  insights: ClassInsights | null; // only for the owner
}

/** Runs a write and turns unexpected database errors into a friendly result. */
async function guard<T>(what: string, run: () => Promise<Result<T>>): Promise<Result<T>> {
  try {
    return await run();
  } catch (error) {
    console.error(`Failed to ${what}:`, error);
    return { success: false, error: `Could not ${what}` };
  }
}

async function requireUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  if (!(await isDatabaseAvailable())) return null;
  return ensureUser(clerkUser);
}

export async function listClassrooms(): Promise<Result<{ classes: ClassroomSummary[]; demo: boolean }>> {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Not authenticated" };
  if (!(await isDatabaseAvailable())) return { success: true, data: { classes: [], demo: true } };
  try {
    const user = await ensureUser(clerkUser);
    const classes = await prisma.classroom.findMany({
      where: { OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] },
      include: { owner: { select: { name: true } }, _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      data: {
        demo: false,
        classes: classes.map((c) => ({
          id: c.id,
          name: c.name,
          joinCode: c.ownerId === user.id ? c.joinCode : null,
          teacher: c.owner.name ?? "Teacher",
          members: c._count.members,
          isOwner: c.ownerId === user.id,
        })),
      },
    };
  } catch (error) {
    console.error("Error listing classes:", error);
    return { success: false, error: "Failed to load classes" };
  }
}

const NameSchema = z.string().trim().min(2, "Class name is too short").max(80);

export async function createClassroom(name: string): Promise<Result<{ id: string; joinCode: string }>> {
  const parsed = NameSchema.safeParse(name);
  if (!parsed.success) return { success: false, error: firstError(parsed.error) };
  const user = await requireUser();
  if (!user) return { success: false, error: "Classes need a signed-in user and a database" };
  const limit = await rateLimit("classroom-create", user.id, 10, 3600);
  if (!limit.success) return { success: false, error: "Too many classes created, try again later" };

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const c = await prisma.classroom.create({ data: { name: parsed.data, joinCode: generateJoinCode(), ownerId: user.id } });
      revalidatePath("/classes");
      return { success: true, data: { id: c.id, joinCode: c.joinCode } };
    } catch (error) {
      // P2002 = unique constraint: retry with a fresh code
      if ((error as { code?: string }).code !== "P2002") {
        console.error("Error creating class:", error);
        return { success: false, error: "Failed to create class" };
      }
    }
  }
  return { success: false, error: "Could not allocate a join code, try again" };
}

export async function joinClassroom(code: string): Promise<Result<{ id: string; name: string }>> {
  const joinCode = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{6}$/.test(joinCode)) return { success: false, error: "Join codes have 6 letters and digits" };
  const user = await requireUser();
  if (!user) return { success: false, error: "Classes need a signed-in user and a database" };
  // Throttle guessing of join codes.
  const limit = await rateLimit("classroom-join", user.id, 10, 600);
  if (!limit.success) return { success: false, error: "Too many attempts, try again in a few minutes" };

  try {
    const classroom = await prisma.classroom.findUnique({ where: { joinCode } });
    if (!classroom) return { success: false, error: "No class with that code" };
    if (classroom.ownerId === user.id) return { success: false, error: "You teach this class" };
    await prisma.classMember.upsert({
      where: { classroomId_userId: { classroomId: classroom.id, userId: user.id } },
      update: {},
      create: { classroomId: classroom.id, userId: user.id },
    });
    revalidatePath("/classes");
    return { success: true, data: { id: classroom.id, name: classroom.name } };
  } catch (error) {
    console.error("Error joining class:", error);
    return { success: false, error: "Failed to join class" };
  }
}

export async function leaveClassroom(classroomId: string): Promise<Result<null>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "Not authenticated" };
  return guard("leave the class", async () => {
    await prisma.classMember.deleteMany({ where: { classroomId, userId: user.id } });
    revalidatePath("/classes");
    return { success: true, data: null };
  });
}

export async function deleteClassroom(classroomId: string): Promise<Result<null>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "Not authenticated" };
  return guard("delete the class", async () => {
    const { count } = await prisma.classroom.deleteMany({ where: { id: classroomId, ownerId: user.id } });
    if (!count) return { success: false, error: "Only the teacher can delete this class" };
    revalidatePath("/classes");
    return { success: true, data: null };
  });
}

export async function removeStudent(classroomId: string, studentId: string): Promise<Result<null>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "Not authenticated" };
  return guard("remove the student", async () => {
    const { count } = await prisma.classMember.deleteMany({ where: { classroomId, userId: studentId, classroom: { ownerId: user.id } } });
    if (!count) return { success: false, error: "Student not found in your class" };
    revalidatePath(`/classes/${classroomId}`);
    return { success: true, data: null };
  });
}

/** Class page. Insights (aggregated progress of members) are computed only for the owner. */
export async function getClassroom(classroomId: string): Promise<Result<ClassroomDetail>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "Classes need a signed-in user and a database" };
  try {
    const classroom = await prisma.classroom.findFirst({
      where: { id: classroomId, OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] },
      include: { owner: { select: { name: true } }, members: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
    if (!classroom) return { success: false, error: "Class not found" };
    const isOwner = classroom.ownerId === user.id;
    const detail = { id: classroom.id, name: classroom.name, joinCode: isOwner ? classroom.joinCode : null, teacher: classroom.owner.name ?? "Teacher", isOwner };
    if (!isOwner) return { success: true, data: { ...detail, insights: null } };

    const ids = classroom.members.map((m) => m.userId);
    const since = new Date(Date.now() - 60 * 86_400_000);
    const [cards, sessions, quizzes] = await Promise.all([
      prisma.flashcard.findMany({
        where: { userId: { in: ids }, reps: { gt: 0 } },
        select: { userId: true, subject: true, front: true, stability: true, lastReview: true, lapses: true, reps: true },
        take: 20_000,
      }),
      prisma.sessionHistory.findMany({ where: { userId: { in: ids }, createdAt: { gte: since } }, select: { userId: true, durationMinutes: true, createdAt: true } }),
      prisma.quiz.findMany({ where: { userId: { in: ids }, completedAt: { gte: since } }, select: { userId: true, score: true } }),
    ]);
    const insights = buildClassInsights(
      classroom.members.map((m) => ({ userId: m.userId, name: m.user.name ?? m.user.email.split("@")[0] })),
      cards,
      sessions.map((s) => ({ userId: s.userId, minutes: s.durationMinutes, createdAt: s.createdAt })),
      quizzes.map((q) => ({ userId: q.userId, score: q.score ?? 0 })),
    );
    return { success: true, data: { ...detail, insights } };
  } catch (error) {
    console.error("Error loading class:", error);
    return { success: false, error: "Failed to load class" };
  }
}
