import React from "react";

// Types
export type Subject =
  | "maths"
  | "science"
  | "language"
  | "coding"
  | "history"
  | "economics"
  | "physics"
  | "chemistry"
  | "biology"
  | "geography";

export type TeachingStyle = "formal" | "casual" | "socratic" | "storytelling";
export type VoiceGender = "male" | "female";

export interface Companion {
  id: string;
  name: string;
  subject: Subject;
  topic: string;
  description: string;
  duration: number;
  style: TeachingStyle;
  voice: VoiceGender;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export interface SessionHistory {
  id: string;
  companionId: string;
  userId: string;
  startedAt: Date;
  endedAt: Date;
  durationMinutes: number;
  transcript: string;
  xpEarned: number;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  level: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalSessionsMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface RAGDocument {
  id: string;
  userId: string;
  title: string;
  content: string;
  embedding: number[];
  subject: Subject;
  createdAt: Date;
}

export interface SavedMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props
export interface CompanionCardProps {
  companion: Companion;
  onSelect: (id: string) => void;
  onBookmark: (id: string) => void;
}

export interface VoiceSessionProps {
  companionId: string;
  companion: Companion;
  onSessionEnd: (duration: number) => void;
}

export interface ActivityHeatmapProps {
  userId: string;
  data: Array<{ date: string; count: number }>;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  color?: string;
}

// Form Types
export interface CreateCompanionFormData {
  name: string;
  subject: Subject;
  topic: string;
  description: string;
  duration: number;
  style: TeachingStyle;
  voice: VoiceGender;
}

export interface UpdateProfileFormData {
  name: string;
  bio: string;
  image?: string;
}
