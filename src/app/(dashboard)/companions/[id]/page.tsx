import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCompanion } from "@/lib/actions/companion";
import CompanionSession from "./CompanionSession";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const result = await getCompanion(id);
  
  if (!result.success || !result.data) {
    return { title: "Companion Not Found | MindForge" };
  }

  return {
    title: `${result.data.name} | MindForge`,
    description: result.data.description,
  };
}

function SessionSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-8 w-32 bg-[hsl(var(--muted))] rounded mb-8" />
      <div className="card p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--muted))]" />
          <div className="space-y-3">
            <div className="h-6 w-48 bg-[hsl(var(--muted))] rounded" />
            <div className="h-4 w-32 bg-[hsl(var(--muted))] rounded" />
          </div>
        </div>
        <div className="h-64 bg-[hsl(var(--muted))] rounded-lg" />
      </div>
    </div>
  );
}

async function CompanionContent({ id }: { id: string }) {
  const result = await getCompanion(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <CompanionSession companion={result.data} />;
}

export default async function CompanionPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense fallback={<SessionSkeleton />}>
      <CompanionContent id={id} />
    </Suspense>
  );
}
