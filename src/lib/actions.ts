"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { currentUser } from "./auth-guard";
import { getAuthorizedUser } from "./auth-action";
import type { CalculationType } from "./types";
import { PERMISSION_KEYS } from "./permissions";

const NOT_AUTHORIZED = { ok: false as const, error: "Not authorized." };

// ─── Public: Contact form ────────────────────────────────────────────────

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { ok: false, error: "All fields are required." };
  }

  await prisma.contactSubmission.create({ data: { name, email, subject, message } });
  revalidatePath("/admin/contact");
  return { ok: true };
}

// ─── User-scoped: Job application ────────────────────────────────────────

export async function applyForJob(formData: FormData) {
  const user = await currentUser();

  const jobId = String(formData.get("jobId") ?? "");
  const name = String(formData.get("name") ?? "").trim() || user?.name || "";
  const email = String(formData.get("email") ?? "").toLowerCase().trim() || user?.email || "";
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const coverLetter = String(formData.get("coverLetter") ?? "").trim() || null;

  if (!jobId || !name || !email) {
    return { ok: false, error: "Job, name, and email are required." };
  }

  await prisma.application.create({
    data: { jobId, userId: user?.id, name, email, phone, coverLetter },
  });
  revalidatePath("/admin/applications");
  revalidatePath("/dashboard");
  return { ok: true };
}

// ─── User-scoped: Saved calculations ─────────────────────────────────────

export async function saveCalculation(
  type: CalculationType,
  inputs: Record<string, unknown>,
  result: Record<string, unknown>,
  label?: string
) {
  const user = await currentUser();
  if (!user) return { ok: false, error: "You must be signed in to save." };

  await prisma.savedCalculation.create({
    data: {
      userId: user.id,
      type,
      inputs: JSON.stringify(inputs),
      result: JSON.stringify(result),
      label,
    },
  });
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteSavedCalculation(id: string) {
  const user = await currentUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const calc = await prisma.savedCalculation.findUnique({ where: { id } });
  if (!calc || calc.userId !== user.id) return { ok: false, error: "Not found." };

  await prisma.savedCalculation.delete({ where: { id } });
  revalidatePath("/dashboard");
  return { ok: true };
}

// ─── Admin: Articles ─────────────────────────────────────────────────────

export async function upsertArticle(formData: FormData) {
  const id = String(formData.get("id") || "");
  // Create vs edit need different permissions.
  const user = await getAuthorizedUser(id ? "articles.edit" : "articles.create");
  if (!user) return NOT_AUTHORIZED;

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const author = String(formData.get("author") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");

  // Publishing requires the publish permission
  if (status === "published") {
    const canPublish = await getAuthorizedUser("articles.publish");
    if (!canPublish) return { ok: false, error: "You don't have permission to publish." };
  }

  if (!title || !excerpt || !body || !categorySlug || !author) {
    return { ok: false, error: "Title, excerpt, body, category, and author are required." };
  }

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return { ok: false, error: "Category not found." };

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (id) {
    await prisma.article.update({
      where: { id },
      data: { title, slug, excerpt, body, imageUrl, categoryId: category.id, author, status },
    });
  } else {
    await prisma.article.create({
      data: { title, slug, excerpt, body, imageUrl, categoryId: category.id, author, status },
    });
  }

  revalidatePath("/admin/articles");
  revalidatePath("/news");
  return { ok: true };
}

export async function deleteArticle(id: string) {
  const user = await getAuthorizedUser("articles.delete");
  if (!user) return NOT_AUTHORIZED;
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/news");
  return { ok: true };
}

// ─── Admin: Jobs ─────────────────────────────────────────────────────────

export async function upsertJob(formData: FormData) {
  const id = String(formData.get("id") || "");
  const user = await getAuthorizedUser(id ? "jobs.edit" : "jobs.create");
  if (!user) return NOT_AUTHORIZED;

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();
  const salary = String(formData.get("salary") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const type = String(formData.get("type") ?? "Full-time");
  const mode = String(formData.get("mode") ?? "On-site");
  const active = formData.get("active") === "on";

  if (!title) return { ok: false, error: "Title is required." };

  const data = { title, description, experience, salary, location, type, mode, active };
  if (id) {
    await prisma.job.update({ where: { id }, data });
  } else {
    await prisma.job.create({ data });
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/career");
  return { ok: true };
}

export async function deleteJob(id: string) {
  const user = await getAuthorizedUser("jobs.delete");
  if (!user) return NOT_AUTHORIZED;
  await prisma.job.delete({ where: { id } });
  revalidatePath("/admin/jobs");
  revalidatePath("/career");
  return { ok: true };
}

// ─── Admin: Market quotes ────────────────────────────────────────────────

export async function updateMarketQuote(id: string, data: { price: number; change: number; volume?: string }) {
  const user = await getAuthorizedUser("market.edit");
  if (!user) return NOT_AUTHORIZED;
  await prisma.marketQuote.update({
    where: { id },
    data: { price: data.price, change: data.change, volume: data.volume ?? null },
  });
  revalidatePath("/market");
  revalidatePath("/admin/market");
  return { ok: true };
}

// ─── Admin: Users ────────────────────────────────────────────────────────

export async function upsertUser(formData: FormData) {
  const id = String(formData.get("id") || "");
  const user = await getAuthorizedUser(id ? "users.edit" : "users.create");
  if (!user) return NOT_AUTHORIZED;

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const roleId = String(formData.get("roleId") ?? "") || null;

  if (!email) return { ok: false, error: "Email is required." };

  // Role assignment needs the separate users.assignRole permission
  if (roleId) {
    const canAssign = await getAuthorizedUser("users.assignRole");
    if (!canAssign) return { ok: false, error: "You can't assign roles." };
  }

  // Resolve the legacy role string from the chosen Role (for the JWT/proxy)
  let legacyRole = "reader";
  if (roleId) {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) return { ok: false, error: "Role not found." };
    legacyRole = role.name === "Admin" ? "admin" : role.name === "Editor" ? "editor" : "reader";
  }

  const data: { name: string; email: string; roleId: string | null; role: string; passwordHash?: string } = {
    name,
    email,
    roleId,
    role: legacyRole,
  };
  if (password) {
    data.passwordHash = await bcrypt.hash(password, 12);
  }

  if (id) {
    // Don't allow editing your own role (avoid self-lockout)
    if (id === user.id && roleId) {
      const existing = await prisma.user.findUnique({ where: { id }, select: { roleId: true } });
      if (existing && roleId !== existing.roleId) {
        return { ok: false, error: "You can't change your own role." };
      }
    }
    // If no password supplied, don't overwrite the existing hash
    const updateData: Record<string, unknown> = { name, email, roleId, role: legacyRole };
    if (password) updateData.passwordHash = data.passwordHash;
    await prisma.user.update({ where: { id }, data: updateData });
  } else {
    if (!password) return { ok: false, error: "Password is required for new users." };
    await prisma.user.create({ data: data as never });
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteUser(id: string) {
  const user = await getAuthorizedUser("users.delete");
  if (!user) return NOT_AUTHORIZED;
  if (id === user.id) return { ok: false, error: "You can't delete your own account." };
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { ok: true };
}

// Legacy alias kept for back-compat with the old RoleSelect (now unused).
export async function setUserRole(userId: string, roleId: string) {
  const user = await getAuthorizedUser("users.assignRole");
  if (!user) return NOT_AUTHORIZED;
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) return { ok: false, error: "Role not found." };
  const legacyRole = role.name === "Admin" ? "admin" : role.name === "Editor" ? "editor" : "reader";
  await prisma.user.update({ where: { id: userId }, data: { roleId, role: legacyRole } });
  revalidatePath("/admin/users");
  return { ok: true };
}

// ─── Admin: Roles & permissions ──────────────────────────────────────────

export async function upsertRole(formData: FormData) {
  const id = String(formData.get("id") || "");
  const user = await getAuthorizedUser(id ? "roles.edit" : "roles.create");
  if (!user) return NOT_AUTHORIZED;

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return { ok: false, error: "Name is required." };

  // Permissions come in as repeated form fields named "permissions"
  const permKeys = formData.getAll("permissions").map(String).filter((k) => PERMISSION_KEYS.has(k));

  if (id) {
    const existing = await prisma.role.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Role not found." };
    if (existing.system) {
      // System roles can be relabeled/described but their permissions are fixed
      await prisma.role.update({ where: { id }, data: { name, description } });
    } else {
      await prisma.role.update({
        where: { id },
        data: {
          name,
          description,
          permissions: {
            deleteMany: {},
            create: permKeys.map((key) => ({
              permission: { connect: { key } },
            })),
          },
        },
      });
    }
  } else {
    await prisma.role.create({
      data: {
        name,
        description,
        system: false,
        permissions: {
          create: permKeys.map((key) => ({
            permission: { connect: { key } },
          })),
        },
      },
    });
  }

  revalidatePath("/admin/roles");
  return { ok: true };
}

export async function deleteRole(id: string) {
  const user = await getAuthorizedUser("roles.delete");
  if (!user) return NOT_AUTHORIZED;
  const role = await prisma.role.findUnique({ where: { id } });
  if (role?.system) return { ok: false, error: "System roles cannot be deleted." };
  const memberCount = role ? await prisma.user.count({ where: { roleId: id } }) : 0;
  if (memberCount > 0) {
    return { ok: false, error: "Remove all users from this role first." };
  }
  await prisma.role.delete({ where: { id } });
  revalidatePath("/admin/roles");
  return { ok: true };
}

// ─── Admin: Site settings ────────────────────────────────────────────────

export async function updateSiteSettings(jsonData: string) {
  const user = await getAuthorizedUser("settings.edit");
  if (!user) return NOT_AUTHORIZED;
  JSON.parse(jsonData); // validate
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { data: jsonData },
    create: { id: "singleton", data: jsonData },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/contact");
  return { ok: true };
}
