"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { markContactRead } from "@/lib/actions";

type Props = {
  /** Message id to mark as read. */
  id: string;
  /** Only fire when true; set to false after the first successful mark. */
  enabled: boolean;
};

/**
 * Marks a contact message as read once, when this client component mounts.
 * Kept off the server-rendered path because `revalidatePath` is not allowed
 * during a server render.
 */
export default function MarkAsReadOnMount({ id, enabled }: Props) {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (!enabled || fired.current) return;
    fired.current = true;
    let cancelled = false;
    (async () => {
      const res = await markContactRead(id);
      if (!cancelled && res.ok) router.refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [id, enabled, router]);

  return null;
}
