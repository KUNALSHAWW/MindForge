import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sparkles, BarChart3, Flame, BookOpen } from "lucide-react";

export const metadata = {
  title: "Dashboard | MindForge",
  description: "Your personalized learning dashboard with progress tracking",
};

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="animate-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold mb-2">
          Welcome back, {user.firstName || "Learner"}! 👋
        </h1>
        <p className="text-foreground-muted text-lg">
          Let&apos;s continue your learning journey and forge new knowledge today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="stat-label">Total Sessions</div>
            <BookOpen className="w-5 h-5 text-primary/60" />
          </div>
          <div className="stat-value">12</div>
          <p className="text-sm text-success">+2 this week</p>
        </div>

        <div className="stat-card hover:border-secondary/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="stat-label">Learning Hours</div>
            <BarChart3 className="w-5 h-5 text-secondary/60" />
          </div>
          <div className="stat-value">24.5</div>
          <p className="text-sm text-success">+4.2 this week</p>
        </div>

        <div className="stat-card hover:border-accent/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="stat-label">Current Streak</div>
            <Flame className="w-5 h-5 text-accent/60" />
          </div>
          <div className="stat-value">7</div>
          <p className="text-sm text-muted-foreground">days consistent</p>
        </div>

        <div className="stat-card hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="stat-label">Total XP</div>
            <Sparkles className="w-5 h-5 text-primary/60" />
          </div>
          <div className="stat-value">3,450</div>
          <p className="text-sm text-success">Level 8</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="floating-card p-8">
            <h2 className="font-display text-2xl font-bold mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="btn btn-primary btn-lg w-full justify-center">
                <Sparkles className="w-5 h-5" />
                Start New Session
              </button>
              <button className="btn btn-secondary btn-lg w-full justify-center">
                <BookOpen className="w-5 h-5" />
                Browse Companions
              </button>
              <button className="btn btn-secondary btn-lg w-full justify-center">
                <BarChart3 className="w-5 h-5" />
                View Analytics
              </button>
              <button className="btn btn-secondary btn-lg w-full justify-center">
                <Flame className="w-5 h-5" />
                Achievements
              </button>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="floating-card p-8 mt-6">
            <h2 className="font-display text-2xl font-bold mb-6">
              Recent Learning Sessions
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-background-secondary rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer group"
                >
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      Physics - Quantum Mechanics
                    </h3>
                    <p className="text-sm text-foreground-muted">
                      2 days ago • 45 minutes
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    +150 XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Level & XP */}
          <div className="floating-card p-6 mb-6">
            <h3 className="font-display font-bold mb-4">Level Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Level 8</span>
                <span className="text-sm text-foreground-muted">
                  3,450/5,000 XP
                </span>
              </div>
              <div className="w-full h-3 bg-background-secondary rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-gradient-primary rounded-full transition-all duration-500" />
              </div>
            </div>
            <p className="text-xs text-foreground-muted">
              1,550 XP until Level 9
            </p>
          </div>

          {/* Achievements */}
          <div className="floating-card p-6">
            <h3 className="font-display font-bold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {[
                { icon: "🔥", title: "Week Warrior", desc: "7-day streak" },
                {
                  icon: "🎯",
                  title: "Focus Master",
                  desc: "60+ min session",
                },
                {
                  icon: "⭐",
                  title: "Knowledge Seeker",
                  desc: "5 subjects",
                },
              ].map((achievement, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-1">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {achievement.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
