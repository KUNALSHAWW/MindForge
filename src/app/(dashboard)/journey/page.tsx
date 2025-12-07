import { Sparkles, TrendingUp, Target } from "lucide-react";

export const metadata = {
  title: "My Journey | MindForge",
  description: "Track your learning progress with detailed analytics",
};

export default function MyJourneyPage() {
  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold mb-2">My Learning Journey</h1>
        <p className="text-foreground-muted">
          Track your progress, analyze patterns, and celebrate achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="stat-label">Total Learning Time</div>
            <TrendingUp className="w-5 h-5 text-primary/60" />
          </div>
          <div className="stat-value">47.5h</div>
          <p className="text-sm text-foreground-muted">across 24 sessions</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="stat-label">Subjects Mastered</div>
            <Target className="w-5 h-5 text-secondary/60" />
          </div>
          <div className="stat-value">6</div>
          <p className="text-sm text-foreground-muted">out of 10</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="stat-label">Average Session</div>
            <Sparkles className="w-5 h-5 text-accent/60" />
          </div>
          <div className="stat-value">47m</div>
          <p className="text-sm text-success">+5m from last week</p>
        </div>
      </div>

      {/* Learning Activity Chart */}
      <div className="floating-card p-8 mb-8">
        <h2 className="font-display text-2xl font-bold mb-6">
          Weekly Activity
        </h2>
        <div className="h-64 bg-background-secondary rounded-lg flex items-center justify-center">
          <p className="text-foreground-muted">Chart visualization coming soon</p>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="floating-card p-8">
        <h2 className="font-display text-2xl font-bold mb-6">
          Subject Performance
        </h2>
        <div className="space-y-4">
          {[
            { name: "Physics", percentage: 85 },
            { name: "Mathematics", percentage: 72 },
            { name: "Programming", percentage: 90 },
            { name: "English", percentage: 68 },
            { name: "Biology", percentage: 75 },
            { name: "Chemistry", percentage: 80 },
          ].map((subject) => (
            <div key={subject.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{subject.name}</span>
                <span className="text-sm text-foreground-muted">
                  {subject.percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${subject.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
