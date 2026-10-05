"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Heart,
  MessageSquare,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Send,
  Share2,
  Sparkles,
  Square,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { deleteCompanion, toggleBookmark, type CompanionWithStats } from "@/lib/actions/companion";
import { createSession } from "@/lib/actions/session";
import { subjectIcon, subjectLabel } from "@/lib/subjects";

interface Source {
  title: string;
  text: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface Props {
  companion: CompanionWithStats;
  autoSpeak: boolean;
  voiceEnabled: boolean;
}

// The Web Speech recognition API is not in lib.dom yet; this is the subset we use.
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  abort(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}
type RecognitionConstructor = new () => Recognition;

function recognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Markdown reply -> text that sounds natural when read aloud. */
function speakable(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " (see the code example on screen) ")
    .replace(/\[\d+\]/g, "")
    .replace(/[*_#>`~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickVoice(gender: string): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pattern =
    gender === "female"
      ? /female|samantha|zira|susan|victoria|karen|moira|tessa|aria|jenny|libby|sonia/i
      : /\bmale|david|daniel|alex|fred|guy|mark|george|ryan|thomas/i;
  return voices.find((v) => pattern.test(v.name)) ?? voices[0];
}

function parseSources(header: string | null): Source[] {
  if (!header) return [];
  try {
    return JSON.parse(decodeURIComponent(header));
  } catch {
    return [];
  }
}

const noopSubscribe = () => () => {};

const STARTERS = ["Explain the basics simply", "Give me a worked example", "Quiz me on what I know", "What do people usually get wrong?"];

export default function CompanionSession({ companion, autoSpeak, voiceEnabled }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bookmarked, setBookmarked] = useState(companion.isBookmarked);
  const [speakerOn, setSpeakerOn] = useState(autoSpeak);
  const [handsFree, setHandsFree] = useState(false);
  const [listening, setListening] = useState(false);
  // Browser-only capabilities, false during server rendering.
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const speechSupported = {
    listen: isClient && voiceEnabled && !!recognitionConstructor(),
    speak: isClient && "speechSynthesis" in window,
  };

  const messagesRef = useRef<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const handsFreeRef = useRef(false);
  const sendRef = useRef<(text: string) => void>(() => {});

  useEffect(() => {
    messagesRef.current = messages;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [active]);

  const stopVoice = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setListening(false);
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }, []);

  useEffect(() => () => {
    abortRef.current?.abort();
    stopVoice();
  }, [stopVoice]);

  const startListening = useCallback(() => {
    const Ctor = recognitionConstructor();
    if (!Ctor || recognitionRef.current) return;
    const recognition = new Ctor();
    recognition.lang = navigator.language || "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) sendRef.current(result[0].transcript);
        else interim += result[0].transcript;
      }
      setInput(interim);
    };
    recognition.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        toast.error("Microphone access was blocked. Allow it in your browser to talk to your tutor.");
        handsFreeRef.current = false;
        setHandsFree(false);
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  const speak = useCallback(
    (text: string) => {
      const utterance = new SpeechSynthesisUtterance(speakable(text));
      const voice = pickVoice(companion.voice);
      if (voice) utterance.voice = voice;
      utterance.pitch = companion.voice === "female" ? 1.1 : 0.95;
      utterance.rate = 1.03;
      utterance.onend = () => {
        if (handsFreeRef.current) startListening();
      };
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    },
    [companion.voice, startListening],
  );

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || streaming) return;
      recognitionRef.current?.abort();

      const userMessage: Message = { id: crypto.randomUUID(), role: "user", content };
      const assistantId = crypto.randomUUID();
      const history = [...messagesRef.current, userMessage];
      setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
      setInput("");
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      let reply = "";
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            companionId: companion.id,
            messages: history
              .filter((m) => m.id !== "welcome" && m.content)
              .slice(-40)
              .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) })),
          }),
        });
        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? "The tutor is unavailable right now");
        }
        const sources = parseSources(res.headers.get("X-Sources"));
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: reply, sources } : m)));
        }
        if (speakerOn && "speechSynthesis" in window && reply) speak(reply);
        else if (handsFreeRef.current) startListening();
      } catch (error) {
        if (controller.signal.aborted) return;
        toast.error(error instanceof Error ? error.message : "Something went wrong");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content));
      } finally {
        setStreaming(false);
      }
    },
    [companion.id, speak, speakerOn, startListening, streaming],
  );
  useEffect(() => {
    sendRef.current = send;
  }, [send]);

  function start() {
    setActive(true);
    setElapsed(0);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hi, I'm **${companion.name}**. Let's work on **${companion.topic}** together. What would you like to understand better today?`,
      },
    ]);
  }

  function toggleHandsFree() {
    const next = !handsFree;
    handsFreeRef.current = next;
    setHandsFree(next);
    if (next && !streaming) startListening();
    if (!next) {
      recognitionRef.current?.abort();
      setListening(false);
    }
  }

  async function endSession() {
    abortRef.current?.abort();
    stopVoice();
    handsFreeRef.current = false;
    setHandsFree(false);

    if (elapsed < 60) {
      setActive(false);
      setMessages([]);
      toast("Sessions shorter than a minute are not saved.");
      return;
    }

    setSaving(true);
    const transcript = messagesRef.current
      .filter((m) => m.content)
      .map((m) => `${m.role === "user" ? "Learner" : companion.name}: ${m.content}`)
      .join("\n\n");
    const result = await createSession({
      companionId: companion.id,
      durationMinutes: Math.max(1, Math.round(elapsed / 60)),
      transcript,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (!result.success) {
      setSaving(false);
      toast.error(`${result.error}. Your conversation is still here, try ending the session again.`);
      return;
    }

    const d = result.data;
    toast.success(`+${d.xpEarned} XP · ${d.streak}-day streak · Level ${d.level}`, {
      description: d.demo ? "Demo mode: connect a database to keep your progress." : d.summary ?? undefined,
    });
    if (d.flashcardsCreated) toast(`${d.flashcardsCreated} flashcards from this session were added to your review queue`);
    for (const a of d.newAchievements) toast.success(`Achievement unlocked: ${a}`);
    router.push(d.flashcardsCreated ? "/review" : "/dashboard");
  }

  async function handleBookmark() {
    const result = await toggleBookmark(companion.id);
    if (!result.success) return toast.error(result.error);
    setBookmarked(result.data.isBookmarked);
    for (const a of result.newAchievements ?? []) toast.success(`Achievement unlocked: ${a}`);
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: companion.name, text: `Learn ${companion.topic} with ${companion.name} on MindForge`, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${companion.name}? Its session history and flashcard links will be removed.`)) return;
    const result = await deleteCompanion(companion.id);
    if (!result.success) return toast.error(result.error);
    toast.success("Companion deleted");
    router.push("/companions");
  }

  const planned = companion.duration * 60;
  const progress = Math.min(100, Math.round((elapsed / planned) * 100));
  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/companions"
          className="inline-flex items-center gap-2 text-sm text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companions
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark companion"}
            aria-pressed={bookmarked}
            className={`p-2 rounded-lg transition-colors ${bookmarked ? "text-red-500 bg-red-500/10" : "text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--muted))]"}`}
          >
            <Heart className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`} />
          </button>
          <button onClick={handleShare} aria-label="Share companion" className="p-2 rounded-lg text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--muted))] transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          {companion.isOwner && (
            <button onClick={handleDelete} aria-label="Delete companion" className="p-2 rounded-lg text-[hsl(var(--foreground-muted))] hover:text-red-500 hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)] flex items-center justify-center text-3xl">
            {subjectIcon(companion.subject)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-[hsl(var(--foreground))]">{companion.name}</h1>
            <p className="text-sm text-[hsl(var(--foreground-muted))] mb-3">{companion.description}</p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                <BookOpen className="w-3 h-3" />
                {subjectLabel(companion.subject)} · {companion.topic}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground-muted))] capitalize">
                <MessageSquare className="w-3 h-3" />
                {companion.style}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground-muted))]">
                <Clock className="w-3 h-3" />
                {companion.duration} min
              </span>
            </div>
          </div>
        </div>
      </div>

      {!active ? (
        <div className="card p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-[hsl(var(--primary))]" />
          </div>
          <h2 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">Ready to learn?</h2>
          <p className="text-[hsl(var(--foreground-muted))] mb-6 max-w-md mx-auto">
            Type or talk with {companion.name} about {companion.topic}. Answers cite your uploaded notes, and when you end the session
            the key ideas become flashcards scheduled for review right before you would forget them.
          </p>
          <button
            onClick={start}
            className="px-8 py-4 rounded-xl bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary)/0.9)] transition-colors inline-flex items-center gap-3"
          >
            <Phone className="w-5 h-5" />
            Start Session
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--background-secondary))]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--success)/0.1)] flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${listening ? "bg-red-500" : "bg-[hsl(var(--success))]"} animate-pulse`} />
                </div>
                <div>
                  <p className="font-medium text-[hsl(var(--foreground))]">{listening ? "Listening…" : streaming ? `${companion.name} is answering…` : "Session active"}</p>
                  <p className="text-sm text-[hsl(var(--foreground-muted))] tabular-nums">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {clock} / {companion.duration}:00
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {speechSupported.listen && (
                  <button
                    onClick={toggleHandsFree}
                    aria-label={handsFree ? "Turn off voice conversation" : "Talk with your voice"}
                    aria-pressed={handsFree}
                    title="Hands-free voice conversation"
                    className={`p-2 rounded-lg transition-colors ${handsFree ? "bg-[hsl(var(--primary))] text-white" : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground-muted))]"}`}
                  >
                    {handsFree ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                )}
                {speechSupported.speak && (
                  <button
                    onClick={() => {
                      if (speakerOn) speechSynthesis.cancel();
                      setSpeakerOn(!speakerOn);
                    }}
                    aria-label={speakerOn ? "Mute tutor voice" : "Read replies aloud"}
                    aria-pressed={speakerOn}
                    className={`p-2 rounded-lg transition-colors ${speakerOn ? "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]" : "bg-red-500/10 text-red-500"}`}
                  >
                    {speakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                )}
                <button
                  onClick={endSession}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving & making flashcards…
                    </>
                  ) : (
                    <>
                      <PhoneOff className="w-4 h-4" />
                      End Session
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="mt-3 h-1 rounded-full bg-[hsl(var(--muted))] overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Planned session time">
              <div className="h-full bg-[hsl(var(--primary))] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="h-[440px] overflow-y-auto p-4 space-y-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user" ? "bg-[hsl(var(--primary))] text-white" : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
                  }`}
                >
                  {message.role === "assistant" ? (
                    message.content ? (
                      <div className="chat-markdown text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-1" aria-label="Tutor is typing">
                        {[0, 0.1, 0.2].map((delay) => (
                          <div key={delay} className="w-2 h-2 rounded-full bg-[hsl(var(--foreground-muted))] animate-bounce" style={{ animationDelay: `${delay}s` }} />
                        ))}
                      </div>
                    )
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  {message.sources && message.sources.length > 0 && (
                    <details className="mt-2 text-xs text-[hsl(var(--foreground-muted))]">
                      <summary className="cursor-pointer select-none inline-flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {message.sources.length} source{message.sources.length > 1 ? "s" : ""} from your notes
                      </summary>
                      <ol className="mt-2 space-y-2">
                        {message.sources.map((s, i) => (
                          <li key={i} className="rounded-lg bg-[hsl(var(--background))] p-2">
                            <span className="font-medium text-[hsl(var(--foreground))]">[{i + 1}] {s.title}</span>
                            <p className="mt-1 line-clamp-3">{s.text}</p>
                          </li>
                        ))}
                      </ol>
                    </details>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-3 py-1.5 rounded-full text-xs border border-[hsl(var(--border))] text-[hsl(var(--foreground-muted))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="tutor-input" className="sr-only">Message your tutor</label>
            <input
              id="tutor-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? "Listening… speak now" : "Ask a question or explain your thinking…"}
              maxLength={4000}
              autoComplete="off"
              className="flex-1 px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background-secondary))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
            />
            {streaming ? (
              <button type="button" onClick={() => abortRef.current?.abort()} aria-label="Stop answer" className="p-3 rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">
                <Square className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="p-3 rounded-xl bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
