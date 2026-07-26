"use client";

import { useTransition } from "react";
import { logout } from "@/app/auth-actions";

export default function LogoutButton() {
  const [pending, start] = useTransition();
  return (
    <form
      action={() => start(async () => { await logout(); })}
      className="px-3"
    >
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/20 hover:text-white disabled:opacity-60"
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
    </form>
  );
}
