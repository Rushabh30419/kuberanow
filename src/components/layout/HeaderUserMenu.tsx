"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

/**
 * Compact auth-aware link shown in the header.
 * - Logged out: "Sign in" link to /login
 * - Reader: "Dashboard" link
 * - Admin/Editor: "Admin" link
 */
export function HeaderUserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-xs text-white/40">…</span>;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="rounded-md px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        Sign in
      </Link>
    );
  }

  const href = session.user.role === "reader" ? "/dashboard" : "/admin";
  const label = session.user.role === "reader" ? "Dashboard" : "Admin";

  return (
    <Link
      href={href}
      className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
    >
      {label}
    </Link>
  );
}
