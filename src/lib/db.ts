import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbProbe: { at: number; ok: Promise<boolean> } | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const PROBE_TTL_MS = 30_000;

/**
 * True when Postgres is reachable. Without DATABASE_URL (or with the database down)
 * the app runs in demo mode on in-memory sample data instead of failing.
 * The probe result is cached for 30s so pages don't pay a round trip per action.
 */
export function isDatabaseAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return Promise.resolve(false);
  const cached = globalForPrisma.dbProbe;
  if (cached && Date.now() - cached.at < PROBE_TTL_MS) return cached.ok;
  const ok = prisma.$queryRaw`SELECT 1`.then(
    () => true,
    () => false,
  );
  globalForPrisma.dbProbe = { at: Date.now(), ok };
  return ok;
}

type ClerkUserLike = {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
};

/** App user row for a Clerk user, created on first use (lazy provisioning). */
export async function ensureUser(clerkUser: ClerkUserLike) {
  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;
  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {},
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? `${clerkUser.id}@users.mindforge.local`,
      name,
      image: clerkUser.imageUrl ?? null,
    },
  });
}

export default prisma;
