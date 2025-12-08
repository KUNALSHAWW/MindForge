"use client";

import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Brain, 
  Target, 
  Shield, 
  Mic,
  BookOpen,
  TrendingUp,
  Users,
  Star,
  Play,
  ChevronRight,
  Globe,
  Cpu,
  Headphones
} from "lucide-react";
import Link from "next/link";
import { AnimatedBackground, FloatingParticles } from "@/components/ui/animated-background";

// Animated counter component
function AnimatedNumber({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <span className="tabular-nums">{value}{suffix}</span>
  );
}

// Feature card with hover effects
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient,
  delay = 0 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <div 
      className="group relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-0.5 ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`} />
      
      <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 hover:transform hover:-translate-y-2">
        {/* Icon container with gradient background */}
        <div className={`w-14 h-14 ${gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
          {title}
        </h3>
        
        <p className="text-white/60 leading-relaxed group-hover:text-white/70 transition-colors">
          {description}
        </p>

        {/* Arrow that appears on hover */}
        <div className="mt-6 flex items-center gap-2 text-white/40 group-hover:text-white/70 transition-all">
          <span className="text-sm font-medium">Learn more</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

// Testimonial card
function TestimonialCard({ 
  quote, 
  author, 
  role, 
  avatar,
  rating = 5 
}: { 
  quote: string; 
  author: string; 
  role: string;
  avatar: string;
  rating?: number;
}) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-all duration-500" />
      <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        
        <p className="text-white/80 text-lg leading-relaxed mb-6 italic">
          &ldquo;{quote}&rdquo;
        </p>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
            {avatar}
          </div>
          <div>
            <p className="text-white font-semibold">{author}</p>
            <p className="text-white/50 text-sm">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step card for "How it works"
function StepCard({ 
  number, 
  title, 
  description,
  icon: Icon
}: { 
  number: string; 
  title: string; 
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="relative group">
      {/* Connecting line */}
      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-violet-500/50 to-transparent -z-10" />
      
      <div className="text-center">
        {/* Number badge */}
        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">
            {number}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/60 leading-relaxed max-w-xs mx-auto">{description}</p>
      </div>
    </div>
  );
}

// Stats component
function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-4 group-hover:bg-white/10 transition-colors">
        <Icon className="w-6 h-6 text-violet-400" />
      </div>
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-white/50 text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                MindForge
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-white/60 hover:text-white transition-colors text-sm font-medium">How it Works</a>
              <a href="#testimonials" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Testimonials</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <SignedOut>
                <Link href="/sign-in" className="text-white/70 hover:text-white transition-colors text-sm font-medium hidden sm:block">
                  Sign In
                </Link>
                <SignUpButton>
                  <button className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-white text-sm font-semibold">
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-white text-sm font-semibold">
                      Dashboard
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        <FloatingParticles />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className="text-sm text-white/70">Introducing MindForge 2.0</span>
              <ChevronRight className="w-4 h-4 text-white/50" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-slide-up">
              <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
                Learn Anything
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                With Your Voice
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              Experience the future of education with AI-powered voice tutors, 
              intelligent knowledge retrieval, and personalized learning paths 
              that adapt to how you learn best.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <SignedOut>
                <SignUpButton>
                  <button className="group relative w-full sm:w-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300" />
                    <span className="relative flex items-center justify-center gap-3 w-full px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white font-semibold text-lg hover:shadow-2xl transition-all">
                      <Sparkles className="w-5 h-5" />
                      Start Learning Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="group relative w-full sm:w-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300" />
                  <span className="relative flex items-center justify-center gap-3 w-full px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white font-semibold text-lg hover:shadow-2xl transition-all">
                    <Sparkles className="w-5 h-5" />
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </SignedIn>
              
              <button className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-semibold transition-all w-full sm:w-auto justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-in" style={{ animationDelay: '600ms' }}>
              {/* Glow behind the card */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-indigo-600/20 rounded-3xl blur-3xl" />
              
              {/* Main card */}
              <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                {/* Voice interaction visualization */}
                <div className="flex flex-col items-center">
                  {/* AI Avatar */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full blur-2xl opacity-50 animate-pulse-slow" />
                    <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Brain className="w-16 h-16 md:w-20 md:h-20 text-white" />
                    </div>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-violet-500/50 animate-ping-slow" />
                    <div className="absolute inset-0 rounded-full border border-violet-400/30 scale-125 animate-ping-slower" />
                  </div>

                  {/* Sound wave visualization */}
                  <div className="flex items-end justify-center gap-1 h-16 mb-8">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full animate-soundwave"
                        style={{
                          height: `${20 + Math.random() * 40}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Chat preview */}
                  <div className="w-full max-w-lg space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <Mic className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-white/80 text-left">
                        &ldquo;Explain quantum entanglement in simple terms...&rdquo;
                      </div>
                    </div>
                    <div className="flex gap-3 items-start flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30 rounded-2xl rounded-tr-none px-4 py-3 text-white/90 text-left">
                        &ldquo;Imagine two coins that are magically connected. When you flip one and it lands on heads, the other instantly becomes tails, no matter how far apart they are...&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social Proof */}
      <section className="py-16 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-white/40 text-sm mb-8 uppercase tracking-wider">Trusted by learners from</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-50">
            {['Stanford', 'MIT', 'Harvard', 'Google', 'Microsoft', 'OpenAI'].map((name) => (
              <span key={name} className="text-xl md:text-2xl font-bold text-white/60">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCard value="50K+" label="Active Learners" icon={Users} />
            <StatCard value="1M+" label="Sessions Completed" icon={Headphones} />
            <StatCard value="200+" label="Topics Covered" icon={BookOpen} />
            <StatCard value="98%" label="Success Rate" icon={TrendingUp} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300 font-medium">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Everything You Need to
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Master Any Subject
              </span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven learning methods to accelerate your education.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={Mic}
              title="Voice Conversations"
              description="Have natural, flowing conversations with AI tutors that understand context and adapt to your learning pace."
              gradient="bg-gradient-to-br from-violet-600 to-indigo-600"
              delay={0}
            />
            <FeatureCard
              icon={Brain}
              title="Intelligent RAG System"
              description="Upload your own materials and let our AI retrieve the most relevant information to answer your questions."
              gradient="bg-gradient-to-br from-fuchsia-600 to-pink-600"
              delay={100}
            />
            <FeatureCard
              icon={Target}
              title="Personalized Paths"
              description="Get custom learning curricula tailored to your goals, schedule, and preferred learning style."
              gradient="bg-gradient-to-br from-cyan-600 to-blue-600"
              delay={200}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Progress Analytics"
              description="Track your learning journey with beautiful visualizations and actionable insights."
              gradient="bg-gradient-to-br from-emerald-600 to-teal-600"
              delay={300}
            />
            <FeatureCard
              icon={Sparkles}
              title="Gamification & XP"
              description="Stay motivated with achievements, streaks, levels, and rewards as you progress."
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
              delay={400}
            />
            <FeatureCard
              icon={Globe}
              title="Multi-Subject Support"
              description="From STEM to languages, history to economics - learn anything with specialized AI tutors."
              gradient="bg-gradient-to-br from-rose-600 to-red-600"
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300 font-medium">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Start Learning in
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Three Simple Steps
              </span>
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            <StepCard
              number="1"
              icon={BookOpen}
              title="Choose Your Subject"
              description="Select from our wide range of subjects and customize your AI tutor's personality and teaching style."
            />
            <StepCard
              number="2"
              icon={Mic}
              title="Start a Conversation"
              description="Simply speak naturally. Our AI understands context, remembers your progress, and adapts in real-time."
            />
            <StepCard
              number="3"
              icon={TrendingUp}
              title="Track & Improve"
              description="Watch your knowledge grow with detailed analytics, achievements, and personalized recommendations."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 mb-6">
              <Star className="w-4 h-4 text-fuchsia-400" />
              <span className="text-sm text-fuchsia-300 font-medium">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Loved by Learners
              </span>
              <br />
              <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <TestimonialCard
              quote="MindForge completely transformed how I study. The voice conversations feel so natural - it's like having a brilliant tutor available 24/7."
              author="Sarah Chen"
              role="Computer Science Student"
              avatar="SC"
            />
            <TestimonialCard
              quote="I've tried many learning platforms, but nothing comes close. The AI actually understands my questions and explains things at my level."
              author="Marcus Johnson"
              role="Medical Resident"
              avatar="MJ"
            />
            <TestimonialCard
              quote="The gamification keeps me coming back every day. I've maintained a 90-day streak and learned more than in years of traditional study."
              author="Emma Williams"
              role="Language Learner"
              avatar="EW"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-indigo-600/20 rounded-3xl blur-3xl" />
            
            <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  Ready to Forge
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                  Your Knowledge?
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
                Join thousands of learners who are mastering new skills every day with MindForge. Start your journey today - it&apos;s free.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <SignedOut>
                  <SignUpButton>
                    <button className="group relative w-full sm:w-auto">
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300" />
                      <span className="relative flex items-center justify-center gap-3 w-full px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white font-semibold text-lg hover:shadow-2xl transition-all">
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="group relative w-full sm:w-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300" />
                    <span className="relative flex items-center justify-center gap-3 w-full px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white font-semibold text-lg hover:shadow-2xl transition-all">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </SignedIn>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-white/40 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Setup in 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>50K+ active users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Logo */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MindForge</span>
              </Link>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                Forge your knowledge with voice-powered AI tutors. Learn anything, anytime, anywhere.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="text-white/50 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2024 MindForge. All rights reserved.
            </p>
            <p className="text-white/40 text-sm">
              Built with ❤️ by Kunal Shaw
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
