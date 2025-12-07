import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Sparkles, Zap, Brain, Target, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-wrapper">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-gradient font-display text-2xl font-bold">
              MindForge
            </span>
          </Link>
          <div className="navbar-actions">
            <SignedOut>
              <SignUpButton>
                <button className="btn btn-primary">Get Started</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="btn btn-primary">Dashboard</button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-32">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="section-badge mx-auto mb-6">
              <Zap className="w-4 h-4" />
              <span>The Future of Learning is Here</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-gradient font-display mb-6 text-5xl md:text-7xl font-bold leading-tight">
              Forge Your Knowledge with Voice
            </h1>

            {/* Subheading */}
            <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience personalized learning with AI tutors. Voice conversations, intelligent knowledge retrieval, and immersive interactions designed to help you master any subject.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <SignedOut>
                <SignUpButton>
                  <button className="btn btn-primary btn-lg">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="btn btn-primary btn-lg">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </SignedIn>
              <button className="btn btn-secondary btn-lg">
                Watch Demo
              </button>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="floating-card bg-gradient-to-br from-primary/10 to-secondary/10 aspect-video rounded-2xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-24 h-24 text-primary/60 mx-auto mb-4 animate-float" />
                    <p className="text-foreground-muted">Your intelligent learning companion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-background-secondary/50">
        <div className="container-custom">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="font-display text-4xl font-bold mb-4">
              Everything you need to learn effectively
            </h2>
            <p className="text-foreground-muted text-lg">
              Comprehensive tools and features designed for modern learners
            </p>
          </div>

          <div className="grid-features">
            {/* Feature Card 1 */}
            <div className="floating-card p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Voice Conversations
              </h3>
              <p className="text-foreground-muted">
                Real-time voice interactions with AI tutors that adapt to your learning style
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="floating-card p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Intelligent RAG System
              </h3>
              <p className="text-foreground-muted">
                Advanced knowledge retrieval powered by your own documents and resources
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="floating-card p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Progress Analytics
              </h3>
              <p className="text-foreground-muted">
                Beautiful visualizations of your learning journey with detailed insights
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="floating-card p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Personalized Learning Paths
              </h3>
              <p className="text-foreground-muted">
                Custom curricula tailored to your goals and learning pace
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="floating-card p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Gamification & Rewards
              </h3>
              <p className="text-foreground-muted">
                Earn badges, XP, and unlock achievements as you progress
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="floating-card p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Multi-Subject Support
              </h3>
              <p className="text-foreground-muted">
                Learn anything from STEM to languages with specialized tutors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section">
        <div className="container-custom">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 className="font-display text-4xl font-bold mb-4">
              Start learning in 3 simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Choose Your Subject",
                description:
                  "Select from multiple subjects and create a personalized AI tutor",
              },
              {
                step: "02",
                title: "Have a Conversation",
                description:
                  "Engage in natural voice conversations with your AI companion",
              },
              {
                step: "03",
                title: "Track Progress",
                description:
                  "Watch your learning journey unfold with detailed analytics",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-display font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-foreground-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-background-secondary/50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Learners", value: "10K+" },
              { label: "Learning Sessions", value: "50K+" },
              { label: "Topics Covered", value: "100+" },
              { label: "Success Rate", value: "95%" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-custom">
          <div className="cta-section bg-primary rounded-3xl shadow-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to forge your knowledge?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of learners using MindForge to master new skills and advance their education.
            </p>
            <SignedOut>
              <SignUpButton>
                <button className="btn bg-white text-primary hover:bg-gray-100 font-semibold">
                  Get Started Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="btn bg-white text-primary hover:bg-gray-100 font-semibold">
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-lg">MindForge</span>
              </div>
              <p className="text-foreground-muted text-sm">
                Forge your knowledge with voice-powered learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-foreground-muted text-sm">
              © 2024 MindForge. All rights reserved. | Built by Kunal Shaw
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
