"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import Link from "next/link";
import { BookOpen, Plus, Heart, Clock, MessageSquare, Search } from "lucide-react";
import { getCompanions, toggleBookmark, type CompanionWithStats } from "@/lib/actions/companion";

const SUBJECTS = [
  { value: "all", label: "All" },
  { value: "maths", label: "Maths" },
  { value: "science", label: "Science" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "coding", label: "Coding" },
  { value: "history", label: "History" },
  { value: "language", label: "Language" },
  { value: "economics", label: "Economics" },
];

export default function CompanionsPageClient() {
  const [companions, setCompanions] = useState<CompanionWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadCompanions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getCompanions({ 
        subject: filter === "all" ? undefined : filter,
        search: search || undefined,
      });
      
      if (result.success && result.data) {
        setCompanions(result.data);
      } else {
        setError(result.error || "Failed to load companions");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    loadCompanions();
  }, [loadCompanions]);

  const handleSearch = () => {
    startTransition(() => {
      loadCompanions();
    });
  };

  const handleBookmark = async (companionId: string) => {
    const result = await toggleBookmark(companionId);
    if (result.success) {
      setCompanions(prev => 
        prev.map(c => 
          c.id === companionId 
            ? { ...c, isBookmarked: result.isBookmarked ?? false }
            : c
        )
      );
    }
  };

  const filteredCompanions = search
    ? companions.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.topic.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      )
    : companions;

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
            Learning Companions
          </h1>
          <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
            Choose from AI tutors or create your own personalized companion
          </p>
        </div>
        <Link 
          href="/companions/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary)/0.9)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Companion
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--foreground-muted))]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search companions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isPending}
            className="px-4 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50 transition-colors"
          >
            {isPending ? "..." : "Search"}
          </button>
        </div>

        {/* Subject Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.value}
              onClick={() => setFilter(subject.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === subject.value
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--border))]"
              }`}
            >
              {subject.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-[hsl(var(--error)/0.1)] border border-[hsl(var(--error)/0.3)] rounded-lg text-[hsl(var(--error))] text-sm mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-[hsl(var(--muted))] rounded" />
                  <div className="h-4 w-20 bg-[hsl(var(--muted))] rounded" />
                </div>
                <div className="w-8 h-8 bg-[hsl(var(--muted))] rounded" />
              </div>
              <div className="h-4 w-full bg-[hsl(var(--muted))] rounded mb-4" />
              <div className="h-4 w-24 bg-[hsl(var(--muted))] rounded mb-6" />
              <div className="h-10 w-full bg-[hsl(var(--muted))] rounded" />
            </div>
          ))}
        </div>
      ) : filteredCompanions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[hsl(var(--foreground-muted))]" />
          </div>
          <h3 className="text-lg font-medium text-[hsl(var(--foreground))] mb-2">
            No companions found
          </h3>
          <p className="text-[hsl(var(--foreground-muted))] mb-4">
            {search 
              ? "Try adjusting your search or filters"
              : "Be the first to create a companion for this subject!"}
          </p>
          <Link
            href="/companions/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary)/0.9)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Companion
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanions.map((companion) => (
            <div key={companion.id} className="card p-6 hover:border-[hsl(var(--primary)/0.3)] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                    {companion.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] capitalize">
                    {companion.subject}
                  </span>
                </div>
                <button 
                  onClick={() => handleBookmark(companion.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    companion.isBookmarked
                      ? "text-red-500 bg-red-500/10"
                      : "text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--muted))]"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${companion.isBookmarked ? "fill-current" : ""}`} />
                </button>
              </div>
              
              <p className="text-sm text-[hsl(var(--foreground-muted))] mb-2 line-clamp-1">
                {companion.topic}
              </p>
              <p className="text-sm text-[hsl(var(--foreground-muted))] mb-4 line-clamp-2">
                {companion.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-[hsl(var(--foreground-subtle))] mb-4">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {companion.duration} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {companion.sessionsCount} sessions
                </span>
              </div>
              
              <Link
                href={`/companions/${companion.id}`}
                className="w-full py-2.5 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary)/0.9)] transition-colors flex items-center justify-center gap-2"
              >
                Start Session
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
