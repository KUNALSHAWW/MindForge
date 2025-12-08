# MindForge 🧠⚡

> **Forge your knowledge through intelligent voice conversations.**

MindForge is a next-generation learning platform that combines voice-powered tutors, intelligent knowledge retrieval (RAG), and gamified progress tracking to create an immersive educational experience.

![MindForge Banner](public/images/banner.png)

## ✨ Features

### 🎙️ Voice-First Learning
- **Real-time Voice Conversations** - Natural tutoring sessions with VAPI-powered voice synthesis
- **Adaptive Teaching Styles** - Choose between formal, casual, or Socratic teaching methods
- **Multi-Language Support** - Learn in your preferred language with localized tutors
- **Live Transcription** - Full session transcripts with keyword highlighting

### 🧠 Intelligent Knowledge System
- **RAG-Enhanced Responses** - Retrieval Augmented Generation for accurate, contextual answers
- **Custom Knowledge Bases** - Upload documents to create personalized learning materials
- **Chain-of-Thought Reasoning** - Transparent AI thinking process for better understanding
- **Adaptive Difficulty** - Content automatically adjusts to your proficiency level

### 📊 Advanced Analytics
- **Learning Heatmaps** - GitHub-style activity visualization
- **Streak Tracking** - Daily consistency rewards with multipliers
- **Performance Insights** - Detailed analytics on learning patterns
- **Goal Setting** - Weekly and monthly learning targets

### 🎨 Modern Experience
- **Dark/Light Mode** - Beautiful themes with smooth transitions
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Power-user friendly navigation
- **Accessibility First** - WCAG 2.1 AA compliant

### 🏆 Gamification
- **XP & Leveling System** - Earn experience points for every session
- **Achievement Badges** - Unlock rewards for learning milestones
- **Leaderboards** - Compare progress with the community
- **Learning Paths** - Structured curricula for different subjects

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router, RSC, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + Framer Motion |
| **Database** | Supabase (PostgreSQL) + Prisma ORM |
| **Authentication** | Clerk |
| **Voice AI** | VAPI |
| **LLM** | HuggingFace Inference API |
| **State Management** | Zustand + React Query |
| **Rate Limiting** | Upstash Redis |
| **Deployment** | Vercel |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or pnpm
- Supabase account
- Clerk account
- VAPI account
- HuggingFace account

### Installation

```bash
# Clone the repository
git clone https://github.com/KUNALSHAWW/mindforge.git
cd mindforge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# VAPI Voice AI
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
VAPI_PRIVATE_KEY=

# HuggingFace
HUGGINGFACE_API_KEY=

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Project Structure

```
mindforge/
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
│   ├── animations/        # Lottie animation files
│   ├── icons/             # SVG icons
│   └── images/            # Images and graphics
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (dashboard)/   # Protected dashboard routes
│   │   ├── (marketing)/   # Public marketing pages
│   │   └── api/           # API routes
│   ├── components/        # React components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── forge/         # Learning forge components
│   │   ├── landing/       # Landing page components
│   │   ├── shared/        # Shared components
│   │   └── ui/            # UI primitives (shadcn/ui)
│   ├── config/            # Configuration files
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions & services
│   │   ├── actions/       # Server actions
│   │   ├── services/      # External service integrations
│   │   └── validators/    # Zod schemas
│   ├── stores/            # Zustand stores
│   └── types/             # TypeScript type definitions
└── tests/                 # Test files
```

## 🎯 Roadmap

- [x] Core voice learning functionality
- [x] User authentication & profiles
- [x] Activity tracking & heatmaps
- [x] Dark/Light mode support
- [ ] RAG-enhanced knowledge retrieval
- [ ] Custom document upload
- [ ] Multiplayer study rooms
- [ ] Mobile app (React Native)
- [ ] Offline mode with service workers
- [ ] AI-generated quizzes

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

---

<div align="center">
  <strong>Built with ❤️ by Kunal Shaw</strong>
  <br />
  <a href="https://mindforge.vercel.app">Live Demo</a> • 
  <a href="#-quick-start">Get Started</a> •
  <a href="https://github.com/KUNALSHAWW/mindforge/issues">Report Bug</a>
</div>
