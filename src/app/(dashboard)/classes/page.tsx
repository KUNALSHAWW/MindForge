import { listClassrooms } from "@/lib/actions/classroom";
import ClassesClient from "./ClassesClient";

export const metadata = {
  title: "Classes",
  description: "Teach a class or join one with a code",
};

export default async function ClassesPage() {
  const result = await listClassrooms();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Classes</h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          Teachers create a class and share its code. Students who join share progress summaries (activity, recall, quiz
          scores) with the teacher. Conversations and notes stay private.
        </p>
      </div>
      {result.success ? <ClassesClient key={result.data.classes.length} {...result.data} /> : <p className="text-sm text-[hsl(var(--error))]">{result.error}</p>}
    </div>
  );
}
