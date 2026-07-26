"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toggleJobActive } from "@/lib/actions";

type Props = {
  id: string;
  active: boolean;
  title: string;
};

export default function JobActiveToggle({ id, active, title }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [optimistic, setOptimistic] = useState(active);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const next = !optimistic;
        setOptimistic(next);
        start(async () => {
          const res = await toggleJobActive(id);
          if (!res.ok) {
            setOptimistic(active); // revert
            alert((res as { error?: string }).error ?? "Could not update job status.");
          } else {
            router.refresh();
          }
        });
      }}
      aria-pressed={optimistic}
      aria-label={`${optimistic ? "Hide" : "Publish"} ${title} on the public careers page`}
      title={optimistic ? "Click to hide from the public careers page" : "Click to publish on the public careers page"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
        optimistic
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300"
          : "border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300"
      }`}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : optimistic ? (
        <Eye className="size-3.5" />
      ) : (
        <EyeOff className="size-3.5" />
      )}
      {optimistic ? "Active" : "Hidden"}
    </button>
  );
}
