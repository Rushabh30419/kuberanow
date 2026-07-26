"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Inbox, Mail, Loader2 } from "lucide-react";
import { markApplicationRead, markApplicationUnread } from "@/lib/actions";

type Props = {
  id: string;
  read: boolean;
};

export default function ApplicationReadToggle({ id, read }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [optimistic, setOptimistic] = useState(read);
  const isRead = optimistic;

  const onClick = () => {
    const next = !isRead;
    setOptimistic(next);
    start(async () => {
      const res = next ? await markApplicationRead(id) : await markApplicationUnread(id);
      if (!res.ok) {
        setOptimistic(read);
        alert((res as { error?: string }).error ?? "Could not update application status.");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={onClick}
      aria-pressed={isRead}
      title={isRead ? "Click to mark as unread" : "Click to mark as read"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
        isRead
          ? "border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300"
          : "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300"
      }`}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : isRead ? (
        <Inbox className="size-3.5" />
      ) : (
        <Mail className="size-3.5" />
      )}
      {isRead ? "Read" : "Unread"}
    </button>
  );
}
