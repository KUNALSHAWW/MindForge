import { z } from "zod";
import { complete, extractJson, isLLMConfigured } from "@/lib/ai/llm";
import { gradeByOverlap, gradeCloze, type Grade, type QuizQuestion, type QuizSource } from "@/lib/quiz";

const GeneratedSchema = z.object({
  questions: z
    .array(z.object({ question: z.string().min(8).max(400), answer: z.string().min(1).max(600), source: z.number().int().min(1) }))
    .min(1),
});

/**
 * Short-answer questions that require recalling and explaining ideas from the passages,
 * each tied to the passage it came from. Returns null when no LLM is available.
 */
export async function generateQuestions(sources: QuizSource[], count: number): Promise<QuizQuestion[] | null> {
  if (!isLLMConfigured()) return null;
  try {
    const reply = await complete(
      [
        {
          role: "system",
          content:
            'You write retrieval-practice questions from study notes. Reply with JSON only: {"questions": [{"question": string, "answer": string, "source": number}]}. Each question must be answerable from its numbered passage alone, test understanding (why/how/what) rather than trivia, and have a 1-2 sentence model answer. Never copy a full sentence from the passage into the question. Use different passages where possible.',
        },
        {
          role: "user",
          content: `Write ${count} questions.\n\n${sources.map((s, i) => `[${i + 1}] (${s.title}) ${s.text}`).join("\n\n")}`,
        },
      ],
      { maxTokens: 1200, temperature: 0.4, signal: AbortSignal.timeout(30_000) },
    );
    const parsed = GeneratedSchema.safeParse(extractJson(reply));
    if (!parsed.success) return null;
    return parsed.data.questions
      .filter((q) => q.source <= sources.length)
      .slice(0, count)
      .map((q) => ({ question: q.question, answer: q.answer, kind: "open" as const, source: sources[q.source - 1] }));
  } catch (error) {
    console.warn("Quiz generation failed, using cloze questions:", error);
    return null;
  }
}

const GradeSchema = z.object({ score: z.union([z.literal(0), z.literal(0.5), z.literal(1)]), feedback: z.string().min(1).max(500) });

/** Grades one answer. Cloze answers are graded locally; open answers by the LLM with a local fallback. */
export async function gradeAnswer(question: QuizQuestion, response: string): Promise<Grade> {
  if (question.kind === "cloze") return gradeCloze(question.answer, response);
  if (!response.trim()) return { score: 0, feedback: `No answer given. A complete answer: ${question.answer}` };
  if (!isLLMConfigured()) return gradeByOverlap(question.answer, response);
  try {
    const reply = await complete(
      [
        {
          role: "system",
          content:
            'You grade a learner\'s short answer against a model answer and the source passage. Accept paraphrases, synonyms and different wording; judge meaning, not phrasing. Score 1 if correct and complete, 0.5 if partly correct or missing a key idea, 0 if wrong. Reply with JSON only: {"score": 0 | 0.5 | 1, "feedback": string}. Feedback is one or two sentences addressed to the learner: say what was right and what was missing.',
        },
        {
          role: "user",
          content: `Question: ${question.question}\nModel answer: ${question.answer}\nSource passage: ${question.source.text}\nLearner's answer: ${response.slice(0, 2000)}`,
        },
      ],
      { maxTokens: 250, temperature: 0, signal: AbortSignal.timeout(20_000) },
    );
    const parsed = GradeSchema.safeParse(extractJson(reply));
    return parsed.success ? parsed.data : gradeByOverlap(question.answer, response);
  } catch {
    return gradeByOverlap(question.answer, response);
  }
}
