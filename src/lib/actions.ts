"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { currentUser } from "./auth-guard";
import type { CalculationType, UserRole } from "./types";

// ─── Contact form ────────────────────────────────────────────────────────

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { ok: false, error: "All fields are required." };
  }

  await prisma.contactSubmission.create({
    data: { name, email, subject, message },
  });

  revalidatePath("/admin/contact");
  return { ok: true };
}

// ─── Job application (requires login) ────────────────────────────────────

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
    data: {
      jobId,
      userId: user?.id,
      name,
      email,
      phone,
      coverLetter,
    },
  });

  revalidatePath("/admin/applications");
  revalidatePath("/dashboard");
  return { ok: true };
}

// ─── Save calculation (requires login) ───────────────────────────────────

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
  if (!calc || calc.userId !== user.id) {
    return { ok: false, error: "Not found." };
  }

  await prisma.savedCalculation.delete({ where: { id } });
  revalidatePath("/dashboard");
  return { ok: true };
}

// ─── Admin: Articles CRUD (editor+) ──────────────────────────────────────

export async function upsertArticle(formData: FormData) {
  const user = await currentUser();
  if (!user || user.role === "reader") {
    return { ok: false, error: "Not authorized." };
  }

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const author = String(formData.get("author") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");

  if (!title || !excerpt || !body || !categorySlug || !author) {
    return { ok: false, error: "Title, excerpt, body, category, and author are required." };
  }

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return { ok: false, error: "Category not found." };

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = slugify(title);

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
  const user = await currentUser();
  if (!user || user.role === "reader") {
    return { ok: false, error: "Not authorized." };
  }
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/news");
  return { ok: true };
}

// ─── Admin: Jobs CRUD (editor+) ──────────────────────────────────────────

export async function upsertJob(formData: FormData) {
  const user = await currentUser();
  if (!user || user.role === "reader") {
    return { ok: false, error: "Not authorized." };
  }

  const id = String(formData.get("id") || "");
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
  const user = await currentUser();
  if (!user || user.role === "reader") {
    return { ok: false, error: "Not authorized." };
  }
  await prisma.job.delete({ where: { id } });
  revalidatePath("/admin/jobs");
  revalidatePath("/career");
  return { ok: true };
}

// ─── Admin: Market quotes (editor+) ──────────────────────────────────────

export async function updateMarketQuote(id: string, data: { price: number; change: number; volume?: string }) {
  const user = await currentUser();
  if (!user || user.role === "reader") {
    return { ok: false, error: "Not authorized." };
  }
  await prisma.marketQuote.update({
    where: { id },
    data: { price: data.price, change: data.change, volume: data.volume ?? null },
  });
  revalidatePath("/market");
  revalidatePath("/admin/market");
  return { ok: true };
}

// ─── Admin: Users role change (admin only) ───────────────────────────────

export async function setUserRole(userId: string, role: UserRole) {
  const user = await currentUser();
  if (!user || user.role !== "admin") {
    return { ok: false, error: "Admins only." };
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { ok: true };
}

// ─── Admin: Site settings (admin only) ───────────────────────────────────

export async function updateSiteSettings(jsonData: string) {
  const user = await currentUser();
  if (!user || user.role !== "admin") {
    return { ok: false, error: "Admins only." };
  }
  // Validate it parses
  JSON.parse(jsonData);
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { data: jsonData },
    create: { id: "singleton", data: jsonData },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/contact");
  return { ok: true };
}
