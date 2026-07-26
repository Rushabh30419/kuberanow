/**
 * The canonical permission catalog.
 *
 * Each entry is checked in code via requirePermission(key) / hasPermission().
 * The same list is seeded into the Permission table by prisma/seed.ts —
 * admins can then toggle which roles hold which permission, but they cannot
 * invent new keys (those are code-defined, which is correct: a permission
 * only means something if the code actually checks for it).
 */
export type PermissionDef = {
  key: string;
  label: string;
  description: string;
  category: string;
};

export const PERMISSIONS: PermissionDef[] = [
  // Dashboard
  { key: "dashboard.view", label: "View dashboard", description: "Access the admin dashboard overview", category: "Dashboard" },

  // Articles
  { key: "articles.view", label: "View articles", description: "See the articles list", category: "Articles" },
  { key: "articles.create", label: "Create articles", description: "Create new articles", category: "Articles" },
  { key: "articles.edit", label: "Edit articles", description: "Edit any article", category: "Articles" },
  { key: "articles.delete", label: "Delete articles", description: "Delete articles", category: "Articles" },
  { key: "articles.publish", label: "Publish articles", description: "Change status to published", category: "Articles" },

  // Jobs
  { key: "jobs.view", label: "View jobs", description: "See the jobs list", category: "Jobs" },
  { key: "jobs.create", label: "Create jobs", description: "Create new job openings", category: "Jobs" },
  { key: "jobs.edit", label: "Edit jobs", description: "Edit job openings", category: "Jobs" },
  { key: "jobs.delete", label: "Delete jobs", description: "Delete job openings", category: "Jobs" },

  // Market data
  { key: "market.view", label: "View market data", description: "See market quotes", category: "Market data" },
  { key: "market.edit", label: "Edit market data", description: "Update prices and volumes", category: "Market data" },

  // Applications & contact
  { key: "applications.view", label: "View applications", description: "See job applications", category: "Recruitment" },
  { key: "contact.view", label: "View messages", description: "See contact form submissions", category: "Recruitment" },

  // Users
  { key: "users.view", label: "View users", description: "See the users list", category: "Users & roles" },
  { key: "users.create", label: "Create users", description: "Invite new users", category: "Users & roles" },
  { key: "users.edit", label: "Edit users", description: "Edit user details and reset passwords", category: "Users & roles" },
  { key: "users.delete", label: "Delete users", description: "Delete users", category: "Users & roles" },
  { key: "users.assignRole", label: "Assign roles", description: "Change a user's role", category: "Users & roles" },

  // Roles & permissions
  { key: "roles.view", label: "View roles", description: "See roles and their permissions", category: "Users & roles" },
  { key: "roles.create", label: "Create roles", description: "Create new roles", category: "Users & roles" },
  { key: "roles.edit", label: "Edit roles", description: "Edit role permissions", category: "Users & roles" },
  { key: "roles.delete", label: "Delete roles", description: "Delete custom roles", category: "Users & roles" },

  // Settings
  { key: "settings.view", label: "View settings", description: "See site settings", category: "Settings" },
  { key: "settings.edit", label: "Edit settings", description: "Update site-wide settings", category: "Settings" },
];

/** All keys, as a Set for O(1) lookups. */
export const PERMISSION_KEYS = new Set(PERMISSIONS.map((p) => p.key));

/** Group the catalog by category (for the matrix editor UI). */
export function permissionsByCategory(): Record<string, PermissionDef[]> {
  const out: Record<string, PermissionDef[]> = {};
  for (const p of PERMISSIONS) {
    (out[p.category] ??= []).push(p);
  }
  return out;
}

/** Permission keys granted to the seeded Admin role (everything). */
export const ADMIN_PERMISSIONS = PERMISSIONS.map((p) => p.key);

/** Permission keys granted to the seeded Editor role (content only). */
export const EDITOR_PERMISSIONS = [
  "dashboard.view",
  "articles.view",
  "articles.create",
  "articles.edit",
  "articles.delete",
  "articles.publish",
  "jobs.view",
  "jobs.create",
  "jobs.edit",
  "jobs.delete",
  "market.view",
  "market.edit",
];
