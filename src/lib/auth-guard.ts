import { redirect } from "next/navigation";
import { auth } from "./auth";
import type { UserRole } from "./types";

/**
 * Get the current session, or null if unauthenticated. Safe to call from
 * any server component / server action.
 */
export async function currentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Require any authenticated user. Redirects to /login if not signed in.
 */
export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Require a role at or above `editor`. Redirects readers away.
 * Use this to protect admin routes that editors may access.
 */
export async function requireEditor() {
  const user = await requireUser();
  if (user.role === "reader") redirect("/dashboard");
  return user as { id: string; role: UserRole; name?: string | null; email?: string | null };
}

/**
 * Require the `admin` role. Editors are redirected to /admin with an error.
 * Use this to protect admin-only routes (users, applications, settings).
 */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user as { id: string; role: UserRole; name?: string | null; email?: string | null };
}
