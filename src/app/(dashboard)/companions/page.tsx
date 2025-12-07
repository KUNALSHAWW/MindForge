import { Suspense } from "react";
import { BookOpen, Plus, Heart } from "lucide-react";

export const metadata = {
  title: "Companions | MindForge",
  description: "Browse and create learning companions tailored to your needs",
};

async function CompanionsList() {
  // This will be replaced with actual data fetching
  const companions = [
    {
      id: "1",
      name: "Dr. Physics",
      subject: "physics",
      topic: "Quantum Mechanics",
      duration: 45,
    },
    {
      id: "2",
      name: "Code Master",
      subject: "coding",
      topic: "React Fundamentals",
      duration: 60,
    },
    {
      id: "3",
      name: "Math Wizard",
      subject: "maths",
      topic: "Calculus",
      duration: 30,
    },
  ];

  return (
    <div className="grid-auto">
      {companions.map((companion) => (
        <div key={companion.id} className="floating-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg mb-1">
                {companion.name}
              </h3>
              <div className="subject-badge capitalize">
                {companion.subject}
              </div>
            </div>
            <button className="btn btn-ghost btn-icon">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          <p className="text-foreground-muted mb-4">{companion.topic}</p>
          <div className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
            <BookOpen className="w-4 h-4" />
            <span>{companion.duration} min session</span>
          </div>
          <button className="btn btn-primary w-full justify-center">
            Start Session
          </button>
        </div>
      ))}
    </div>
  );
}

export default function CompanionsPage() {
  return (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">
            Learning Companions
          </h1>
          <p className="text-foreground-muted">
            Choose from AI tutors or create your own personalized companion
          </p>
        </div>
        <button className="btn btn-primary btn-lg">
          <Plus className="w-5 h-5" />
          Create Companion
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
        {[
          "All",
          "Maths",
          "Science",
          "Language",
          "Coding",
          "History",
          "Economics",
        ].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              filter === "All"
                ? "bg-primary text-white"
                : "bg-background-secondary hover:bg-border"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Companions Grid */}
      <Suspense fallback={<div className="grid-auto animate-pulse" />}>
        <CompanionsList />
      </Suspense>
    </div>
  );
}
