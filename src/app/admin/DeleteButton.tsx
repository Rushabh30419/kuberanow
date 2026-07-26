"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  action: (id: string) => Promise<{ ok: boolean; error?: string }>;
  label?: string;
};

export default function DeleteButton({ id, action, label = "Delete" }: Props) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Are you sure? This cannot be undone.")) return;
        start(async () => {
          const res = await action(id);
          if (res.ok) router.refresh();
          else alert(res.error ?? "Delete failed.");
        });
      }}
      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
