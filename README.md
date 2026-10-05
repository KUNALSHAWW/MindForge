<h1 align="center">MindForge</h1>

<p align="center">
  <strong>AI tutors that turn every study session into long-term memory.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/spaced%20repetition-FSRS--4.5-5046e5?style=flat-square" alt="FSRS-4.5" />
  <img src="https://github.com/KUNALSHAWW/MindForge/actions/workflows/ci.yml/badge.svg" alt="CI" />
</p>

---

## The problem

Most AI tutors answer a question and then forget the conversation happened. The learner forgets it too: without retrieval practice, most of what we study fades within days. Chat-based tutors also tend to hand over answers instead of making the learner think, and they explain from general web knowledge rather than the syllabus the learner is actually studying.

## What MindForge does

MindForge closes the loop between **learning**, **recall** and **memory**:

1. **Learn with a tutor.** Create a companion (subject, topic, teaching style, voice) and talk or type with it. Replies stream in, follow the chosen pedagogy (a Socratic tutor asks guiding questions instead of giving answers), and **cite the learner's own notes** as `[1]`, `[2]`.
2. **Recall what matters.** Ending a session produces an AI summary and atomic question/answer **flashcards**, scheduled with **FSRS-4.5**, the spaced-repetition algorithm Anki adopted in 2023.
3. **Remember.** The review page brings each card back right before predicted recall drops below 90%. The tutor is **memory-aware**: cards the learner is close to forgetting are woven into the next conversation as quick retrieval checks.

On top of that loop: **quizzes** written from the learner's notes and graded against the source passage, a scheduler that **personalises itself** to how each learner forgets, and **classrooms** where a teacher sees which subjects the class is forgetting. Progress is gamified (XP with streak bonuses, levels, 30 achievements), and the Journey page shows a per-subject **recall forecast** computed from the forgetting curve.

### Measured, not claimed

| What | Result | How |
|------|--------|-----|
| Notes retrieval (the passages the tutor cites) | **94.4%** of questions find their source paragraph in the top 4 (Hit@1 81.7%, MRR 0.875), vs 82.1% for plain word overlap | 2,100 SQuAD v1.1 validation questions, 434-paragraph pool, same code the tutor runs |
| Personalised memory model | Lower held-out prediction error for **72.5%** of simulated learners (median gain 1.8%); never applied unless it wins on the learner's own held-out cards | 40 seeded learners, 150 cards over 180 days each |

Full method, numbers and limitations: [docs/EVALUATION.md](docs/EVALUATION.md). Reproduce with `npm run eval`.

---

## Features

| Area | What it does |
|------|--------------|
| Streaming AI tutor | `POST /api/chat` streams tokens from any OpenAI-compatible API (Hugging Face Inference Providers by default; Groq, OpenRouter or a local Ollama by changing one env var). Teaching-style system prompts for Socratic, formal, casual and storytelling tutors. Markdown rendering, stop button, conversation starters. |
| Grounded answers (RAG) | **Knowledge Forge** (`/forge`): upload **PDFs** (text extracted page by page) or `.txt`/`.md` notes per subject. Notes are chunked on sentence boundaries; retrieval is **hybrid**: Okapi BM25 plus `bge-small-en-v1.5` embeddings fused with **Reciprocal Rank Fusion**, falling back to BM25 alone with no API key. Answers cite sources down to the page ("Chapter 5, p. 12"). |
| Spaced repetition | Sessions become summaries and flashcards (LLM output validated with Zod). FSRS-4.5 scheduling with interval previews on every rating button, keyboard shortcuts (space, 1-4), relearning of failed cards in the same sitting, manual cards, daily goal. |
| Personalised scheduler | Every rating is logged. After about 100 spaced reviews, **Personalise** fits the 17 FSRS weights to the learner's history (Adam on recall log loss, regularised toward the defaults) and keeps them only if they predict the learner's held-out cards better. |
| Memory-aware tutoring | Before each reply the tutor receives the learner's lowest-retrievability cards for that companion and asks about them when it fits. |
| Quiz mode | `/quiz` writes questions from the learner's notes (LLM short answers, or offline cloze questions that blank the rarest key term). Answers are graded server-side against the model answer and source passage; paraphrases count. Every miss becomes a flashcard. |
| Classrooms | Teachers create a class and share a join code. The teacher view shows weekly activity, a **students x subjects recall heatmap**, the weakest subjects, the most-forgotten cards and flags for inactive or struggling students. Students share summaries only, never conversations or notes. |
| Voice mode | Hands-free conversation with the browser Web Speech API: speech recognition in, gender-matched speech synthesis out, automatic turn taking. No paid voice service required. |
| Gamification | 3 XP per minute with a 10%-per-day streak bonus (capped at 2x), one level per 1,000 XP, review XP, 30 achievements across sessions, streaks, XP, study time, companions, bookmarks and reviews, all evaluated from one rule table. |
| Time-zone-correct streaks | Streak days are computed in the learner's IANA time zone, so a session at 23:30 IST and one at 00:30 IST count as two days. |
| Analytics | 12-week activity heatmap, minutes per week (Recharts), time per subject, per-subject predicted recall, AI session summaries. |
| Settings and data | Profile, theme, voice preferences and review goal persist. One-click JSON export of everything stored. Account deletion cascades through all records and deletes the Clerk user. |
| Production basics | Clerk auth on every page and API route, Zod validation on every server action, ownership checks inside the delete query, Upstash rate limiting (in-memory fallback), transactional progress updates, security headers. |
| Demo mode | With no database the whole UI runs on sample data, so the project can be explored with only Clerk keys. |

---

## Architecture

```text
Browser (React 19)
  ├─ Companion session ── fetch /api/chat (text stream, X-Sources header) ── Web Speech API (voice)
  ├─ Review (FSRS previews run client-side with the learner's own weights)
  └─ Server Actions for everything else
                         │
Next.js 16 App Router  ──┤  proxy.ts (Clerk route protection)
                         │
  src/app/api/chat/route.ts      rate limit → load companion → hybrid retrieval → fading cards
                                 → tutor prompt → stream completion
  src/lib/actions/*              companion, session, review, knowledge, quiz, classroom, journey,
                                 achievement, settings, user ("use server", Zod-validated)
  src/lib/ai/                    llm.ts (OpenAI-compatible client, SSE parsing), embeddings.ts,
                                 tutor.ts (prompts, session digest), quiz.ts (generation, grading)
  src/lib/fsrs.ts                FSRS-4.5 scheduler (per-learner weights)  ┐
  src/lib/fsrs-optimizer.ts      weight fitting + learner simulator        │
  src/lib/gamification.ts        XP, levels, streaks, badges               ├ pure, unit tested
  src/lib/retrieval.ts           page-aware chunking, BM25, cosine, RRF    │
  src/lib/quiz.ts                cloze generation, grading                 │
  src/lib/classroom.ts           class insights aggregation                ┘
  scripts/eval.ts                SQuAD retrieval + learner-simulation benchmark
                         │
                 Prisma 5 → PostgreSQL
```

### Design decisions worth reading

- **Pure core, thin I/O.** The scheduler, optimizer, gamification rules, retrieval, quiz grading and class analytics are pure modules, so the exact code that runs in production is tested with `node --test`, benchmarked by `scripts/eval.ts` and reused in the browser for interval previews.
- **Never worse than the default.** Personalised FSRS weights are fitted on 80% of a learner's cards and adopted only if they lower log loss on the other 20%.
- **Answers stay on the server.** Quiz answers and source passages are stored server-side and revealed only after grading, so the client never sees them early.
- **Progress can't drift.** Saving a session reads the user and their last session, computes streak, XP and level, and writes everything inside one interactive transaction. The slow LLM digest runs *after* the commit, so a model failure never loses progress.
- **Provider-agnostic LLM layer.** About 90 lines of `fetch` against the OpenAI chat-completions contract instead of a vendor SDK, which keeps hosted and local models interchangeable.
- **Graceful degradation everywhere.** No LLM key: an offline tutor keeps sessions usable. No embedding key: BM25 retrieval. No database: demo mode. No Upstash: in-memory rate limiting.

---

## Data model

```text
User ──< Companion        teaching persona authored by the user
  │  ──< SessionHistory   duration, transcript, XP, AI summary
  │  ──< Flashcard        front/back + FSRS state (stability, difficulty, reps, lapses, due)
  │  ──< ReviewLog        every rating, the optimizer's training data
  │  ──< RAGDocument      notes or PDF text (page-separated) + JSON chunk embeddings
  │  ──< Quiz             questions, answers, grades, score
  │  ──< Achievement      unique per (user, title)
  │  ──< Bookmark         unique per (user, companion)
  │  ──< Classroom        owned classes with a unique join code
  └──< ClassMember        unique per (class, student)
User also stores level, XP, streaks, minutes, time zone, settings and personalised FSRS weights (JSON).
```

---

## Getting started

Requirements: Node.js 22.18+ (24 recommended), a free [Clerk](https://clerk.com) application. PostgreSQL and an LLM key are optional.

```bash
git clone https://github.com/KUNALSHAWW/MindForge.git
cd MindForge
npm install
cp .env.example .env.local     # add your Clerk keys, optionally DATABASE_URL and HUGGINGFACE_API_KEY
npm run db:push                # only when DATABASE_URL is set
npm run dev
```

Open http://localhost:3000. See [`.env.example`](.env.example) for every variable, including how to use Groq or a local Ollama model.

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` / `npm start` | Production build and server |
| `npm test` | 28 unit tests: FSRS, optimizer, gamification, retrieval, quiz grading, class insights, LLM stream parser (`node --test`, no test framework) |
| `npm run eval` | Retrieval and memory-model benchmark, writes `docs/EVALUATION.md` |
| `npm run lint` / `npm run type-check` | ESLint 9 and strict TypeScript |
| `npm run db:push` / `db:studio` | Sync the Prisma schema, browse data |

CI runs lint, type-check, tests and a production build on every push.

### Deploying

Import the repository in Vercel, add the environment variables and deploy. Set the Upstash variables in production so rate limits hold across serverless instances.

---

## Roadmap

- Offline-first PWA so reviews work without a connection
- OCR for scanned PDFs and handwritten notes
- Teacher-assigned quizzes and class-wide shared notes
- Evaluate hybrid retrieval and tutor answer faithfulness with an LLM judge

## Author

**Kunal Kumar Shaw** · [GitHub @KUNALSHAWW](https://github.com/KUNALSHAWW) · [Portfolio](https://kunalshaw.vercel.app/)

## License

[MIT](LICENSE)
