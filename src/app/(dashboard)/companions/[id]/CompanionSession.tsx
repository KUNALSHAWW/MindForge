"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  Clock,
  MessageSquare,
  BookOpen,
  Sparkles,
  Send,
  Heart,
  Share2,
  MoreVertical,
} from "lucide-react";
import { toggleBookmark, type CompanionWithStats } from "@/lib/actions/companion";
import { createSession } from "@/lib/actions/session";

interface Props {
  companion: CompanionWithStats;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function CompanionSession({ companion }: Props) {
  const router = useRouter();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(companion.isBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Session timer
  useEffect(() => {
    if (isSessionActive) {
      timerRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startSession = () => {
    setIsSessionActive(true);
    setSessionTime(0);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm ${companion.name}, your ${companion.style} tutor for ${companion.topic}. I'm here to help you learn and understand ${companion.subject}. What would you like to explore today?`,
        timestamp: new Date(),
      },
    ]);
  };

  const endSession = useCallback(async () => {
    if (sessionTime < 60) {
      // Less than 1 minute, just end without saving
      setIsSessionActive(false);
      setMessages([]);
      setSessionTime(0);
      return;
    }

    setIsSaving(true);
    try {
      // Create transcript from messages
      const transcript = messages
        .map((m) => `${m.role === "user" ? "User" : companion.name}: ${m.content}`)
        .join("\n\n");

      await createSession({
        companionId: companion.id,
        durationMinutes: Math.ceil(sessionTime / 60),
        transcript,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save session:", error);
    } finally {
      setIsSaving(false);
      setIsSessionActive(false);
    }
  }, [sessionTime, messages, companion, router]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call the actual AI service)
    setTimeout(() => {
      const responses = getContextualResponse(inputMessage.trim(), companion);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleBookmark = async () => {
    const result = await toggleBookmark(companion.id);
    if (result.success) {
      setIsBookmarked(result.isBookmarked ?? false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
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
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked 
                ? "text-red-500 bg-red-500/10" 
                : "text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--muted))]"
            }`}
          >
            <Heart className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
          <button className="p-2 rounded-lg text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--muted))] transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--muted))] transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Companion Info Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)] flex items-center justify-center text-white text-3xl">
            {getSubjectEmoji(companion.subject)}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              {companion.name}
            </h1>
            <p className="text-sm text-[hsl(var(--foreground-muted))] mb-3">
              {companion.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                <BookOpen className="w-3 h-3" />
                {companion.subject}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground-muted))]">
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

      {/* Session Area */}
      {!isSessionActive ? (
        <div className="card p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-[hsl(var(--primary))]" />
          </div>
          <h2 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
            Ready to Learn?
          </h2>
          <p className="text-[hsl(var(--foreground-muted))] mb-6 max-w-md mx-auto">
            Start a conversation with {companion.name} about {companion.topic}. 
            You can ask questions, discuss concepts, or practice what you&apos;ve learned.
          </p>
          <button
            onClick={startSession}
            className="px-8 py-4 rounded-xl bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary)/0.9)] transition-colors flex items-center gap-3 mx-auto"
          >
            <Phone className="w-5 h-5" />
            Start Session
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Session Header */}
          <div className="p-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--background-secondary))] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--success)/0.1)] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">Session Active</p>
                <p className="text-sm text-[hsl(var(--foreground-muted))]">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {formatTime(sessionTime)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-lg transition-colors ${
                  isMuted 
                    ? "bg-red-500/10 text-red-500" 
                    : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground-muted))]"
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`p-2 rounded-lg transition-colors ${
                  !isSpeakerOn 
                    ? "bg-red-500/10 text-red-500" 
                    : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground-muted))]"
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={endSession}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
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

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-[hsl(var(--primary))] text-white"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === "user" ? "text-white/70" : "text-[hsl(var(--foreground-muted))]"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[hsl(var(--muted))] rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--foreground-muted))] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--foreground-muted))] animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--foreground-muted))] animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background-secondary))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 rounded-xl bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get emoji for subject
function getSubjectEmoji(subject: string): string {
  const emojis: Record<string, string> = {
    maths: "📐",
    mathematics: "📐",
    science: "🔬",
    physics: "⚛️",
    chemistry: "🧪",
    biology: "🧬",
    coding: "💻",
    programming: "💻",
    history: "📜",
    language: "🗣️",
    economics: "📊",
    philosophy: "🤔",
    art: "🎨",
    music: "🎵",
  };
  return emojis[subject.toLowerCase()] || "📚";
}

// Helper function to generate contextual responses
function getContextualResponse(message: string, companion: CompanionWithStats): string {
  const lowerMessage = message.toLowerCase();
  
  // Style-based response prefixes
  const styleResponses: Record<string, string[]> = {
    formal: [
      "An excellent question. ",
      "Let me explain this concept thoroughly. ",
      "This is a fundamental topic. ",
      "Allow me to elaborate. ",
    ],
    casual: [
      "Great question! ",
      "Oh, that's interesting! ",
      "Let me break this down for you. ",
      "Here's the thing - ",
    ],
    socratic: [
      "What do you think would happen if...? ",
      "Let's explore this together. ",
      "Consider this: ",
      "That's a thought-provoking question. ",
    ],
    storytelling: [
      "Let me tell you a story about this... ",
      "Imagine you're in a world where... ",
      "Picture this scenario: ",
      "Here's an interesting tale about this concept. ",
    ],
  };

  const prefix = styleResponses[companion.style]?.[Math.floor(Math.random() * 4)] || "";

  // Topic-based responses
  if (lowerMessage.includes("what is") || lowerMessage.includes("explain")) {
    return `${prefix}${companion.topic} is a fascinating area within ${companion.subject}. It encompasses several key concepts that build upon each other. The fundamental idea is to understand how different elements interact and influence outcomes. Would you like me to elaborate on any specific aspect?`;
  }

  if (lowerMessage.includes("how") || lowerMessage.includes("why")) {
    return `${prefix}That's getting to the heart of ${companion.topic}! The reason behind this relates to the underlying principles of ${companion.subject}. When we examine the cause and effect relationships, we can see patterns emerge. Let me walk you through the process step by step...`;
  }

  if (lowerMessage.includes("example") || lowerMessage.includes("practice")) {
    return `${prefix}Here's a practical example to illustrate this concept in ${companion.topic}. Imagine a scenario where you need to apply these principles. First, identify the key variables. Then, consider how they relate to each other. Finally, work through the solution methodically. Would you like to try a practice problem?`;
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("stuck") || lowerMessage.includes("confused")) {
    return `${prefix}Don't worry, ${companion.topic} can be challenging at first. Let's take a step back and approach this differently. What specifically is causing confusion? Sometimes breaking down the problem into smaller parts makes it more manageable. I'm here to guide you through it.`;
  }

  if (lowerMessage.includes("test") || lowerMessage.includes("quiz") || lowerMessage.includes("assess")) {
    return `${prefix}Let's test your understanding of ${companion.topic}! Here's a question for you: Based on what we've discussed, can you explain the main concept in your own words? This will help solidify your learning and identify any gaps we need to address.`;
  }

  // Default response
  return `${prefix}That's a great point about ${companion.topic}. In ${companion.subject}, understanding these nuances is crucial. Let me share some additional insights that might help deepen your understanding. The key is to see how each piece connects to the bigger picture. What aspect would you like to explore further?`;
}
