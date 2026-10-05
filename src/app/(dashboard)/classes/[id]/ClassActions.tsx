"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteClassroom, leaveClassroom, removeStudent } from "@/lib/actions/classroom";

export default function ClassActions({
  classroomId,
  isOwner,
  removeStudentId,
  studentName,
}: {
  classroomId: string;
  isOwner: boolean;
  removeStudentId?: string;
  studentName?: string;
}) {
  const router = useRouter();
  const subtle = "text-sm px-3 py-1.5 rounded-lg text-[hsl(var(--foreground-muted))] hover:text-red-500 hover:bg-red-500/10";

  if (removeStudentId) {
    return (
      <button
        className={subtle}
        onClick={async () => {
          if (!confirm(`Remove ${studentName} from this class?`)) return;
          const r = await removeStudent(classroomId, removeStudentId);
          if (!r.success) return toast.error(r.error);
          router.refresh();
        }}
      >
        Remove
      </button>
    );
  }

  return (
    <button
      className={`${subtle} border border-[hsl(var(--border))]`}
      onClick={async () => {
        if (!confirm(isOwner ? "Delete this class for everyone?" : "Leave this class?")) return;
        const r = isOwner ? await deleteClassroom(classroomId) : await leaveClassroom(classroomId);
        if (!r.success) return toast.error(r.error);
        router.push("/classes");
      }}
    >
      {isOwner ? "Delete class" : "Leave class"}
    </button>
  );
}
