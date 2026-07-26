import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./db";
import { getUserPermissions } from "./data-access";

/**
 * Get the current session's user, or null. Safe to call from any server
 * component / server action.
 */
export async function currentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Require any authenticated user. Redirects to /login if not signed in.
 * Returns the session user (id, role, name, email).
 */
export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Require the named permission. Loads the user's role permissions from the DB
 * and redirects to /admin if missing. Use this in server components/pages.
 *
 * Example: await requirePermission("users.edit")
 */
export async function requirePermission(key: string) {
  const user = await requireUser();
  const perms = await getUserPermissions(user.id);
  if (!perms.includes(key)) {
    redirect("/admin");
  }
  return user;
}

/**
 * Convenience: require the dashboard (any admin) view permission. Anyone who
 * can see the dashboard can be in /admin at all.
 */
export async function requireEditor() {
  return requirePermission("dashboard.view");
}

/**
 * Convenience: require admin-level access. Treated as "users & roles" manage
 * permission since that's the most privileged seeded capability.
 */
export async function requireAdmin() {
  return requirePermission("roles.view");
}
