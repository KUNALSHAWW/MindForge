import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sparkles, BarChart3, Flame, BookOpen, ArrowRight, TrendingUp, Zap, Trophy, Target } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px]" />
      </div>

      {/* Welcome Section */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span className="text-sm text-violet-300">Learning Dashboard</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
          Welcome back, {user.firstName || "Learner"}! 👋
        </h1>
        <p className="text-white/60 text-lg max-w-2xl">
          Let&apos;s continue your learning journey and forge new knowledge today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Stat Card 1 */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300" />
          <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-sm font-medium">Total Sessions</span>
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">12</div>
            <p className="text-sm text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +2 this week
            </p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300" />
          <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-sm font-medium">Learning Hours</span>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">24.5</div>
            <p className="text-sm text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +4.2 this week
            </p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300" />
          <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-sm font-medium">Current Streak</span>
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">7 🔥</div>
            <p className="text-sm text-white/50">days consistent</p>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300" />
          <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-sm font-medium">Total XP</span>
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-fuchsia-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">3,450</div>
            <p className="text-sm text-fuchsia-400">Level 8</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-indigo-600/20 rounded-2xl blur-xl" />
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-violet-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/companions" className="group">
                  <button className="relative w-full overflow-hidden">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white font-semibold">
                      <Sparkles className="w-5 h-5" />
                      Start New Session
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
                <Link href="/companions" className="group">
                  <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-semibold transition-all">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    Browse Companions
                  </button>
                </Link>
                <Link href="/journey" className="group">
                  <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-semibold transition-all">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    View Analytics
                  </button>
                </Link>
                <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-semibold transition-all">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Achievements
                </button>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-violet-600/10 rounded-2xl blur-xl" />
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                Recent Learning Sessions
              </h2>
              <div className="space-y-4">
                {[
                  { subject: "Physics - Quantum Mechanics", time: "2 days ago", duration: "45 min", xp: 150, color: "violet" },
                  { subject: "Mathematics - Calculus", time: "3 days ago", duration: "60 min", xp: 200, color: "cyan" },
                  { subject: "History - World War II", time: "5 days ago", duration: "30 min", xp: 100, color: "amber" },
                ].map((session, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-${session.color}-500/20 flex items-center justify-center`}>
                        <Target className={`w-6 h-6 text-${session.color}-400`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                          {session.subject}
                        </h3>
                        <p className="text-sm text-white/50">
                          {session.time} • {session.duration}
                        </p>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold border border-emerald-500/20">
                      +{session.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level & XP */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl blur-xl" />
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Level Progress
              </h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-white">Level 8</span>
                  <span className="text-sm text-white/50">3,450 / 5,000 XP</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-1000" 
                    style={{ width: '69%' }}
                  />
                </div>
              </div>
              <p className="text-sm text-white/40">
                1,550 XP until Level 9 ✨
              </p>
            </div>
          </div>

          {/* Achievements */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-2xl blur-xl" />
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Recent Achievements
              </h3>
              <div className="space-y-4">
                {[
                  { icon: "🔥", title: "Week Warrior", desc: "7-day streak", color: "orange" },
                  { icon: "🎯", title: "Focus Master", desc: "60+ min session", color: "violet" },
                  { icon: "⭐", title: "Knowledge Seeker", desc: "5 subjects explored", color: "cyan" },
                ].map((achievement, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{achievement.title}</p>
                      <p className="text-xs text-white/50">{achievement.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                💡 Pro Tip
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Maintain your streak by completing at least one learning session daily. Consistency is key to mastering new skills!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
