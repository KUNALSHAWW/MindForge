import { listDocuments } from "@/lib/actions/knowledge";
import ForgeClient from "./ForgeClient";

export const metadata = {
  title: "Knowledge Forge",
  description: "Upload your notes so tutors answer from your own material, with citations",
};

export default async function ForgePage() {
  const result = await listDocuments();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Knowledge Forge</h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          Add class notes, a syllabus or a chapter summary. Every companion for that subject retrieves the most relevant passages
          and cites them as [1], [2] in its answers, so you can check where an explanation came from.
        </p>
      </div>
      {result.success ? (
        <ForgeClient key={result.data.documents.length} {...result.data} />
      ) : (
        <p className="text-sm text-[hsl(var(--error))]">{result.error}</p>
      )}
    </div>
  );
}
