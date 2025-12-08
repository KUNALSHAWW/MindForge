"use client";

import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Brain, 
  Target, 
  Mic,
  BookOpen,
  Users,
  Star,
  Play,
  Globe,
  Cpu,
  Award,
  MessageSquare,
  Wand2,
  BarChart3,
  ChevronDown,
  Shield,
  Github
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Animated Background - SentinelAI Style */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 animate-[gridMove_20s_linear_infinite]"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        {/* Gradient Orbs */}
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.4)_0%,transparent_70%)] blur-[80px] animate-[orbFloat_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.4)_0%,transparent_70%)] blur-[80px] animate-[orbFloat_20s_ease-in-out_infinite_-7s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.3)_0%,transparent_70%)] blur-[80px] animate-[orbFloat_20s_ease-in-out_infinite_-14s]" />
      </div>

      {/* Navigation - Glass Effect */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] py-4 bg-[rgba(26,26,37,0.7)] backdrop-blur-[20px] border-b border-white/[0.1] transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-white no-underline group">
            <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] rounded-xl text-xl shadow-lg shadow-[#6366f1]/30 group-hover:shadow-[#6366f1]/50 transition-shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Mind<span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">Forge</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-2">
            <a href="#features" className="text-[#a1a1aa] no-underline py-2.5 px-[18px] rounded-lg text-sm font-medium hover:text-white hover:bg-white/[0.05] transition-all">
              Features
            </a>
            <a href="#how-it-works" className="text-[#a1a1aa] no-underline py-2.5 px-[18px] rounded-lg text-sm font-medium hover:text-white hover:bg-white/[0.05] transition-all">
              How it Works
            </a>
            <a href="#testimonials" className="text-[#a1a1aa] no-underline py-2.5 px-[18px] rounded-lg text-sm font-medium hover:text-white hover:bg-white/[0.05] transition-all">
              Testimonials
            </a>
            <a 
              href="https://github.com/KUNALSHAWW/MindForge" 
              target="_blank" 
              className="text-[#a1a1aa] no-underline py-2.5 px-[18px] rounded-lg text-sm font-medium bg-white/[0.05] border border-white/[0.1] hover:text-white hover:border-[#6366f1] hover:bg-[rgba(99,102,241,0.1)] transition-all flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="text-[#a1a1aa] hover:text-white transition-colors text-sm font-medium">
                Sign In
              </Link>
              <SignUpButton>
                <button className="inline-flex items-center gap-2.5 py-4 px-8 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white rounded-xl text-[15px] font-semibold cursor-pointer border-none shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] transition-all">
                  Get Started Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="inline-flex items-center gap-2.5 py-4 px-8 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white rounded-xl text-[15px] font-semibold cursor-pointer border-none shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] transition-all">
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center py-[120px] px-6 max-w-[1280px] mx-auto gap-[60px]">
        <div className="flex-1 max-w-[640px]">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2.5 py-2.5 px-5 rounded-[50px] bg-[rgba(26,26,37,0.7)] backdrop-blur-[20px] border border-white/[0.1] text-[13px] font-semibold text-[#6366f1] mb-7 hover:bg-white/[0.05] transition-colors cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-[pulse_2s_ease-in-out_infinite]" />
            <span>Introducing MindForge 2.0</span>
            <ArrowRight className="w-4 h-4 text-white/50" />
          </div>

          {/* Hero Title */}
          <h1 className="text-[clamp(42px,6vw,72px)] font-extrabold leading-[1.1] tracking-[-2px] mb-7">
            <span className="block">AI-Powered</span>
            <span className="block bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">Voice Learning</span>
            <span className="block">Intelligence</span>
          </h1>

          {/* Hero Description */}
          <p className="text-lg text-[#a1a1aa] leading-[1.7] mb-10 max-w-[580px]">
            Transform your learning experience with advanced AI tutors using voice conversations, 
            personalized learning paths, and real-time adaptive feedback to master any subject.
          </p>

          {/* Hero Buttons */}
          <div className="flex gap-4 flex-wrap mb-[60px]">
            <SignedOut>
              <SignUpButton>
                <button className="inline-flex items-center gap-2.5 py-4 px-8 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white rounded-xl text-[15px] font-semibold cursor-pointer border-none shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] transition-all">
                  <Play className="w-4 h-4" />
                  Start Learning Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="inline-flex items-center gap-2.5 py-4 px-8 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white rounded-xl text-[15px] font-semibold cursor-pointer border-none shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] transition-all">
                  <Play className="w-4 h-4" />
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>
            <button className="inline-flex items-center gap-2.5 py-4 px-8 bg-white/[0.05] text-white rounded-xl text-[15px] font-semibold cursor-pointer border border-white/[0.1] hover:bg-white/[0.1] hover:border-[#6366f1] transition-all">
              <BookOpen className="w-4 h-4" />
              View Documentation
            </button>
          </div>

          {/* Hero Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <span className="block text-4xl font-extrabold text-white leading-none">50K+</span>
              <span className="block text-[13px] text-[#71717a] mt-2 uppercase tracking-[1px]">Active Learners</span>
            </div>
            <div className="w-[1px] h-10 bg-white/[0.1]" />
            <div className="text-center">
              <span className="block text-4xl font-extrabold text-white leading-none">98<span className="text-2xl font-bold">%</span></span>
              <span className="block text-[13px] text-[#71717a] mt-2 uppercase tracking-[1px]">Success Rate</span>
            </div>
            <div className="w-[1px] h-10 bg-white/[0.1]" />
            <div className="text-center">
              <span className="block text-4xl font-extrabold text-white leading-none">&lt;2s</span>
              <span className="block text-[13px] text-[#71717a] mt-2 uppercase tracking-[1px]">Response Time</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-[400px] h-[400px]">
            {/* Neural Network Canvas Placeholder */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6366f1]/20 via-[#8b5cf6]/10 to-[#a855f7]/20 blur-[60px]" />
            
            {/* Center Shield */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center text-5xl text-white shadow-[0_0_40px_rgba(99,102,241,0.4)] animate-[shieldPulse_3s_ease-in-out_infinite]">
              <Brain className="w-14 h-14" />
            </div>

            {/* Orbiting Items */}
            {[
              { icon: Mic, angle: 0, color: '#6366f1' },
              { icon: BookOpen, angle: 60, color: '#8b5cf6' },
              { icon: Target, angle: 120, color: '#a855f7' },
              { icon: Zap, angle: 180, color: '#10b981' },
              { icon: Star, angle: 240, color: '#f59e0b' },
              { icon: Globe, angle: 300, color: '#06b6d4' },
            ].map((item, index) => (
              <div
                key={index}
                className="absolute w-12 h-12 bg-[rgba(26,26,37,0.8)] backdrop-blur-[10px] border border-white/[0.1] rounded-xl flex items-center justify-center"
                style={{
                  top: `calc(50% + ${Math.sin(item.angle * Math.PI / 180) * 150}px - 24px)`,
                  left: `calc(50% + ${Math.cos(item.angle * Math.PI / 180) * 150}px - 24px)`,
                }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-[700px] mx-auto mb-[60px]">
            <span className="inline-block py-2 px-4 bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.3)] rounded-[50px] text-xs font-semibold text-[#6366f1] uppercase tracking-[1.5px] mb-5">
              Capabilities
            </span>
            <h2 className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-1px] mb-5">
              Intelligent Learning <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">Agents</span>
            </h2>
            <p className="text-[17px] text-[#a1a1aa] leading-[1.7]">
              Multiple specialized AI agents work together using advanced reasoning patterns 
              to provide comprehensive learning experiences.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: Mic, title: 'Voice Conversations', desc: 'Natural voice interactions with AI tutors that understand context', tag: 'Real-time', color: '#3b82f6' },
              { icon: Brain, title: 'RAG System', desc: 'Upload materials and get AI-powered contextual answers', tag: 'AI-Powered', color: '#8b5cf6' },
              { icon: Target, title: 'Personalized Paths', desc: 'Custom learning curricula tailored to your goals', tag: 'Adaptive', color: '#10b981' },
              { icon: BarChart3, title: 'Progress Analytics', desc: 'Beautiful visualizations and actionable insights', tag: 'Real-time', color: '#ec4899' },
              { icon: Wand2, title: 'Gamification', desc: 'Achievements, streaks, levels, and rewards', tag: 'Engaging', color: '#f59e0b' },
              { icon: Globe, title: 'Multi-Subject', desc: 'From STEM to languages with specialized tutors', tag: '200+ Topics', color: '#06b6d4' },
              { icon: MessageSquare, title: 'Chat History', desc: 'Access all your conversations and learning sessions', tag: 'Unlimited', color: '#6366f1' },
              { icon: Award, title: 'Certifications', desc: 'Earn certificates for completed learning paths', tag: 'Verified', color: '#ef4444' },
            ].map((feature) => (
              <div 
                key={feature.title}
                className="group bg-[rgba(26,26,37,0.8)] border border-white/[0.1] rounded-[20px] p-8 transition-all duration-300 relative overflow-hidden hover:translate-y-[-8px] hover:border-[#6366f1] hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]"
              >
                {/* Top Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ backgroundColor: `${feature.color}26`, color: feature.color }}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed mb-4">{feature.desc}</p>
                <span className="inline-block py-1.5 px-3 bg-white/[0.05] rounded-[50px] text-[11px] font-semibold text-[#71717a] uppercase tracking-[0.5px]">
                  {feature.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-[120px] bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-[700px] mx-auto mb-[60px]">
            <span className="inline-block py-2 px-4 bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.3)] rounded-[50px] text-xs font-semibold text-[#6366f1] uppercase tracking-[1.5px] mb-5">
              Under the Hood
            </span>
            <h2 className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-1px] mb-5">
              System <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">Architecture</span>
            </h2>
            <p className="text-[17px] text-[#a1a1aa] leading-[1.7]">
              Built on cutting-edge technologies for enterprise-grade performance and reliability.
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="max-w-[900px] mx-auto">
            {/* Layer 1 - Interface */}
            <div className="bg-[rgba(26,26,37,0.8)] border border-white/[0.1] rounded-[20px] p-7">
              <div className="text-sm font-bold uppercase tracking-[1px] text-[#71717a] mb-5 text-center">
                User Interface Layer
              </div>
              <div className="flex justify-center gap-5 flex-wrap">
                <div className="flex items-center gap-2.5 py-3 px-5 bg-black/30 rounded-lg text-sm font-medium">
                  <Mic className="w-4 h-4 text-[#6366f1]" /> Voice Input
                </div>
                <div className="flex items-center gap-2.5 py-3 px-5 bg-black/30 rounded-lg text-sm font-medium">
                  <MessageSquare className="w-4 h-4 text-[#6366f1]" /> Chat Interface
                </div>
                <div className="flex items-center gap-2.5 py-3 px-5 bg-black/30 rounded-lg text-sm font-medium">
                  <BarChart3 className="w-4 h-4 text-[#6366f1]" /> Analytics Dashboard
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center py-4">
              <div className="w-[2px] h-[30px] bg-white/[0.1]" />
              <ChevronDown className="w-5 h-5 text-[#6366f1] mt-2" />
            </div>

            {/* Layer 2 - AI Orchestrator */}
            <div className="bg-[rgba(26,26,37,0.8)] border border-white/[0.1] rounded-[20px] p-7">
              <div className="text-sm font-bold uppercase tracking-[1px] text-[#71717a] mb-5 text-center">
                AI Orchestration Layer
              </div>
              <div className="flex justify-center gap-5 flex-wrap">
                <div className="flex items-center gap-2.5 py-3 px-5 bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.3)] rounded-lg text-sm font-medium">
                  <Brain className="w-4 h-4 text-[#6366f1]" /> LLM Processing
                </div>
                <div className="flex items-center gap-2.5 py-3 px-5 bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.3)] rounded-lg text-sm font-medium">
                  <Cpu className="w-4 h-4 text-[#6366f1]" /> RAG Engine
                </div>
                <div className="flex items-center gap-2.5 py-3 px-5 bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.3)] rounded-lg text-sm font-medium">
                  <Target className="w-4 h-4 text-[#6366f1]" /> Adaptive Learning
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center py-4">
              <div className="w-[2px] h-[30px] bg-white/[0.1]" />
              <ChevronDown className="w-5 h-5 text-[#6366f1] mt-2" />
            </div>

            {/* Layer 3 - Agents */}
            <div className="bg-[rgba(26,26,37,0.8)] border border-white/[0.1] rounded-[20px] p-7">
              <div className="text-sm font-bold uppercase tracking-[1px] text-[#71717a] mb-5 text-center">
                Specialized AI Agents
              </div>
              <div className="flex justify-center gap-3 flex-wrap">
                {[
                  { icon: Mic, label: 'Voice' },
                  { icon: BookOpen, label: 'Content' },
                  { icon: Target, label: 'Goals' },
                  { icon: BarChart3, label: 'Analytics' },
                  { icon: Wand2, label: 'Gamify' },
                  { icon: Globe, label: 'Language' },
                  { icon: Award, label: 'Assess' },
                  { icon: Users, label: 'Social' },
                ].map((agent) => (
                  <div key={agent.label} className="flex items-center gap-2 py-2.5 px-4 bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] rounded-[50px] text-[13px] font-medium">
                    <agent.icon className="w-3.5 h-3.5 text-[#6366f1]" />
                    {agent.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center py-4">
              <div className="w-[2px] h-[30px] bg-white/[0.1]" />
              <ChevronDown className="w-5 h-5 text-[#6366f1] mt-2" />
            </div>

            {/* Layer 4 - Infrastructure */}
            <div className="bg-[rgba(26,26,37,0.8)] border border-white/[0.1] rounded-[20px] p-7">
              <div className="text-sm font-bold uppercase tracking-[1px] text-[#71717a] mb-5 text-center">
                Infrastructure
              </div>
              <div className="flex justify-center gap-5 flex-wrap">
                <div className="flex items-center gap-2.5 py-3 px-5 bg-black/30 rounded-lg text-sm font-medium">
                  <Shield className="w-4 h-4 text-[#6366f1]" /> Supabase
                </div>
                <div className="flex items-center gap-2.5 py-3 px-5 bg-black/30 rounded-lg text-sm font-medium">
                  <Zap className="w-4 h-4 text-[#6366f1]" /> Vercel Edge
                </div>
                <div className="flex items-center gap-2.5 py-3 px-5 bg-black/30 rounded-lg text-sm font-medium">
                  <Brain className="w-4 h-4 text-[#6366f1]" /> OpenAI API
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-[#12121a]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block py-2 px-4 bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.3)] rounded-[50px] text-xs font-semibold text-[#6366f1] uppercase tracking-[1.5px] mb-5">
              Technology
            </span>
            <h2 className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-1px]">
              Built With <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">Modern Stack</span>
            </h2>
          </div>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { name: 'Next.js 15', icon: '⚡' },
              { name: 'TypeScript', icon: '📘' },
              { name: 'Tailwind CSS', icon: '🎨' },
              { name: 'Prisma', icon: '💎' },
              { name: 'Supabase', icon: '🔥' },
              { name: 'OpenAI', icon: '🤖' },
            ].map((tech) => (
              <div key={tech.name} className="flex flex-col items-center gap-3 py-6 px-8 bg-[rgba(26,26,37,0.8)] border border-white/[0.1] rounded-xl hover:translate-y-[-4px] hover:border-[#6366f1] transition-all">
                <span className="text-5xl">{tech.icon}</span>
                <span className="text-sm font-semibold text-[#a1a1aa]">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-[700px] mx-auto mb-[60px]">
            <span className="inline-block py-2 px-4 bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.3)] rounded-[50px] text-xs font-semibold text-[#6366f1] uppercase tracking-[1.5px] mb-5">
              Testimonials
            </span>
            <h2 className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-1px] mb-5">
              Loved by Learners <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">Worldwide</span>
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                quote: 'MindForge completely transformed how I study. The voice conversations feel so natural - it\'s like having a brilliant tutor available 24/7.',
                author: 'Sarah Chen',
                role: 'Computer Science, Stanford',
                avatar: 'SC',
              },
              {
                quote: 'I\'ve tried many learning platforms, but nothing comes close. The AI actually understands my questions and explains at exactly my level.',
                author: 'Marcus Johnson',
                role: 'Medical Resident, Johns Hopkins',
                avatar: 'MJ',
              },
              {
                quote: 'The gamification keeps me coming back every day. I\'ve maintained a 90-day streak and learned more than in years of traditional study.',
                author: 'Emma Williams',
                role: 'Language Learner, UK',
                avatar: 'EW',
              },
            ].map((testimonial) => (
              <div 
                key={testimonial.author}
                className="p-8 bg-[rgba(26,26,37,0.8)] border border-white/[0.1] rounded-[20px] hover:border-[#6366f1] transition-all"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-[#a1a1aa] text-[15px] leading-relaxed mb-6">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-[#71717a]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-[800px] mx-auto text-center p-[60px] bg-[rgba(26,26,37,0.7)] backdrop-blur-[20px] border border-white/[0.1] rounded-[28px]">
          <h2 className="text-[32px] font-extrabold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-[17px] text-[#a1a1aa] mb-8">
            Join thousands of learners who are mastering new skills every day with MindForge.
          </p>
          <div className="flex justify-center gap-4">
            <SignedOut>
              <SignUpButton>
                <button className="inline-flex items-center gap-2.5 py-4 px-8 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white rounded-xl text-[15px] font-semibold cursor-pointer border-none shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] transition-all">
                  <Github className="w-4 h-4" />
                  Get Started Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="inline-flex items-center gap-2.5 py-4 px-8 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white rounded-xl text-[15px] font-semibold cursor-pointer border-none shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] transition-all">
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>
            <a 
              href="https://github.com/KUNALSHAWW/MindForge" 
              target="_blank"
              className="inline-flex items-center gap-2.5 py-4 px-8 bg-white/[0.05] text-white rounded-xl text-[15px] font-semibold cursor-pointer border border-white/[0.1] hover:bg-white/[0.1] hover:border-[#6366f1] transition-all no-underline"
            >
              <Sparkles className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#12121a] border-t border-white/[0.1] py-[60px] px-6">
        <div className="max-w-[1280px] mx-auto flex justify-between gap-[60px] mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 text-2xl font-bold text-white mb-3">
              <Sparkles className="w-5 h-5 text-[#6366f1]" />
              <span>MindForge</span>
            </div>
            <p className="text-[#71717a] text-sm">AI-Powered Voice Learning Platform</p>
          </div>

          {/* Links */}
          <div className="flex gap-[60px]">
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-[1px] text-[#71717a] mb-4">Product</h4>
              <a href="#features" className="block text-[#a1a1aa] no-underline text-sm mb-2.5 hover:text-[#6366f1] transition-colors">Features</a>
              <a href="#how-it-works" className="block text-[#a1a1aa] no-underline text-sm mb-2.5 hover:text-[#6366f1] transition-colors">How it Works</a>
              <a href="#testimonials" className="block text-[#a1a1aa] no-underline text-sm mb-2.5 hover:text-[#6366f1] transition-colors">Testimonials</a>
            </div>
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-[1px] text-[#71717a] mb-4">Developer</h4>
              <a href="https://github.com/KUNALSHAWW/MindForge" target="_blank" className="block text-[#a1a1aa] no-underline text-sm mb-2.5 hover:text-[#6366f1] transition-colors">GitHub</a>
              <a href="#" className="block text-[#a1a1aa] no-underline text-sm mb-2.5 hover:text-[#6366f1] transition-colors">Documentation</a>
            </div>
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-[1px] text-[#71717a] mb-4">Connect</h4>
              <a href="https://github.com/KUNALSHAWW" target="_blank" className="flex items-center gap-2 text-[#a1a1aa] no-underline text-sm mb-2.5 hover:text-[#6366f1] transition-colors">
                <Github className="w-4 h-4" /> @KUNALSHAWW
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="max-w-[1280px] mx-auto pt-[30px] border-t border-white/[0.1] text-center">
          <p className="text-[#71717a] text-sm">© 2025 Kunal Shaw. Built with ❤️ for learners worldwide.</p>
        </div>
      </footer>
    </main>
  );
}
