"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Loader2 } from "lucide-react";
import { markAllApplicationRead } from "@/lib/actions";

type Props = {
  disabled?: boolean;
};

export default function MarkAllApplicationRead({ disabled }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [optimisticDisabled, setOptimisticDisabled] = useState(disabled);

  return (
    <button
      type="button"
      disabled={pending || optimisticDisabled}
      onClick={() => {
        if (!confirm("Mark every application as read? This cannot be undone.")) return;
        setOptimisticDisabled(true);
        start(async () => {
          const res = await markAllApplicationRead();
          if (!res.ok) {
            setOptimisticDisabled(disabled ?? false);
            alert((res as { error?: string }).error ?? "Could not mark applications as read.");
          } else {
            router.refresh();
          }
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCheck className="size-3.5" />}
      {pending ? "Marking…" : "Mark all as read"}
    </button>
  );
}
