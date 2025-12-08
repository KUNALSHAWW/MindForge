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
  CheckCircle2,
  MessageSquare,
  Wand2,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Ambient Background - Desktop Optimized */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-30%] left-[20%] w-[800px] h-[800px] bg-violet-600/15 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[40%] w-[700px] h-[700px] bg-fuchsia-600/10 rounded-full blur-[130px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1400px] px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MindForge</span>
            </Link>

            {/* Center Navigation */}
            <div className="flex items-center gap-12">
              <a href="#features" className="text-white/50 hover:text-white transition-colors text-[15px] font-medium">Features</a>
              <a href="#how-it-works" className="text-white/50 hover:text-white transition-colors text-[15px] font-medium">How it Works</a>
              <a href="#testimonials" className="text-white/50 hover:text-white transition-colors text-[15px] font-medium">Testimonials</a>
              <a href="#pricing" className="text-white/50 hover:text-white transition-colors text-[15px] font-medium">Pricing</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-6">
              <SignedOut>
                <Link href="/sign-in" className="text-white/60 hover:text-white transition-colors text-[15px] font-medium">
                  Sign In
                </Link>
                <SignUpButton>
                  <button className="px-6 py-2.5 bg-white text-black rounded-lg text-[15px] font-semibold hover:bg-white/90 transition-all hover:scale-[1.02]">
                    Get Started Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-[15px] font-semibold hover:opacity-90 transition-all hover:scale-[1.02]">
                    Go to Dashboard
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Desktop Optimized with Split Layout */}
      <section className="relative pt-40 pb-32 min-h-screen flex items-center">
        <div className="mx-auto max-w-[1400px] px-12 w-full">
          <div className="grid grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-colors cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[15px] text-white/70">Introducing MindForge 2.0</span>
                <ArrowRight className="w-4 h-4 text-white/50" />
              </div>

              {/* Headline */}
              <h1 className="text-[72px] font-bold tracking-tight leading-[1.05]">
                <span className="text-white">Learn Anything</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                  With Your Voice
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-white/50 leading-relaxed max-w-xl">
                Experience the future of education with AI-powered voice tutors that adapt to your learning style. Have natural conversations and master any subject.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-5 pt-4">
                <SignedOut>
                  <SignUpButton>
                    <button className="group px-8 py-4 bg-white text-black rounded-xl font-semibold text-[17px] hover:bg-white/90 transition-all hover:scale-[1.02] flex items-center gap-3">
                      Start Learning Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <button className="group px-8 py-4 bg-white text-black rounded-xl font-semibold text-[17px] hover:bg-white/90 transition-all hover:scale-[1.02] flex items-center gap-3">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </SignedIn>
                <button className="px-8 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl font-semibold text-[17px] hover:bg-white/[0.06] transition-all flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-8 pt-8 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-white/50 text-[15px]">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-white/50 text-[15px]">Free forever plan</span>
                </div>
              </div>
            </div>

            {/* Right Visual - AI Interface */}
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/15 to-indigo-500/20 rounded-3xl blur-3xl" />
              
              {/* Main Card */}
              <div className="relative bg-white/[0.02] border border-white/[0.08] rounded-3xl p-10 backdrop-blur-sm">
                {/* AI Avatar */}
                <div className="flex flex-col items-center mb-10">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-violet-500/30">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-violet-400/30 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-[#0a0a0f]">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Sound Wave */}
                <div className="flex items-center justify-center gap-1.5 h-14 mb-10">
                  {[32, 48, 28, 56, 40, 60, 36, 52, 30, 44, 38, 50].map((height, i) => (
                    <div
                      key={i}
                      className="w-2 bg-gradient-to-t from-violet-500 to-violet-300 rounded-full animate-pulse"
                      style={{
                        height: `${height}px`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '1s'
                      }}
                    />
                  ))}
                </div>

                {/* Chat Messages */}
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Mic className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="bg-white/[0.04] rounded-2xl rounded-tl-md px-5 py-4 text-white/80 text-[15px]">
                      &quot;Explain quantum computing and its applications...&quot;
                    </div>
                  </div>
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl rounded-tr-md px-5 py-4 text-white/90 text-[15px]">
                      &quot;Quantum computing uses qubits that can exist in multiple states simultaneously, enabling parallel processing of complex calculations...&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-20 border-y border-white/[0.04]">
        <div className="mx-auto max-w-[1400px] px-12">
          <p className="text-center text-white/30 text-sm mb-12 uppercase tracking-[0.2em]">
            Trusted by learners from leading institutions
          </p>
          <div className="flex justify-center items-center gap-20">
            {['Stanford', 'MIT', 'Harvard', 'Google', 'Microsoft', 'OpenAI'].map((name) => (
              <span key={name} className="text-2xl font-semibold text-white/15 hover:text-white/30 transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Horizontal Cards */}
      <section className="py-28">
        <div className="mx-auto max-w-[1400px] px-12">
          <div className="grid grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Active Learners', icon: Users, color: 'violet' },
              { value: '1M+', label: 'Learning Sessions', icon: MessageSquare, color: 'fuchsia' },
              { value: '200+', label: 'Topics Covered', icon: BookOpen, color: 'cyan' },
              { value: '98%', label: 'Success Rate', icon: Award, color: 'emerald' },
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="group p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-default"
              >
                <div className={`w-14 h-14 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}-400`} />
                </div>
                <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/40 text-[15px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Large Cards Grid */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-[1400px] px-12">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-[15px] text-violet-300 font-medium">Powerful Features</span>
            </div>
            <h2 className="text-[56px] font-bold mb-6 leading-tight">
              Everything You Need to
              <span className="block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Master Any Subject
              </span>
            </h2>
            <p className="text-xl text-white/40 max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven learning methods
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: 'Voice Conversations',
                description: 'Have natural, flowing conversations with AI tutors that understand context and adapt to your learning pace in real-time.',
                color: 'violet',
                gradient: 'from-violet-500/20 to-violet-600/10'
              },
              {
                icon: Brain,
                title: 'Intelligent RAG System',
                description: 'Upload your own materials and let our AI retrieve the most relevant information to answer your questions accurately.',
                color: 'fuchsia',
                gradient: 'from-fuchsia-500/20 to-fuchsia-600/10'
              },
              {
                icon: Target,
                title: 'Personalized Paths',
                description: 'Get custom learning curricula tailored to your goals, schedule, and preferred learning style.',
                color: 'cyan',
                gradient: 'from-cyan-500/20 to-cyan-600/10'
              },
              {
                icon: BarChart3,
                title: 'Progress Analytics',
                description: 'Track your learning journey with beautiful visualizations and actionable insights to improve faster.',
                color: 'emerald',
                gradient: 'from-emerald-500/20 to-emerald-600/10'
              },
              {
                icon: Wand2,
                title: 'Gamification & XP',
                description: 'Stay motivated with achievements, daily streaks, levels, and rewards as you progress through your learning.',
                color: 'amber',
                gradient: 'from-amber-500/20 to-amber-600/10'
              },
              {
                icon: Globe,
                title: 'Multi-Subject Support',
                description: 'From STEM to languages, history to economics - learn anything with specialized AI tutors.',
                color: 'rose',
                gradient: 'from-rose-500/20 to-rose-600/10'
              },
            ].map((feature) => (
              <div 
                key={feature.title}
                className={`group p-10 bg-gradient-to-br ${feature.gradient} border border-white/[0.06] rounded-2xl hover:border-${feature.color}-500/30 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-16 h-16 rounded-xl bg-${feature.color}-500/15 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-400`} />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-white/50 text-[17px] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Horizontal Timeline */}
      <section id="how-it-works" className="py-28 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="mx-auto max-w-[1400px] px-12">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="text-[15px] text-indigo-300 font-medium">Simple Process</span>
            </div>
            <h2 className="text-[56px] font-bold mb-6 leading-tight">
              Start Learning in
              <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Three Simple Steps
              </span>
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-3 gap-12 relative">
            {/* Connecting Lines */}
            <div className="absolute top-16 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-violet-500/30 via-violet-500/50 to-violet-500/30" />
            
            {[
              { num: '01', icon: BookOpen, title: 'Choose Your Subject', desc: 'Select from our wide range of subjects and customize your AI tutor\'s personality and teaching style.' },
              { num: '02', icon: Mic, title: 'Start a Conversation', desc: 'Simply speak naturally. Our AI understands context, remembers your progress, and adapts in real-time.' },
              { num: '03', icon: TrendingUp, title: 'Track & Improve', desc: 'Watch your knowledge grow with detailed analytics, achievements, and personalized recommendations.' },
            ].map((step) => (
              <div key={step.num} className="relative text-center">
                <div className="relative inline-flex mb-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-3xl flex items-center justify-center border border-violet-500/20">
                    <step.icon className="w-14 h-14 text-violet-400" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center text-xl font-bold shadow-xl">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-white/50 text-[17px] leading-relaxed max-w-sm mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Large Format */}
      <section id="testimonials" className="py-28">
        <div className="mx-auto max-w-[1400px] px-12">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 mb-8">
              <Star className="w-4 h-4 text-fuchsia-400" />
              <span className="text-[15px] text-fuchsia-300 font-medium">Testimonials</span>
            </div>
            <h2 className="text-[56px] font-bold mb-6 leading-tight">
              Loved by Learners
              <span className="block bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                quote: 'MindForge completely transformed how I study. The voice conversations feel so natural - it\'s like having a brilliant tutor available 24/7.',
                author: 'Sarah Chen',
                role: 'Computer Science Student, Stanford',
                avatar: 'SC',
                color: 'violet'
              },
              {
                quote: 'I\'ve tried many learning platforms, but nothing comes close. The AI actually understands my questions and explains things at exactly my level.',
                author: 'Marcus Johnson',
                role: 'Medical Resident, Johns Hopkins',
                avatar: 'MJ',
                color: 'fuchsia'
              },
              {
                quote: 'The gamification keeps me coming back every day. I\'ve maintained a 90-day streak and learned more than in years of traditional study.',
                author: 'Emma Williams',
                role: 'Language Learner, UK',
                avatar: 'EW',
                color: 'cyan'
              },
            ].map((testimonial) => (
              <div 
                key={testimonial.author}
                className="p-10 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/[0.1] transition-all"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-[17px] mb-8 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-${testimonial.color}-500 to-${testimonial.color}-600 flex items-center justify-center text-white font-semibold text-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-[17px]">{testimonial.author}</p>
                    <p className="text-white/40">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28">
        <div className="mx-auto max-w-[1100px] px-12">
          <div className="relative p-20 bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-indigo-500/15 border border-white/[0.06] rounded-3xl text-center overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px]" />
            
            <div className="relative">
              <h2 className="text-[56px] font-bold mb-6 leading-tight">
                Ready to Forge
                <span className="block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  Your Knowledge?
                </span>
              </h2>
              
              <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12">
                Join thousands of learners who are mastering new skills every day with MindForge. Start your journey today.
              </p>

              <div className="flex justify-center gap-6 mb-12">
                <SignedOut>
                  <SignUpButton>
                    <button className="group px-10 py-5 bg-white text-black rounded-xl font-semibold text-lg hover:bg-white/90 transition-all hover:scale-[1.02] flex items-center gap-3">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <button className="group px-10 py-5 bg-white text-black rounded-xl font-semibold text-lg hover:bg-white/90 transition-all hover:scale-[1.02] flex items-center gap-3">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </SignedIn>
              </div>

              <div className="flex justify-center gap-12 text-white/40">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Setup in 2 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>50K+ active users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Desktop Layout */}
      <footer className="py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-[1400px] px-12">
          <div className="grid grid-cols-5 gap-16 mb-16">
            {/* Logo & Description */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MindForge</span>
              </Link>
              <p className="text-white/40 leading-relaxed max-w-sm">
                Forge your knowledge with voice-powered AI tutors. Learn anything, anytime, anywhere with personalized learning paths.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-white/40 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-white/40 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/[0.04] flex justify-between items-center">
            <p className="text-white/30">© 2024 MindForge. All rights reserved.</p>
            <p className="text-white/30">Built with ❤️ by Kunal Shaw</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
