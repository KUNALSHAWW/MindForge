import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Sparkles,
  Mic,
  Target,
  BarChart3,
  CheckCircle,
  Play,
  Github,
  Zap,
  Brain,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[hsl(var(--background))/0.8] backdrop-blur-md border-b border-[hsl(var(--border))]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-[hsl(var(--foreground))]">
                MindForge
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <a
                href="#features"
                className="px-4 py-2 text-sm text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-2 text-sm text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                How it Works
              </a>
              <a
                href="https://github.com/KUNALSHAWW/MindForge"
                target="_blank"
                className="px-4 py-2 text-sm text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  Sign In
                </Link>
                <SignUpButton>
                  <button className="px-4 py-2 text-sm font-medium bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-colors">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-colors"
                >
                  Dashboard
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)]">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              <span className="text-sm font-medium text-[hsl(var(--primary))]">
                Open source · Next.js 16 · FSRS-4.5
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[hsl(var(--foreground))] tracking-tight leading-[1.1] mb-6">
              AI tutors that make{" "}
              <span className="text-[hsl(var(--primary))]">every session stick</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[hsl(var(--foreground-muted))] mb-10 max-w-2xl mx-auto leading-relaxed">
              Talk or type with a tutor that teaches in your preferred style and cites your own notes.
              When the session ends, its key ideas become flashcards that come back right before you
              would forget them.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <SignedOut>
                <SignUpButton>
                  <button className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-all shadow-lg shadow-[hsl(var(--primary)/0.25)]">
                    <Play className="w-4 h-4" />
                    Start Learning Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-all shadow-lg shadow-[hsl(var(--primary)/0.25)]"
                >
                  <Play className="w-4 h-4" />
                  Go to Dashboard
                </Link>
              </SignedIn>
              <a
                href="https://github.com/KUNALSHAWW/MindForge"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-[hsl(var(--foreground))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--background-secondary))] hover:border-[hsl(var(--border-hover))] transition-all"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>

            {/* What is inside */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[hsl(var(--foreground-muted))]">
              {["Streaming LLM tutors", "Cited answers from your notes", "Spaced repetition", "Voice mode", "Demo mode without setup"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[hsl(var(--background-secondary))]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-[hsl(var(--primary))] uppercase tracking-wider mb-3 block">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[hsl(var(--foreground))] tracking-tight mb-4">
              Built on how memory actually works
            </h2>
            <p className="text-[hsl(var(--foreground-muted))]">
              Retrieval practice, spacing and grounded explanations are among the most reliable findings in
              learning science. MindForge puts all three in one loop.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Mic,
                title: "Voice Conversations",
                description:
                  "Hands-free sessions in the browser: speak your question, hear the answer in your tutor's voice, and keep the conversation going.",
                color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
              },
              {
                icon: Brain,
                title: "Answers From Your Notes",
                description:
                  "Upload notes and the tutor retrieves the most relevant passages with hybrid BM25 and embedding search, citing them as [1], [2].",
                color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
              },
              {
                icon: Target,
                title: "Four Teaching Styles",
                description:
                  "Socratic tutors guide you with questions instead of handing over answers. Formal, casual and storytelling styles are one click away.",
                color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
              },
              {
                icon: BarChart3,
                title: "Memory-Aware Analytics",
                description:
                  "An activity heatmap, weekly trends and a per-subject recall forecast computed from the FSRS forgetting curve.",
                color: "bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400",
              },
              {
                icon: Award,
                title: "Gamification",
                description:
                  "XP with streak bonuses, levels and 30 achievements across sessions, streaks, study time and flashcard reviews.",
                color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
              },
              {
                icon: Target,
                title: "Spaced Repetition",
                description:
                  "Each session is summarised into flashcards scheduled with FSRS-4.5, the algorithm Anki adopted, so reviews land when they matter.",
                color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl hover:border-[hsl(var(--border-hover))] hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[hsl(var(--foreground-muted))] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-[hsl(var(--primary))] uppercase tracking-wider mb-3 block">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[hsl(var(--foreground))] tracking-tight mb-4">
              One loop: learn, recall, remember
            </h2>
            <p className="text-[hsl(var(--foreground-muted))]">
              Every step feeds the next, and the tutor knows which ideas you are about to forget.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Learn With a Tutor",
                description:
                  "Pick or design a companion, then talk or type. Answers stream in and cite your uploaded notes.",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "Recall What Matters",
                description:
                  "Ending a session turns its key ideas into flashcards. Review them when FSRS predicts your recall is dropping.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Watch Memory Grow",
                description:
                  "Track streaks, XP and per-subject retention. Fading cards are woven back into your next tutor session.",
                icon: BarChart3,
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-[hsl(var(--border))] -translate-x-1/2 z-0" />
                )}

                <div className="relative z-10">
                  {/* Step Number */}
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center text-lg font-semibold mb-5">
                    {item.step}
                  </div>

                  <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[hsl(var(--foreground-muted))] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="p-10 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--foreground))] mb-4">
              Ready to transform your learning?
            </h2>
            <p className="text-[hsl(var(--foreground-muted))] mb-8 max-w-lg mx-auto">
              Free and open source. Sign in, start a session and see your first flashcards in a few minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignedOut>
                <SignUpButton>
                  <button className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-colors">
                    <Zap className="w-4 h-4" />
                    Get Started Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Go to Dashboard
                </Link>
              </SignedIn>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[hsl(var(--foreground-muted))]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />
                Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-[hsl(var(--foreground))]">
                MindForge
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-[hsl(var(--foreground-muted))]">
              <a
                href="#features"
                className="hover:text-[hsl(var(--foreground))] transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-[hsl(var(--foreground))] transition-colors"
              >
                How it Works
              </a>
              <a
                href="https://github.com/KUNALSHAWW/MindForge"
                target="_blank"
                className="hover:text-[hsl(var(--foreground))] transition-colors"
              >
                GitHub
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-[hsl(var(--foreground-muted))]">
              © 2025 Kunal Shaw. Built with ❤️ for learners.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
