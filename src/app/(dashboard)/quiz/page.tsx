import { getQuizOverview } from "@/lib/actions/quiz";
import QuizClient from "./QuizClient";

export const metadata = {
  title: "Quiz",
  description: "Retrieval practice generated from your own notes, graded against the source",
};

export default async function QuizPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const [{ subject }, overview] = await Promise.all([searchParams, getQuizOverview()]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Quiz</h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          Questions are written from your uploaded notes and every answer is graded against the passage it came from.
          Anything you miss is added to your review queue.
        </p>
      </div>
      {overview.success ? (
        <QuizClient overview={overview.data} initialSubject={subject} />
      ) : (
        <p className="text-sm text-[hsl(var(--error))]">{overview.error}</p>
      )}
    </div>
  );
}
