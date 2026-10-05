"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, Plus, Heart, Clock, MessageSquare, Search } from "lucide-react";
import { getCompanions, toggleBookmark, type CompanionWithStats } from "@/lib/actions/companion";
import { SUBJECTS as ALL_SUBJECTS, subjectLabel } from "@/lib/subjects";

const SUBJECTS = [{ value: "all", label: "All" }, ...ALL_SUBJECTS];

export default function CompanionsPageClient() {
  const searchParams = useSearchParams();
  const [companions, setCompanions] = useState<CompanionWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  // Server-side search, debounced so typing doesn't fire a query per keystroke.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const result = await getCompanions({ subject: filter, search });
      if (cancelled) return;
      if (result.success) {
        setCompanions(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    }, search ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [filter, search]);

  const handleBookmark = async (companionId: string) => {
    const result = await toggleBookmark(companionId);
    if (!result.success) return toast.error(result.error);
    setCompanions((prev) => prev.map((c) => (c.id === companionId ? { ...c, isBookmarked: result.data.isBookmarked } : c)));
    for (const a of result.newAchievements ?? []) toast.success(`Achievement unlocked: ${a}`);
  };

  const filteredCompanions = companions;

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
            <label htmlFor="companion-search" className="sr-only">Search companions</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--foreground-muted))]" />
            <input
              id="companion-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-subtle))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
            />
          </div>
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                    {subjectLabel(companion.subject)}
                  </span>
                </div>
                <button
                  onClick={() => handleBookmark(companion.id)}
                  aria-label={companion.isBookmarked ? "Remove bookmark" : "Bookmark companion"}
                  aria-pressed={companion.isBookmarked}
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
