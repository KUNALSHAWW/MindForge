import { z } from "zod";
import { SUBJECT_VALUES, TEACHING_STYLES } from "@/lib/subjects";

export const MAX_DOCUMENT_CHARS = 300_000;
export const MAX_PDF_BYTES = 10 * 1024 * 1024;

// Prisma ids are cuids; demo-mode ids look like "demo-3" or "local-1712345678".
const id = z.string().min(1).max(64);

export const CreateCompanionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  subject: z.enum(SUBJECT_VALUES, { message: "Please select a subject" }),
  topic: z.string().trim().min(1, "Topic is required").max(200),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000),
  duration: z.number().int().min(5).max(120),
  style: z.enum(TEACHING_STYLES),
  voice: z.enum(["male", "female"]),
});

export const CreateSessionSchema = z.object({
  companionId: id,
  durationMinutes: z.number().int().min(1).max(480),
  transcript: z.string().max(200_000).default(""),
  notes: z.string().max(5000).optional(),
  timeZone: z.string().max(64).optional(),
});

export const ChatRequestSchema = z.object({
  companionId: id,
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(40),
});

export const CreateDocumentSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(10, "Add at least a few sentences").max(MAX_DOCUMENT_CHARS, "Notes are limited to 300,000 characters"),
  subject: z.enum(SUBJECT_VALUES),
});

export const CreateFlashcardSchema = z.object({
  front: z.string().trim().min(1).max(500),
  back: z.string().trim().min(1).max(2000),
  subject: z.enum(SUBJECT_VALUES),
});

export const ReviewSchema = z.object({
  cardId: id,
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  bio: z.string().trim().max(500).optional(),
});

export const SettingsSchema = z.object({
  appearance: z.object({
    theme: z.enum(["light", "dark", "system"]),
  }),
  learning: z.object({
    voiceEnabled: z.boolean(),
    autoSpeak: z.boolean(),
    dailyReviewGoal: z.number().int().min(5).max(500),
  }),
});

export type CreateCompanionInput = z.infer<typeof CreateCompanionSchema>;
export type CreateSessionInput = z.input<typeof CreateSessionSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type Settings = z.infer<typeof SettingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  appearance: { theme: "system" },
  learning: { voiceEnabled: true, autoSpeak: true, dailyReviewGoal: 20 },
};

/** First validation message, for showing in the UI. */
export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input";
}
