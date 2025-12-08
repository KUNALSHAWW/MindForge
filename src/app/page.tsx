import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Sparkles,
  Mic,
  Target,
  BarChart3,
  Users,
  Star,
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
                href="#testimonials"
                className="px-4 py-2 text-sm text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                Testimonials
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
                Now in Public Beta
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[hsl(var(--foreground))] tracking-tight leading-[1.1] mb-6">
              Learn anything with{" "}
              <span className="text-[hsl(var(--primary))]">AI-powered</span>{" "}
              voice companions
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[hsl(var(--foreground-muted))] mb-10 max-w-2xl mx-auto leading-relaxed">
              MindForge transforms learning through natural voice conversations,
              personalized AI tutors, and adaptive feedback—making mastery
              accessible to everyone.
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

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-[hsl(var(--foreground-muted))]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["S", "M", "E", "J"].map((initial, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-[hsl(var(--muted))] border-2 border-[hsl(var(--background))] flex items-center justify-center text-xs font-medium text-[hsl(var(--foreground-muted))]"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <span>5,000+ learners</span>
              </div>
              <div className="h-4 w-px bg-[hsl(var(--border))]" />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-1">4.9 rating</span>
              </div>
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
              Everything you need to learn effectively
            </h2>
            <p className="text-[hsl(var(--foreground-muted))]">
              Powerful features designed to accelerate your learning journey and
              keep you motivated every step of the way.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Mic,
                title: "Voice Conversations",
                description:
                  "Natural voice interactions with AI tutors that understand context and adapt to your learning pace.",
                color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
              },
              {
                icon: Brain,
                title: "RAG-Enhanced Learning",
                description:
                  "Upload your materials and get AI-powered answers with context from your own documents.",
                color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
              },
              {
                icon: Target,
                title: "Personalized Paths",
                description:
                  "Custom learning curricula tailored to your goals, schedule, and current skill level.",
                color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
              },
              {
                icon: BarChart3,
                title: "Progress Analytics",
                description:
                  "Beautiful visualizations and actionable insights to track your growth over time.",
                color: "bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400",
              },
              {
                icon: Award,
                title: "Gamification",
                description:
                  "Earn XP, maintain streaks, unlock achievements, and level up as you learn.",
                color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
              },
              {
                icon: Users,
                title: "200+ Subjects",
                description:
                  "From STEM to languages, arts to business—specialized AI tutors for every topic.",
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
              Start learning in three simple steps
            </h2>
            <p className="text-[hsl(var(--foreground-muted))]">
              Get started in minutes and begin your personalized learning
              journey today.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Companion",
                description:
                  "Choose a subject, set your learning goals, and customize your AI tutor's teaching style.",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "Start Learning",
                description:
                  "Engage in natural voice conversations, ask questions, and get instant feedback.",
                icon: Mic,
              },
              {
                step: "03",
                title: "Track Progress",
                description:
                  "Monitor your growth with detailed analytics, earn achievements, and stay motivated.",
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[hsl(var(--background-secondary))]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-[hsl(var(--primary))] uppercase tracking-wider mb-3 block">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[hsl(var(--foreground))] tracking-tight mb-4">
              Loved by learners worldwide
            </h2>
            <p className="text-[hsl(var(--foreground-muted))]">
              See what our community has to say about their learning experience.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "MindForge completely transformed how I study. The voice conversations feel so natural—it's like having a brilliant tutor available 24/7.",
                author: "Sarah Chen",
                role: "Computer Science, Stanford",
                initials: "SC",
              },
              {
                quote:
                  "I've tried many learning platforms, but nothing comes close. The AI actually understands my questions and explains at exactly my level.",
                author: "Marcus Johnson",
                role: "Medical Resident, Johns Hopkins",
                initials: "MJ",
              },
              {
                quote:
                  "The gamification keeps me coming back every day. I've maintained a 90-day streak and learned more than in years of traditional study.",
                author: "Emma Williams",
                role: "Language Learner, UK",
                initials: "EW",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[hsl(var(--foreground-muted))] text-sm leading-relaxed mb-6">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white text-sm font-medium">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-[hsl(var(--foreground-muted))]">
                      {testimonial.role}
                    </p>
                  </div>
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
              Join thousands of learners who are mastering new skills every day
              with MindForge. Start for free, no credit card required.
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
