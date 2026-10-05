import { getReviewQueue } from "@/lib/actions/review";
import { getProfileAndSettings } from "@/lib/actions/settings";
import { DEFAULT_SETTINGS } from "@/lib/validators";
import ReviewClient from "./ReviewClient";

export const metadata = {
  title: "Review",
  description: "Spaced-repetition review scheduled with FSRS-4.5",
};

export default async function ReviewPage() {
  const [queue, prefs] = await Promise.all([getReviewQueue(), getProfileAndSettings()]);
  const goal = prefs.success ? prefs.data.settings.learning.dailyReviewGoal : DEFAULT_SETTINGS.learning.dailyReviewGoal;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Review</h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          Cards come back right before you are likely to forget them. Rate honestly: the scheduler (FSRS-4.5) learns how well you know each one.
        </p>
      </div>
      {queue.success ? (
        <ReviewClient key={queue.data.totalCards} queue={queue.data} dailyGoal={goal} />
      ) : (
        <p className="text-sm text-[hsl(var(--error))]">{queue.error}</p>
      )}
    </div>
  );
}
