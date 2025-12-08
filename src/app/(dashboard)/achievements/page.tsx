import { Suspense } from "react";
import { Trophy, Lock, CheckCircle2, Target, Flame, Zap, Clock } from "lucide-react";
import { getAchievements, getAchievementProgress } from "@/lib/actions/achievement";

export const metadata = {
  title: "Achievements | MindForge",
  description: "Track your learning achievements and milestones",
};

function AchievementsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 w-48 bg-[hsl(var(--muted))] rounded" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 h-24" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="card p-6 h-40" />
        ))}
      </div>
    </div>
  );
}

async function AchievementsContent() {
  const [achievementsResult, progressResult] = await Promise.all([
    getAchievements(),
    getAchievementProgress(),
  ]);

  if (!achievementsResult.success || !achievementsResult.data) {
    return (
      <div className="text-center py-12">
        <p className="text-[hsl(var(--foreground-muted))]">
          Failed to load achievements. Please try again.
        </p>
      </div>
    );
  }

  const { all, stats } = achievementsResult.data;
  const progress = progressResult.data;

  // Group achievements by category
  const categories = {
    sessions: all.filter(a => a.category === "sessions"),
    streak: all.filter(a => a.category === "streak"),
    xp: all.filter(a => a.category === "xp"),
    time: all.filter(a => a.category === "time"),
    special: all.filter(a => a.category === "special"),
  };

  const categoryIcons = {
    sessions: Target,
    streak: Flame,
    xp: Zap,
    time: Clock,
    special: Trophy,
  };

  const categoryLabels = {
    sessions: "Sessions",
    streak: "Streaks",
    xp: "Experience",
    time: "Time",
    special: "Special",
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{stats.totalUnlocked}</p>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">Unlocked</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[hsl(var(--foreground-muted))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{stats.totalAvailable - stats.totalUnlocked}</p>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">Locked</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--success)/0.1)] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{stats.percentComplete}%</p>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">Complete</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{stats.totalAvailable}</p>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      {progress && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Next Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressBar
              label="Sessions"
              current={progress.sessions.current}
              target={progress.sessions.next}
              icon={<Target className="w-4 h-4" />}
              color="primary"
            />
            <ProgressBar
              label="Streak"
              current={progress.streak.current}
              target={progress.streak.next}
              icon={<Flame className="w-4 h-4" />}
              color="orange"
            />
            <ProgressBar
              label="XP"
              current={progress.xp.current}
              target={progress.xp.next}
              icon={<Zap className="w-4 h-4" />}
              color="yellow"
            />
            <ProgressBar
              label="Minutes"
              current={progress.time.current}
              target={progress.time.next}
              icon={<Clock className="w-4 h-4" />}
              color="blue"
            />
          </div>
        </div>
      )}

      {/* Achievements by Category */}
      {(Object.keys(categories) as Array<keyof typeof categories>).map((category) => {
        const CategoryIcon = categoryIcons[category];
        const achievements = categories[category];
        
        if (achievements.length === 0) return null;

        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              <CategoryIcon className="w-5 h-5 text-[hsl(var(--primary))]" />
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                {categoryLabels[category]}
              </h2>
              <span className="text-sm text-[hsl(var(--foreground-muted))]">
                ({achievements.filter(a => a.isUnlocked).length}/{achievements.length})
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.title}
                  className={`card p-4 transition-all ${
                    achievement.isUnlocked
                      ? "border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.02)]"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`text-4xl mb-3 ${achievement.isUnlocked ? "" : "grayscale"}`}>
                      {achievement.icon}
                    </div>
                    <h3 className={`font-medium text-sm mb-1 ${
                      achievement.isUnlocked 
                        ? "text-[hsl(var(--foreground))]" 
                        : "text-[hsl(var(--foreground-muted))]"
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-[hsl(var(--foreground-muted))] mb-2">
                      {achievement.description}
                    </p>
                    {achievement.isUnlocked && achievement.unlockedAt && (
                      <p className="text-xs text-[hsl(var(--primary))]">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                    {!achievement.isUnlocked && (
                      <div className="flex items-center gap-1 text-xs text-[hsl(var(--foreground-subtle))]">
                        <Lock className="w-3 h-3" />
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar({ 
  label, 
  current, 
  target, 
  icon,
  color 
}: { 
  label: string; 
  current: number; 
  target: number;
  icon: React.ReactNode;
  color: "primary" | "orange" | "yellow" | "blue";
}) {
  const percentage = Math.min(100, (current / target) * 100);
  
  const colorClasses = {
    primary: "bg-[hsl(var(--primary))]",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--foreground-muted))]">
          {icon}
          {label}
        </div>
        <span className="text-sm font-medium text-[hsl(var(--foreground))]">
          {current.toLocaleString()} / {target.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
          Achievements
        </h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          Track your learning milestones and unlock rewards
        </p>
      </div>

      <Suspense fallback={<AchievementsSkeleton />}>
        <AchievementsContent />
      </Suspense>
    </div>
  );
}
