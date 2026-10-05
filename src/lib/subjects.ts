// The one list of subjects used by the create form, filters, validators and RAG.
export const SUBJECTS = [
  { value: "maths", label: "Mathematics", icon: "📐" },
  { value: "science", label: "Science", icon: "🔬" },
  { value: "physics", label: "Physics", icon: "⚛️" },
  { value: "chemistry", label: "Chemistry", icon: "🧪" },
  { value: "biology", label: "Biology", icon: "🧬" },
  { value: "coding", label: "Programming", icon: "💻" },
  { value: "history", label: "History", icon: "📜" },
  { value: "language", label: "Language", icon: "🗣️" },
  { value: "economics", label: "Economics", icon: "📊" },
  { value: "philosophy", label: "Philosophy", icon: "🤔" },
  { value: "art", label: "Art & Design", icon: "🎨" },
  { value: "music", label: "Music", icon: "🎵" },
] as const;

export type Subject = (typeof SUBJECTS)[number]["value"];
export const SUBJECT_VALUES = SUBJECTS.map((s) => s.value) as [Subject, ...Subject[]];

export function subjectLabel(value: string): string {
  return SUBJECTS.find((s) => s.value === value)?.label ?? value;
}

export function subjectIcon(value: string): string {
  return SUBJECTS.find((s) => s.value === value.toLowerCase())?.icon ?? "📚";
}

export const TEACHING_STYLES = ["formal", "casual", "socratic", "storytelling"] as const;
export type TeachingStyle = (typeof TEACHING_STYLES)[number];
