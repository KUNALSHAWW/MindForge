"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Mic, BookOpen, Clock, User2 } from "lucide-react";
import { createCompanion } from "@/lib/actions/companion";

const SUBJECTS = [
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
];

const STYLES = [
  { value: "formal", label: "Formal", description: "Professional, structured approach", icon: "👔" },
  { value: "casual", label: "Casual", description: "Friendly, conversational tone", icon: "😊" },
  { value: "socratic", label: "Socratic", description: "Questions to guide understanding", icon: "❓" },
  { value: "storytelling", label: "Storytelling", description: "Learn through narratives", icon: "📖" },
];

const DURATIONS = [
  { value: 15, label: "15 min", description: "Quick review" },
  { value: 30, label: "30 min", description: "Standard session" },
  { value: 45, label: "45 min", description: "Deep dive" },
  { value: 60, label: "60 min", description: "Comprehensive" },
];

export default function CreateCompanionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    topic: "",
    description: "",
    duration: 30,
    style: "casual" as "formal" | "casual" | "socratic" | "storytelling",
    voice: "female" as "male" | "female",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name.trim()) {
      setError("Please enter a name for your companion");
      return;
    }
    if (!formData.subject) {
      setError("Please select a subject");
      return;
    }
    if (!formData.topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createCompanion(formData);
      
      if (result.success && result.data) {
        router.push(`/companions/${result.data.id}`);
      } else {
        setError(result.error || "Failed to create companion");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/companions"
          className="inline-flex items-center gap-2 text-sm text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companions
        </Link>
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
          Create AI Companion
        </h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          Design a personalized AI tutor for your learning needs
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-[hsl(var(--error)/0.1)] border border-[hsl(var(--error)/0.3)] rounded-lg text-[hsl(var(--error))] text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h2 className="font-medium text-[hsl(var(--foreground))]">Basic Information</h2>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">Give your companion a name and personality</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Companion Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Dr. Physics, Code Master"
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your companion's personality, teaching approach, and specialties..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Subject & Topic */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h2 className="font-medium text-[hsl(var(--foreground))]">Subject & Topic</h2>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">What will your companion teach?</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Subject
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, subject: subject.value })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.subject === subject.value
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]"
                        : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] text-[hsl(var(--foreground-muted))]"
                    }`}
                  >
                    <span className="text-xl block mb-1">{subject.icon}</span>
                    <span className="text-xs font-medium">{subject.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Specific Topic
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., Quantum Mechanics, React Hooks, World War II"
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Teaching Style */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
              <User2 className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h2 className="font-medium text-[hsl(var(--foreground))]">Teaching Style</h2>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">How should your companion teach?</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STYLES.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => setFormData({ ...formData, style: style.value as typeof formData.style })}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.style === style.value
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                    : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)]"
                }`}
              >
                <span className="text-2xl block mb-2">{style.icon}</span>
                <span className={`font-medium block ${formData.style === style.value ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]"}`}>
                  {style.label}
                </span>
                <span className="text-xs text-[hsl(var(--foreground-muted))]">{style.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Session & Voice */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
              <Mic className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h2 className="font-medium text-[hsl(var(--foreground))]">Session Settings</h2>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">Configure voice and duration</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Default Session Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DURATIONS.map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: duration.value })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.duration === duration.value
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]"
                        : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] text-[hsl(var(--foreground-muted))]"
                    }`}
                  >
                    <span className="font-medium block">{duration.label}</span>
                    <span className="text-xs opacity-75">{duration.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Voice Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, voice: "female" })}
                  className={`p-4 rounded-lg border transition-all ${
                    formData.voice === "female"
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                      : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)]"
                  }`}
                >
                  <span className="text-2xl block mb-2">👩</span>
                  <span className={`font-medium ${formData.voice === "female" ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]"}`}>
                    Female Voice
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, voice: "male" })}
                  className={`p-4 rounded-lg border transition-all ${
                    formData.voice === "male"
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                      : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)]"
                  }`}
                >
                  <span className="text-2xl block mb-2">👨</span>
                  <span className={`font-medium ${formData.voice === "male" ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]"}`}>
                    Male Voice
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/companions"
            className="px-6 py-3 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Create Companion
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
