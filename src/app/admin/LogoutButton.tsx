"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/app/auth-actions";

export function LogoutButton() {
  const [pending, start] = useTransition();
  return (
    <form action={() => start(async () => { await logout(); })} className="px-3">
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-left text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
      >
        <LogOut className="size-4" />
        {pending ? "Signing out…" : "Sign out"}
      </button>
    </form>
  );
}
