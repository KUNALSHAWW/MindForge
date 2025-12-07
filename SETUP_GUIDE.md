# MindForge - Setup & Installation Guide

## 🎯 Project Overview

**MindForge** is a production-grade, AI-powered learning platform that combines:
- **Voice-First Learning**: Real-time voice conversations with AI tutors
- **RAG System**: Intelligent knowledge retrieval using HuggingFace models
- **Advanced Analytics**: Beautiful progress tracking and learning insights
- **Gamification**: XP, streaks, achievements, and levels
- **Production-Ready Architecture**: Scalable, secure, and deployable

## 📋 Prerequisites

Before getting started, ensure you have:
- **Node.js 20+** ([Download](https://nodejs.org/))
- **npm** or **pnpm** (comes with Node.js)
- **Git** (for version control)
- A text editor or IDE (VS Code recommended)

### Required API Keys & Services

You'll need to set up accounts and obtain API keys for:

1. **Clerk Authentication** - Free tier available
   - Visit: https://dashboard.clerk.com
   - Create a new application
   - Get `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`

2. **Supabase** - Database (PostgreSQL)
   - Visit: https://supabase.com
   - Create a new project
   - Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Also get `SUPABASE_SERVICE_ROLE_KEY` for server-side operations

3. **VAPI** - Voice AI
   - Visit: https://vapi.ai
   - Sign up and create an API key
   - Get `NEXT_PUBLIC_VAPI_PUBLIC_KEY` and `VAPI_PRIVATE_KEY`

4. **HuggingFace** - LLM & Embeddings
   - Visit: https://huggingface.co
   - Create an account
   - Generate an API token in settings
   - Get `HUGGINGFACE_API_KEY`

5. **Upstash** - Redis for Rate Limiting (Optional but recommended)
   - Visit: https://upstash.com
   - Create a Redis database
   - Get `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

## 🚀 Installation Steps

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mindforge.git
cd mindforge

# Install dependencies
npm install
# or
pnpm install

# Setup environment variables
cp .env.example .env.local
```

### Step 2: Configure Environment Variables

Edit `.env.local` and fill in all the API keys you gathered:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# VAPI
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_key...
VAPI_PRIVATE_KEY=your_key...

# HuggingFace
HUGGINGFACE_API_KEY=hf_...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Supabase
npm run db:push

# (Optional) Open Prisma Studio to inspect DB
npm run db:studio
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
mindforge/
├── prisma/                    # Database schema
├── public/                    # Static assets
│   ├── animations/           # Lottie animations
│   ├── icons/                # SVG icons
│   └── images/               # Images
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Auth pages (login, signup)
│   │   ├── (dashboard)/     # Protected pages
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   ├── companions/  # Companions list
│   │   │   ├── forge/       # Voice session
│   │   │   └── journey/     # Analytics
│   │   ├── api/             # API routes
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/           # React components
│   │   ├── providers/       # Context providers
│   │   ├── ui/              # UI primitives
│   │   └── navbar.tsx       # Navigation
│   ├── config/              # Configuration
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & services
│   │   ├── actions/         # Server actions
│   │   ├── services/        # External integrations
│   │   │   └── rag.ts      # RAG system
│   │   ├── api.ts           # API utilities
│   │   ├── utils.ts         # Helper functions
│   │   └── validators.ts    # Zod schemas
│   ├── stores/              # Zustand stores
│   └── types/               # TypeScript types
└── tests/                   # Test files
```

## 🔑 Key Features Overview

### 1. Voice Learning (`/forge`)
- Real-time voice conversations with AI tutors
- VAPI integration for voice synthesis
- Live transcription of conversations
- Session history and replays

### 2. Companion Management (`/companions`)
- Browse available AI tutors
- Create custom companions
- Different teaching styles: Formal, Casual, Socratic, Storytelling
- Voice selection: Male or Female
- Subject-based organization

### 3. Learning Analytics (`/journey`)
- Activity heatmap (GitHub style)
- Progress charts and statistics
- Streak counter with daily tracking
- Subject-wise performance analysis
- XP and leveling system

### 4. RAG System
- Custom document upload
- Intelligent knowledge retrieval
- Chain-of-thought reasoning
- Context-aware responses
- Uses HuggingFace models

### 5. Gamification
- XP points for each session
- Leveling system (1-20)
- Achievement badges
- Leaderboards
- Daily streaks and rewards

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack

# Building
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run type-check      # Check TypeScript types
npm run format          # Format code with Prettier

# Database
npm run db:generate     # Generate Prisma Client
npm run db:push         # Sync schema with database
npm run db:studio       # Open Prisma Studio
```

## 📊 Database Schema Overview

### Core Tables
- **User**: User profiles with auth integration
- **Companion**: AI tutor definitions
- **SessionHistory**: Learning session records
- **Achievement**: User achievements and badges
- **Bookmark**: Bookmarked companions
- **RAGDocument**: Custom knowledge base
- **LearningPath**: Structured curricula

## 🔐 Security Considerations

1. **Authentication**: All routes protected with Clerk
2. **API Security**: Rate limiting with Upstash Redis
3. **Database**: Supabase handles encryption at rest
4. **Environment Variables**: Never commit `.env.local`
5. **CORS**: Configured for Vercel deployment
6. **XSS Protection**: Built-in with Next.js

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial MindForge commit"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard
4. Click "Deploy"

### Step 3: Post-Deployment

```bash
# Run migrations on Vercel
vercel env pull
npm run db:push
```

## 📚 API Documentation

### Authentication
- Login: `/sign-in`
- Sign Up: `/sign-up`
- Clerk handles all auth

### Companions API
- `GET /api/companions` - List companions
- `POST /api/companions` - Create companion
- `GET /api/companions/:id` - Get companion details
- `DELETE /api/companions/:id` - Delete companion

### Sessions API
- `POST /api/sessions` - Create session
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/:id` - Get session details
- `PATCH /api/sessions/:id` - Update session

### RAG API
- `POST /api/rag/documents` - Upload document
- `POST /api/rag/query` - Query with RAG
- `DELETE /api/rag/documents/:id` - Delete document

### Analytics API
- `GET /api/analytics/stats` - User statistics
- `GET /api/analytics/heatmap` - Activity heatmap
- `GET /api/analytics/achievements` - User achievements

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

### Database Connection Error
```bash
# Check DATABASE_URL in .env.local
# Make sure Supabase project is active
npm run db:push
```

### Clerk Authentication Issues
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is correct
- Check Clerk dashboard for application configuration
- Ensure redirect URLs match: `/sign-in`, `/sign-up`

### HuggingFace API Errors
- Verify `HUGGINGFACE_API_KEY` is valid
- Check HuggingFace account limits
- Ensure models are available in your region

## 📈 Performance Optimization

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Automatic with Next.js
3. **Database Indexing**: Prisma handles this
4. **Caching**: React Cache API for server components
5. **Rate Limiting**: Upstash Redis
6. **CDN**: Vercel Edge Network

## 🎨 Customization

### Theme Colors
Edit CSS variables in `src/app/globals.css`:
```css
:root {
  --primary: 250 100% 65%;
  --secondary: 180 100% 50%;
  --accent: 38 100% 60%;
  /* ... more colors ... */
}
```

### Fonts
Change font imports in `src/app/layout.tsx`:
```typescript
import { Inter, Space_Grotesk } from "next/font/google";
```

### UI Components
Extend components in `src/components/ui/`

## 📞 Support & Resources

- **Documentation**: Check `/docs` folder
- **Issues**: GitHub Issues for bug reports
- **Discord**: Join our community (coming soon)
- **Email**: support@mindforge.dev

## 📜 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Happy Learning! 🚀**

Need help? Check the documentation or open an issue on GitHub.
