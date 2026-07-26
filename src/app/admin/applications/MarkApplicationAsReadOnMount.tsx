"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { markApplicationRead } from "@/lib/actions";

type Props = {
  id: string;
  enabled: boolean;
};

export default function MarkApplicationAsReadOnMount({ id, enabled }: Props) {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (!enabled || fired.current) return;
    fired.current = true;
    let cancelled = false;
    (async () => {
      const res = await markApplicationRead(id);
      if (!cancelled && res.ok) router.refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [id, enabled, router]);

  return null;
}
