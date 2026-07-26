"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { saveCalculation } from "@/lib/actions";
import type { CalculationType } from "@/lib/types";

type Props = {
  type: CalculationType;
  inputs: Record<string, unknown>;
  result: Record<string, unknown>;
  label?: string;
};

export function SaveCalcButton({ type, inputs, result, label }: Props) {
  const { data: session } = useSession();
  const [pending, start] = useTransition();
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");

  if (!session) {
    return (
      <p className="text-xs text-slate-500">
        <a href="/login?callbackUrl=/tools" className="text-blue-700 hover:underline">
          Sign in
        </a>{" "}
        to save this calculation
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await saveCalculation(type, inputs, result, label);
            setState(res.ok ? "saved" : "error");
          })
        }
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save calculation"}
      </button>
      {state === "saved" && (
        <span className="text-xs text-green-700">✓ Saved to your dashboard</span>
      )}
      {state === "error" && (
        <span className="text-xs text-red-700">Could not save — try again.</span>
      )}
    </div>
  );
}
