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
  TrendingUp,
  Users,
  Star,
  Play,
  Globe,
  Cpu,
  Award,
  Clock,
  CheckCircle2,
  Menu,
  X,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#030014] text-white">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[1000px] h-[1000px] bg-gradient-to-b from-violet-600/20 via-violet-600/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-t from-indigo-600/15 to-transparent rounded-full blur-[100px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030014]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-20 border-b border-white/[0.08]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MindForge</span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-white/60 hover:text-white transition-colors text-sm">Features</a>
              <a href="#how-it-works" className="text-white/60 hover:text-white transition-colors text-sm">How it Works</a>
              <a href="#testimonials" className="text-white/60 hover:text-white transition-colors text-sm">Testimonials</a>
            </div>

            <div className="flex items-center gap-4">
              <SignedOut>
                <Link href="/sign-in" className="hidden sm:block text-white/60 hover:text-white transition-colors text-sm">
                  Sign In
                </Link>
                <SignUpButton>
                  <button className="px-5 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    Dashboard
                  </button>
                </Link>
              </SignedIn>
              
              <button 
                className="md:hidden p-2 text-white/60 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#030014]/95 backdrop-blur-xl border-b border-white/[0.08]">
            <div className="px-6 py-6 space-y-4">
              <a href="#features" className="block text-white/70 hover:text-white py-2">Features</a>
              <a href="#how-it-works" className="block text-white/70 hover:text-white py-2">How it Works</a>
              <a href="#testimonials" className="block text-white/70 hover:text-white py-2">Testimonials</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 lg:pt-52 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] mb-10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-white/70">Introducing MindForge 2.0</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
              <span className="text-white">Learn Anything</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                With Your Voice
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
              AI-powered voice tutors that adapt to your learning style. 
              Have natural conversations and master any subject.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <SignedOut>
                <SignUpButton>
                  <button className="group px-8 py-4 bg-white text-black rounded-xl font-semibold text-base hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                    Start Learning Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="group px-8 py-4 bg-white text-black rounded-xl font-semibold text-base hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </SignedIn>
              <button className="px-8 py-4 bg-white/[0.05] border border-white/[0.1] rounded-xl font-semibold text-base hover:bg-white/[0.08] transition-all flex items-center justify-center gap-3">
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </div>

            {/* Hero Visual */}
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-indigo-500/10 rounded-3xl blur-2xl" />
              
              <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 lg:p-12">
                <div className="flex flex-col items-center">
                  <div className="relative mb-10">
                    <div className="w-28 h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-violet-500/30">
                      <Brain className="w-14 h-14 lg:w-16 lg:h-16 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-violet-400/30 animate-ping" style={{ animationDuration: '2s' }} />
                  </div>

                  <div className="flex items-center justify-center gap-1.5 h-12 mb-10">
                    {[28, 42, 22, 48, 35, 52, 30, 45, 25, 40].map((height, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-violet-500 to-violet-300 rounded-full animate-pulse"
                        style={{
                          height: `${height}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>

                  <div className="w-full max-w-md space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <Mic className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="bg-white/[0.05] rounded-2xl rounded-tl-md px-4 py-3 text-white/80 text-left text-sm">
                        &quot;Explain machine learning in simple terms...&quot;
                      </div>
                    </div>
                    <div className="flex items-start gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl rounded-tr-md px-4 py-3 text-white/90 text-left text-sm">
                        &quot;Think of it like teaching a child. You show examples, and over time, they learn patterns...&quot;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-white/30 text-sm mb-10 uppercase tracking-widest">
            Trusted by learners worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
            {['Stanford', 'MIT', 'Harvard', 'Google', 'Microsoft'].map((name) => (
              <span key={name} className="text-2xl font-semibold text-white/20 hover:text-white/40 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { value: '50K+', label: 'Active Learners', icon: Users },
              { value: '1M+', label: 'Sessions', icon: MessageSquare },
              { value: '200+', label: 'Topics', icon: BookOpen },
              { value: '98%', label: 'Success Rate', icon: Award },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] mb-5">
                  <stat.icon className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Master Any Subject
              </span>
            </h2>
            <p className="text-lg text-white/40">
              Powerful AI tools designed for effective learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-violet-500/30 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6">
                <Mic className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Voice Conversations</h3>
              <p className="text-white/50 leading-relaxed">Have natural conversations with AI tutors that understand context and adapt to your pace.</p>
            </div>

            <div className="group p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-fuchsia-500/30 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Intelligent RAG</h3>
              <p className="text-white/50 leading-relaxed">Upload materials and let AI retrieve relevant information to answer your questions.</p>
            </div>

            <div className="group p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-cyan-500/30 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Personalized Paths</h3>
              <p className="text-white/50 leading-relaxed">Get custom learning curricula tailored to your goals and learning style.</p>
            </div>

            <div className="group p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-emerald-500/30 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Progress Analytics</h3>
              <p className="text-white/50 leading-relaxed">Track your journey with beautiful visualizations and actionable insights.</p>
            </div>

            <div className="group p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-amber-500/30 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Gamification</h3>
              <p className="text-white/50 leading-relaxed">Stay motivated with achievements, streaks, levels, and rewards.</p>
            </div>

            <div className="group p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-rose-500/30 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Subject</h3>
              <p className="text-white/50 leading-relaxed">From STEM to languages - learn anything with specialized AI tutors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300">How It Works</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Start Learning in
              <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Three Simple Steps
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative text-center">
              <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-violet-500/30 to-transparent" />
              <div className="relative inline-flex mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center border border-violet-500/20">
                  <BookOpen className="w-8 h-8 text-violet-400" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center text-sm font-bold">01</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Choose Your Subject</h3>
              <p className="text-white/50 max-w-xs mx-auto">Select from our wide range of subjects and customize your AI tutor.</p>
            </div>

            <div className="relative text-center">
              <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-violet-500/30 to-transparent" />
              <div className="relative inline-flex mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center border border-violet-500/20">
                  <Mic className="w-8 h-8 text-violet-400" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center text-sm font-bold">02</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Start Talking</h3>
              <p className="text-white/50 max-w-xs mx-auto">Simply speak naturally. Our AI understands context and adapts in real-time.</p>
            </div>

            <div className="relative text-center">
              <div className="relative inline-flex mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center border border-violet-500/20">
                  <TrendingUp className="w-8 h-8 text-violet-400" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center text-sm font-bold">03</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Track Progress</h3>
              <p className="text-white/50 max-w-xs mx-auto">Watch your knowledge grow with detailed analytics and recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 mb-6">
              <Star className="w-4 h-4 text-fuchsia-400" />
              <span className="text-sm text-fuchsia-300">Testimonials</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Loved by Learners
              <span className="block bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-colors">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">&quot;MindForge completely transformed how I study. The voice conversations feel so natural.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">SC</div>
                <div>
                  <p className="text-white font-medium text-sm">Sarah Chen</p>
                  <p className="text-white/40 text-sm">CS Student</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-colors">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">&quot;The AI actually understands my questions and explains things at exactly my level.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm">MJ</div>
                <div>
                  <p className="text-white font-medium text-sm">Marcus Johnson</p>
                  <p className="text-white/40 text-sm">Medical Resident</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-colors">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">&quot;I&apos;ve maintained a 90-day streak and learned more than in years of traditional study.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-medium text-sm">EW</div>
                <div>
                  <p className="text-white font-medium text-sm">Emma Williams</p>
                  <p className="text-white/40 text-sm">Language Learner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative p-12 lg:p-20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-indigo-500/10 border border-white/[0.05] rounded-3xl text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start
              <span className="block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Learning?
              </span>
            </h2>
            
            <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
              Join thousands of learners mastering new skills every day with MindForge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <SignedOut>
                <SignUpButton>
                  <button className="group px-10 py-4 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="group px-10 py-4 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </SignedIn>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">MindForge</span>
              </Link>
              <p className="text-white/40 text-sm leading-relaxed">
                AI-powered voice learning platform.
              </p>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Privacy</a></li>
                <li><a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Terms</a></li>
                <li><a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">© 2024 MindForge. All rights reserved.</p>
            <p className="text-white/30 text-sm">Built with ❤️ by Kunal Shaw</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
