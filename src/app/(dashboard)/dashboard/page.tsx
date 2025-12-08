import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Flame,
  Trophy,
  TrendingUp,
  ArrowRight,
  Zap,
} from "lucide-react";

import { getDashboardData } from "@/lib/actions/user";
import {
  StatCard,
  StatCardSkeleton,
  Card,
  CardHeader,
  SessionList,
  SessionListSkeleton,
  CompanionGrid,
  CompanionGridSkeleton,
  QuickActions,
  ProgressRing,
} from "@/components/Dashboard";

export const metadata = {
  title: "Dashboard | MindForge",
  description: "Your personalized learning dashboard with progress tracking",
};

// Placeholder data for when DB is empty
const placeholderStats = {
  level: 1,
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalSessionMinutes: 0,
  xpToNextLevel: 1000,
  levelProgress: 0,
};

async function DashboardContent() {
  const { data, error } = await getDashboardData();

  if (error || !data) {
    // Show placeholder content for new users
    return (
      <DashboardUI
        userName="Learner"
        stats={placeholderStats}
        sessions={[]}
        companions={[]}
        achievements={[]}
      />
    );
  }

  return (
    <DashboardUI
      userName={data.user.name?.split(" ")[0] || "Learner"}
      stats={data.stats}
      sessions={data.recentSessions}
      companions={data.companions}
      achievements={data.achievements}
    />
  );
}

interface DashboardUIProps {
  userName: string;
  stats: typeof placeholderStats;
  sessions: Awaited<ReturnType<typeof getDashboardData>>["data"] extends null
    ? never
    : NonNullable<Awaited<ReturnType<typeof getDashboardData>>["data"]>["recentSessions"];
  companions: Awaited<ReturnType<typeof getDashboardData>>["data"] extends null
    ? never
    : NonNullable<Awaited<ReturnType<typeof getDashboardData>>["data"]>["companions"];
  achievements: Awaited<ReturnType<typeof getDashboardData>>["data"] extends null
    ? never
    : NonNullable<Awaited<ReturnType<typeof getDashboardData>>["data"]>["achievements"];
}

function DashboardUI({ userName, stats, sessions, companions, achievements }: DashboardUIProps) {
  const totalHours = Math.round((stats.totalSessionMinutes / 60) * 10) / 10;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
            Track your learning progress and continue your journey
          </p>
        </div>
        <Link
          href="/companions"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--primary))] text-white text-sm font-medium rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-colors"
        >
          <Zap className="w-4 h-4" />
          Start Learning
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total XP"
          value={stats.totalXP.toLocaleString()}
          subValue={`Level ${stats.level}`}
          icon={Sparkles}
          variant="indigo"
        />
        <StatCard
          label="Learning Hours"
          value={totalHours}
          subValue="Total time invested"
          icon={Clock}
          variant="emerald"
        />
        <StatCard
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          subValue={`Best: ${stats.longestStreak} days`}
          icon={Flame}
          variant="amber"
        />
        <StatCard
          label="Sessions"
          value={sessions.length > 0 ? sessions.length : "0"}
          subValue="Completed sessions"
          icon={Trophy}
          variant="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader
              title="Quick Actions"
              description="Jump into learning with one click"
            />
            <QuickActions />
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader
              title="Recent Sessions"
              description="Your latest learning activity"
              action={
                sessions.length > 0 ? (
                  <Link
                    href="/journey"
                    className="text-sm text-[hsl(var(--primary))] hover:underline inline-flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : null
              }
            />
            <SessionList sessions={sessions} />
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card className="text-center">
            <div className="flex flex-col items-center py-4">
              <ProgressRing
                progress={stats.levelProgress}
                size={140}
                strokeWidth={10}
                label={`${stats.level}`}
                subLabel="Level"
              />
              <div className="mt-4 space-y-1">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {stats.xpToNextLevel.toLocaleString()} XP to Level {stats.level + 1}
                </p>
                <p className="text-xs text-[hsl(var(--foreground-muted))]">
                  {stats.levelProgress}% complete
                </p>
              </div>
            </div>
          </Card>

          {/* Your Companions */}
          <Card>
            <CardHeader
              title="Your Companions"
              description="AI tutors you've created"
              action={
                companions.length > 0 ? (
                  <Link
                    href="/companions"
                    className="text-sm text-[hsl(var(--primary))] hover:underline inline-flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : null
              }
            />
            <CompanionGrid companions={companions.slice(0, 4)} />
          </Card>

          {/* Achievements Preview */}
          <Card>
            <CardHeader
              title="Recent Achievements"
              description="Badges you've earned"
            />
            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--background-secondary))]"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-[hsl(var(--foreground-muted))] truncate">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-[hsl(var(--foreground-muted))]" />
                </div>
                <p className="text-sm text-[hsl(var(--foreground-muted))]">
                  Complete sessions to earn achievements
                </p>
              </div>
            )}
          </Card>

          {/* Pro Tip */}
          <Card className="bg-[hsl(var(--primary)/0.05)] border-[hsl(var(--primary)/0.2)]">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Pro Tip
                </h4>
                <p className="text-xs text-[hsl(var(--foreground-muted))] mt-1 leading-relaxed">
                  Maintain your streak by completing at least one learning session
                  daily. Consistency is key to mastering new skills!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Loading fallback
function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-48" />
        </div>
        <div className="skeleton h-10 w-32 rounded-lg" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="skeleton h-6 w-32 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          </Card>
          <Card>
            <div className="skeleton h-6 w-40 mb-4" />
            <SessionListSkeleton />
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col items-center py-8">
              <div className="skeleton w-[140px] h-[140px] rounded-full" />
              <div className="skeleton h-4 w-32 mt-4" />
            </div>
          </Card>
          <Card>
            <div className="skeleton h-6 w-32 mb-4" />
            <CompanionGridSkeleton />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
