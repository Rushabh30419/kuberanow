import { currentUser } from "./auth-guard";
import { getUserPermissions } from "./data-access";

/**
 * Server-action auth helper. Unlike the require* guards (which redirect),
 * this returns a typed result so actions can return { ok: false, error } to
 * the form. Reads permissions live from the DB so role changes take effect
 * immediately (the JWT may be stale for up to session length).
 */
export type ActionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
};

export async function getActionUser(): Promise<ActionUser | null> {
  return await currentUser();
}

/**
 * Returns the user if they hold the given permission, else null.
 * Caller should return { ok: false, error: "Not authorized." } when null.
 */
export async function getAuthorizedUser(permission: string): Promise<ActionUser | null> {
  const user = await currentUser();
  if (!user) return null;
  const perms = await getUserPermissions(user.id);
  if (!perms.includes(permission)) return null;
  return user;
}
