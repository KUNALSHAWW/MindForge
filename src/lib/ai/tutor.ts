import { z } from "zod";
import { complete, extractJson, isLLMConfigured, type ChatMessage } from "@/lib/ai/llm";
import { subjectLabel } from "@/lib/subjects";

export interface TutorPersona {
  name: string;
  subject: string;
  topic: string;
  description: string;
  style: string;
}

export interface SourcePassage {
  title: string;
  text: string;
}

const STYLE_RULES: Record<string, string> = {
  socratic:
    "Teach with the Socratic method. Never hand over a final answer the learner could reach themselves. Ask one guiding question at a time, give a hint only after they try, and let them state the conclusion. If they are stuck after two hints, show one worked step and ask them to do the next.",
  formal:
    "Teach in a precise, structured way: define terms, state the principle, then give one worked example. Use correct notation.",
  casual:
    "Teach like a friendly senior student: plain words, everyday analogies, short sentences, light encouragement.",
  storytelling:
    "Teach through short narratives, historical anecdotes or vivid scenarios that make the idea memorable, then state the idea plainly.",
};

/**
 * System prompt for a companion. Grounding passages are numbered so the model can cite them,
 * and cards the learner is about to forget (lowest FSRS retrievability) are woven into the
 * conversation as quick retrieval practice.
 */
export function buildTutorPrompt(persona: TutorPersona, sources: SourcePassage[], fadingCards: string[]): string {
  const parts = [
    `You are ${persona.name}, an AI tutor for ${subjectLabel(persona.subject)}, focused on "${persona.topic}".`,
    persona.description && `Your persona: ${persona.description}`,
    STYLE_RULES[persona.style] ?? STYLE_RULES.casual,
    "Rules: keep replies under 150 words unless the learner asks for depth; check understanding with a short question at the end; correct misconceptions directly but kindly; admit uncertainty instead of guessing; use Markdown and LaTeX-free plain math (e.g. F = m * a).",
  ];

  if (sources.length) {
    parts.push(
      "The learner uploaded these notes. Prefer them over general knowledge, cite them inline as [1], [2] when you use them, and say so when the notes do not cover the question:",
      sources.map((s, i) => `[${i + 1}] (${s.title}) ${s.text}`).join("\n\n"),
    );
  }

  if (fadingCards.length) {
    parts.push(
      "Spaced-repetition signal: the learner is close to forgetting the facts below. When it fits naturally, ask them to recall one (without revealing the answer first):",
      fadingCards.map((c) => `- ${c}`).join("\n"),
    );
  }

  return parts.filter(Boolean).join("\n\n");
}

/** Template replies used when no LLM is configured, so demo mode still feels alive. */
export function offlineTutorReply(message: string, persona: TutorPersona): string {
  const m = message.toLowerCase();
  const subject = subjectLabel(persona.subject);
  const opener: Record<string, string> = {
    formal: "Let us approach this methodically.",
    casual: "Good question!",
    socratic: "Before I answer, let's reason it out together.",
    storytelling: "Picture this for a moment.",
  };
  const start = opener[persona.style] ?? opener.casual;

  if (/\b(example|practice|problem)\b/.test(m))
    return `${start} Try this: pick one core idea from ${persona.topic} and apply it to a situation from your own day. What would you expect to happen, and why?`;
  if (/\b(quiz|test|assess)\b/.test(m))
    return `${start} Quick check on ${persona.topic}: explain the central idea in two sentences, as if to a friend. I'll point out anything missing.`;
  if (/\b(stuck|confused|help)\b/.test(m))
    return `${start} Let's shrink the problem. Which single step in ${persona.topic} feels unclear? Name it and we'll work on just that.`;
  return `${start} That touches an important part of ${persona.topic} in ${subject}. What do you already know about it? Starting from your own words makes the next step stick.\n\n_Offline mode: set \`LLM_API_KEY\` or \`HUGGINGFACE_API_KEY\` for real AI answers._`;
}

const SessionDigestSchema = z.object({
  summary: z.string().min(1).max(2000),
  flashcards: z
    .array(z.object({ front: z.string().min(3).max(300), back: z.string().min(1).max(600) }))
    .max(8),
});

export type SessionDigest = z.infer<typeof SessionDigestSchema>;

/**
 * Turns a session transcript into a short summary plus atomic question/answer flashcards.
 * Returns null when no LLM is configured or the reply is unusable; the session still saves.
 */
export async function digestSession(transcript: string, persona: TutorPersona): Promise<SessionDigest | null> {
  if (!isLLMConfigured() || transcript.trim().length < 80) return null;
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        'You turn tutoring transcripts into study material. Reply with JSON only: {"summary": string, "flashcards": [{"front": string, "back": string}]}. The summary is 2-4 sentences of what the learner covered and where they struggled. Write 3-6 flashcards about facts or concepts actually discussed: one idea per card, the front a specific question, the back a short complete answer. Do not invent content that is not in the transcript.',
    },
    { role: "user", content: `Subject: ${subjectLabel(persona.subject)} / ${persona.topic}\n\nTranscript:\n${transcript.slice(-12_000)}` },
  ];
  try {
    const reply = await complete(messages, { maxTokens: 900, temperature: 0.2, signal: AbortSignal.timeout(25_000) });
    const parsed = SessionDigestSchema.safeParse(extractJson(reply));
    return parsed.success ? parsed.data : null;
  } catch (error) {
    console.warn("Session digest failed:", error);
    return null;
  }
}
