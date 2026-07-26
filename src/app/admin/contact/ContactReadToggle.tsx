"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Loader2 } from "lucide-react";
import { markContactRead, markContactUnread } from "@/lib/actions";

type Props = {
  id: string;
  read: boolean;
  /** When true, only render the read state (no toggle button). */
  readOnly?: boolean;
  /** When true, show a denser, label-less icon button. */
  compact?: boolean;
};

export default function ContactReadToggle({ id, read, readOnly, compact }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [optimistic, setOptimistic] = useState(read);
  const isRead = optimistic;

  if (readOnly) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
          isRead ? "text-slate-500" : "text-blue-700"
        }`}
      >
        {isRead ? <MailOpen className="size-3.5" /> : <Mail className="size-3.5" />}
        {isRead ? "Read" : "Unread"}
      </span>
    );
  }

  const onClick = () => {
    const next = !isRead;
    setOptimistic(next);
    start(async () => {
      const res = next ? await markContactRead(id) : await markContactUnread(id);
      if (!res.ok) {
        setOptimistic(read);
        alert((res as { error?: string }).error ?? "Could not update message status.");
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
        <MailOpen className="size-3.5" />
      ) : (
        <Mail className="size-3.5" />
      )}
      {compact ? null : isRead ? "Read" : "Unread"}
    </button>
  );
}
