"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Props = {
  id: string;
  action: (id: string) => Promise<{ ok: boolean; error?: string }>;
  message?: string;
  label?: string;
};

export default function DeleteButton({ id, action, message, label = "Delete" }: Props) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(message ?? "Are you sure? This cannot be undone.")) return;
        start(async () => {
          const res = await action(id);
          if (res.ok) router.refresh();
          else alert((res as { error?: string }).error ?? "Delete failed.");
        });
      }}
      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
    >
      <Trash2 className="size-3.5" />
      {pending ? "Deleting…" : label}
    </button>
  );
}
