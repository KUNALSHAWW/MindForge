import { z } from "zod";

// Auth Validators
export const SignUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Companion Validators
export const CreateCompanionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  subject: z.enum([
    "maths",
    "science",
    "language",
    "coding",
    "history",
    "economics",
    "physics",
    "chemistry",
    "biology",
    "geography",
  ]),
  topic: z.string().min(1, "Topic is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  duration: z.number().min(5).max(120),
  style: z.enum(["formal", "casual", "socratic", "storytelling"]),
  voice: z.enum(["male", "female"]),
});

export const UpdateCompanionSchema = CreateCompanionSchema.partial();

// Session Validators
export const CreateSessionSchema = z.object({
  companionId: z.string().uuid(),
  durationMinutes: z.number().min(1).max(480),
  transcript: z.string().optional(),
  notes: z.string().optional(),
});

// RAG Document Validators
export const CreateRAGDocumentSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(50000),
  subject: z.enum([
    "maths",
    "science",
    "language",
    "coding",
    "history",
    "economics",
    "physics",
    "chemistry",
    "biology",
    "geography",
  ]),
});

// Profile Validators
export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  image: z.string().url().optional(),
});

// Type exports
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type CreateCompanionInput = z.infer<typeof CreateCompanionSchema>;
export type UpdateCompanionInput = z.infer<typeof UpdateCompanionSchema>;
export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
export type CreateRAGDocumentInput = z.infer<typeof CreateRAGDocumentSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
