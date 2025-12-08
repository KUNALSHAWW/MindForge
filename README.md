<p align="center">
  <img src="public/images/banner.png" alt="MindForge Banner" width="100%" />
</p>

<h1 align="center">MindForge</h1>

<p align="center">
  <strong>🧠 Forge Your Knowledge Through Intelligent Voice Conversations</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-5.20-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <a href="https://mindforge.vercel.app">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-5046e5?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

---

## 📖 Overview

**MindForge** is a next-generation AI-powered learning platform that revolutionizes education through voice-first interactions. Create personalized AI tutoring companions, engage in natural voice conversations, and track your learning progress with gamified elements.

Built with a production-grade SaaS architecture, MindForge combines cutting-edge technologies to deliver a seamless, responsive, and accessible learning experience across all devices.

---

## ✨ Features

### 🎙️ Voice-First Learning
- **Real-time Voice Conversations** — Natural tutoring sessions powered by VAPI voice synthesis
- **Adaptive Teaching Styles** — Choose between formal, casual, Socratic, or storytelling approaches
- **Multi-Language Support** — Learn in your preferred language with localized AI tutors
- **Live Transcription** — Full session transcripts with intelligent keyword highlighting

### 🤖 AI Companions
- **Personalized Tutors** — Create custom AI companions for any subject or topic
- **Multiple Personalities** — Each companion adapts its teaching style to your preferences
- **Session History** — Review past conversations and track learning progress
- **RAG-Enhanced Knowledge** — Retrieval Augmented Generation for accurate, contextual responses

### 📊 Dashboard & Analytics
- **Learning Statistics** — Track XP, levels, streaks, and session time
- **Progress Visualization** — Beautiful charts and progress rings
- **Session Management** — Review and continue past learning sessions
- **Quick Actions** — One-click access to common tasks

### 🎨 Modern UI/UX
- **Clean SaaS Design** — Professional, minimalist interface inspired by Linear & Vercel
- **Dark/Light Themes** — Seamless theme switching with system preference detection
- **Responsive Layout** — Optimized for desktop, tablet, and mobile devices
- **Accessible** — WCAG 2.1 AA compliant with keyboard navigation support

### 🏆 Gamification
- **XP & Leveling** — Earn experience points for every learning session
- **Streak Tracking** — Build daily consistency with streak multipliers
- **Achievement Badges** — Unlock rewards for learning milestones
- **Progress Goals** — Set and track weekly/monthly learning targets

---

## 🛠️ Tech Stack

<table>
<tr>
<td><strong>Category</strong></td>
<td><strong>Technologies</strong></td>
</tr>
<tr>
<td>Framework</td>
<td>
<img src="https://img.shields.io/badge/Next.js_16-black?logo=next.js&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/Turbopack-black?logo=vercel&logoColor=white" alt="Turbopack" />
</td>
</tr>
<tr>
<td>Language</td>
<td>
<img src="https://img.shields.io/badge/TypeScript_5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</td>
</tr>
<tr>
<td>Styling</td>
<td>
<img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white" alt="Framer Motion" />
<img src="https://img.shields.io/badge/Radix_UI-161618?logo=radix-ui&logoColor=white" alt="Radix UI" />
</td>
</tr>
<tr>
<td>Database</td>
<td>
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/Prisma_ORM-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
</td>
</tr>
<tr>
<td>Authentication</td>
<td>
<img src="https://img.shields.io/badge/Clerk-6C47FF?logo=clerk&logoColor=white" alt="Clerk" />
</td>
</tr>
<tr>
<td>AI & Voice</td>
<td>
<img src="https://img.shields.io/badge/VAPI-FF6B6B?logoColor=white" alt="VAPI" />
<img src="https://img.shields.io/badge/HuggingFace-FFD21E?logo=huggingface&logoColor=black" alt="HuggingFace" />
</td>
</tr>
<tr>
<td>State Management</td>
<td>
<img src="https://img.shields.io/badge/Zustand-443E38?logoColor=white" alt="Zustand" />
<img src="https://img.shields.io/badge/TanStack_Query-FF4154?logo=react-query&logoColor=white" alt="React Query" />
</td>
</tr>
<tr>
<td>Infrastructure</td>
<td>
<img src="https://img.shields.io/badge/Vercel-black?logo=vercel&logoColor=white" alt="Vercel" />
<img src="https://img.shields.io/badge/Upstash_Redis-00E9A3?logo=redis&logoColor=white" alt="Upstash" />
</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.0 or higher
- **npm**, **pnpm**, or **yarn**
- **PostgreSQL** database (or Supabase account)
- **Clerk** account for authentication
- **VAPI** account for voice AI
- **HuggingFace** account for LLM inference

### Installation

```bash
# Clone the repository
git clone https://github.com/KUNALSHAWW/MindForge.git
cd MindForge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="postgresql://user:password@host:5432/mindforge"

# ===========================================
# CLERK AUTHENTICATION
# ===========================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# ===========================================
# SUPABASE (Optional - for file storage)
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ===========================================
# VAPI VOICE AI
# ===========================================
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
VAPI_PRIVATE_KEY=

# ===========================================
# HUGGINGFACE LLM
# ===========================================
HUGGINGFACE_API_KEY=hf_...

# ===========================================
# UPSTASH REDIS (Rate Limiting)
# ===========================================
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=

# ===========================================
# APPLICATION
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run type-check` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## 📁 Project Structure

```
mindforge/
├── 📁 prisma/
│   └── schema.prisma          # Database schema
├── 📁 public/
│   ├── animations/            # Lottie animation files
│   ├── icons/                 # SVG icons
│   └── images/                # Static images
├── 📁 src/
│   ├── 📁 app/                # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── sign-in/       # Sign in page
│   │   │   └── sign-up/       # Sign up page
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── companions/    # AI companions management
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── journey/       # Learning journey tracker
│   │   │   └── settings/      # User settings
│   │   ├── (landing)/         # Public marketing pages
│   │   ├── globals.css        # Global styles & CSS variables
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Landing page
│   ├── 📁 components/
│   │   ├── Dashboard/         # Dashboard components
│   │   │   ├── Button.tsx     # Variant-based button
│   │   │   ├── Card.tsx       # Card & CardHeader
│   │   │   ├── CompanionGrid.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── SessionList.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── index.ts       # Barrel exports
│   │   ├── providers/         # Context providers
│   │   ├── ui/                # shadcn/ui primitives
│   │   └── Navbar.tsx         # Navigation component
│   ├── 📁 lib/
│   │   ├── actions/           # Server Actions
│   │   │   └── user.ts        # User data fetching
│   │   ├── db.ts              # Prisma client singleton
│   │   └── utils.ts           # Utility functions
│   ├── 📁 types/              # TypeScript definitions
│   └── middleware.ts          # Auth middleware
├── .env.example               # Environment template
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

---

## 🎨 Design System

MindForge uses a custom CSS variable-based design system for consistent theming:

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--primary` | Indigo 600 | Indigo 500 | Primary actions, links |
| `--background` | White | Slate 950 | Page backgrounds |
| `--foreground` | Slate 900 | White | Primary text |
| `--muted` | Slate 100 | Slate 800 | Secondary backgrounds |
| `--border` | Slate 200 | Slate 800 | Borders, dividers |
| `--accent` | Indigo 50 | Indigo 950 | Highlighted areas |

### Component Architecture

- **Atomic Design** — Components organized by complexity (atoms → molecules → organisms)
- **Composition Pattern** — Flexible components using children and slots
- **Variant System** — CVA-based styling variants for consistent APIs

---

## 📊 Database Schema

### Core Models

```prisma
User           # User profiles with stats & preferences
├── Companion  # AI tutor configurations
├── Session    # Learning session history
├── Achievement # Unlocked badges & milestones
├── Document   # RAG knowledge base documents
└── Bookmark   # Saved companions
```

### Key Relationships

- Users can create multiple AI Companions
- Each Companion can have multiple Sessions
- Users earn Achievements based on activity
- Documents enable RAG-enhanced responses

---

## 🔐 Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │ ──▶ │   Sign In   │ ──▶ │  Dashboard  │
│    Page     │     │   (Clerk)   │     │   (Auth'd)  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Sign Up   │
                    │   (Clerk)   │
                    └─────────────┘
```

- **Clerk** handles all authentication flows
- **Middleware** protects dashboard routes
- **Server Actions** verify authentication server-side

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Configure environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KUNALSHAWW/MindForge)

### Docker

```dockerfile
# Build
docker build -t mindforge .

# Run
docker run -p 3000:3000 --env-file .env.local mindforge
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## 🧪 Development

### Code Quality

```bash
# Run all checks
npm run lint && npm run type-check

# Fix formatting
npm run format
```

### Database Management

```bash
# View/edit data in browser
npm run db:studio

# Apply schema changes
npm run db:push

# Reset database (caution!)
npx prisma migrate reset
```

---

## 🗺️ Roadmap

- [x] Voice-powered learning sessions
- [x] User authentication & profiles
- [x] AI companion creation & management
- [x] Dashboard with statistics
- [x] Dark/Light theme support
- [x] Settings page
- [ ] RAG document upload
- [ ] Multiplayer study rooms
- [ ] Mobile app (React Native)
- [ ] Offline mode with PWA
- [ ] AI-generated quizzes
- [ ] Learning path recommendations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on code style and development workflow.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — The React Framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Clerk](https://clerk.com/) — Authentication & User Management
- [VAPI](https://vapi.ai/) — Voice AI Platform
- [Prisma](https://prisma.io/) — Next-generation ORM
- [Vercel](https://vercel.com/) — Deployment Platform

---

<div align="center">
  <br />
  <p>
    <strong>Built with ❤️ by <a href="https://github.com/KUNALSHAWW">Kunal Shaw</a></strong>
  </p>
  <p>
    <a href="https://mindforge.vercel.app">Live Demo</a> •
    <a href="https://github.com/KUNALSHAWW/MindForge/issues">Report Bug</a> •
    <a href="https://github.com/KUNALSHAWW/MindForge/issues">Request Feature</a>
  </p>
  <br />
  <p>
    ⭐ Star this repo if you find it helpful!
  </p>
</div>
