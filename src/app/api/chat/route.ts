import { auth, currentUser } from "@clerk/nextjs/server";
import { getCompanion } from "@/lib/actions/companion";
import { isLLMConfigured, streamCompletion, type ChatMessage } from "@/lib/ai/llm";
import { buildTutorPrompt, offlineTutorReply, type SourcePassage } from "@/lib/ai/tutor";
import prisma, { isDatabaseAvailable } from "@/lib/db";
import { fadingCards, retrievePassages } from "@/lib/knowledge";
import { rateLimit } from "@/lib/rate-limit";
import { ChatRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HISTORY = 16; // messages of context sent to the model

/**
 * Streams a tutor reply as plain text.
 * Grounding sources travel in the `X-Sources` header so the client can render citations.
 */
export async function POST(request: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const limit = await rateLimit("chat", clerkId, 30, 60);
  if (!limit.success) {
    return Response.json(
      { error: `Slow down a little: try again in ${limit.retryAfterSeconds}s` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const parsed = ChatRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const { companionId, messages } = parsed.data;

  const companionResult = await getCompanion(companionId);
  if (!companionResult.success) return Response.json({ error: companionResult.error }, { status: 404 });
  const companion = companionResult.data;
  const question = messages.findLast((m) => m.role === "user")?.content ?? "";

  let sources: SourcePassage[] = [];
  let fading: string[] = [];
  if (await isDatabaseAvailable()) {
    const clerkUser = await currentUser();
    const user = clerkUser && (await prisma.user.findUnique({ where: { clerkId: clerkUser.id }, select: { id: true } }));
    if (user) {
      [sources, fading] = await Promise.all([
        retrievePassages(user.id, companion.subject, question).catch(() => []),
        fadingCards(user.id, companion.id).catch(() => []),
      ]);
    }
  }

  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Sources": encodeURIComponent(JSON.stringify(sources.map((s) => ({ title: s.title, text: s.text.slice(0, 280) })))),
    "X-Tutor-Mode": isLLMConfigured() ? "llm" : "offline",
  };

  if (!isLLMConfigured()) {
    return new Response(offlineTutorReply(question, companion), { headers });
  }

  const prompt: ChatMessage[] = [
    { role: "system", content: buildTutorPrompt(companion, sources, fading) },
    ...messages.slice(-HISTORY),
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamCompletion(prompt, { signal: AbortSignal.any([request.signal, AbortSignal.timeout(90_000)]) })) {
          controller.enqueue(encoder.encode(delta));
        }
      } catch (error) {
        if (!request.signal.aborted) {
          console.error("Tutor stream failed:", error);
          controller.enqueue(encoder.encode("\n\n_The tutor could not answer right now. Please try again._"));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers });
}
