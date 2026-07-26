"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { prisma } from "./db";
import { currentUser } from "./auth-guard";
import { getAuthorizedUser } from "./auth-action";
import type { CalculationType } from "./types";
import { PERMISSION_KEYS } from "./permissions";
import { connectObs, disconnectObs, getObsStatus } from "./live";

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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  // Validate and persist the resume file (if provided).
  const resume = formData.get("resume");
  let resumePath: string | null = null;
  let resumeName: string | null = null;
  let resumeSize: number | null = null;
  let resumeMime: string | null = null;

  if (resume && resume instanceof File && resume.size > 0) {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const ext = resume.name.toLowerCase().split(".").pop() ?? "";
    const allowedExt = ["pdf", "doc", "docx"];
    if (!allowed.includes(resume.type) && !allowedExt.includes(ext)) {
      return { ok: false, error: "Resume must be a PDF, DOC, or DOCX file." };
    }
    if (resume.size > 5 * 1024 * 1024) {
      return { ok: false, error: "Resume must be 5 MB or smaller." };
    }
    resumeSize = resume.size;
    resumeMime = resume.type || `application/${ext === "pdf" ? "pdf" : "octet-stream"}`;
    resumeName = resume.name;
  }

  // Create the application first so we have a stable id for the file path.
  const application = await prisma.application.create({
    data: { jobId, userId: user?.id, name, email, phone, coverLetter },
  });

  if (resume && resume instanceof File && resume.size > 0) {
    const safeName = (resume.name || "resume").replace(/[^a-zA-Z0-9._-]/g, "_");
    const dir = path.join(process.cwd(), "public", "uploads", "applications", application.id);
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, safeName);
    const buffer = Buffer.from(await resume.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    resumePath = `/uploads/applications/${application.id}/${safeName}`;
    await prisma.application.update({
      where: { id: application.id },
      data: { resumePath, resumeName, resumeSize, resumeMime },
    });
  }

  revalidatePath("/admin/applications");
  revalidatePath("/dashboard");
  return { ok: true, id: application.id };
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

  // Build a unique slug: if it collides with another article's slug,
  // append -2, -3, etc. (avoids Prisma unique-constraint throws on rename.)
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let slug = baseSlug;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const clash = await prisma.article.findFirst({
      where: { slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (!clash) break;
    slug = `${baseSlug}-${suffix++}`;
  }

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
  if (!location) return { ok: false, error: "Location is required." };
  if (!description) return { ok: false, error: "Description is required." };
  if (title.length > 120) return { ok: false, error: "Title must be 120 characters or fewer." };

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

export async function toggleJobActive(id: string) {
  const user = await getAuthorizedUser("jobs.edit");
  if (!user) return NOT_AUTHORIZED;
  const job = await prisma.job.findUnique({ where: { id }, select: { active: true, title: true } });
  if (!job) return { ok: false, error: "Job not found." };
  await prisma.job.update({ where: { id }, data: { active: !job.active } });
  revalidatePath("/admin/jobs");
  revalidatePath("/career");
  return { ok: true, active: !job.active, title: job.title };
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

export async function createMarketQuote(formData: FormData) {
  const user = await getAuthorizedUser("market.edit");
  if (!user) return NOT_AUTHORIZED;

  const category = String(formData.get("category") ?? "");
  const symbol = String(formData.get("symbol") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const change = Number(formData.get("change") ?? 0);
  const volume = String(formData.get("volume") ?? "").trim() || null;

  if (!category || !symbol || !name) {
    return { ok: false, error: "Category, symbol, and name are required." };
  }
  // max sortOrder in this category + 1
  const max = await prisma.marketQuote.aggregate({
    _max: { sortOrder: true },
    where: { category },
  });
  await prisma.marketQuote.create({
    data: {
      category,
      symbol,
      name,
      price,
      change,
      volume,
      sortOrder: (max._max.sortOrder ?? -1) + 1,
    },
  });
  revalidatePath("/market");
  revalidatePath("/admin/market");
  return { ok: true };
}

export async function deleteMarketQuote(id: string) {
  const user = await getAuthorizedUser("market.edit");
  if (!user) return NOT_AUTHORIZED;
  await prisma.marketQuote.delete({ where: { id } });
  revalidatePath("/market");
  revalidatePath("/admin/market");
  return { ok: true };
}

// ─── Admin: Applications & contact (delete only) ─────────────────────────

export async function deleteApplication(id: string) {
  const user = await getAuthorizedUser("applications.view");
  if (!user) return NOT_AUTHORIZED;
  await prisma.application.delete({ where: { id } });
  revalidatePath("/admin/applications");
  return { ok: true };
}

export async function markApplicationRead(id: string) {
  const user = await getAuthorizedUser("applications.view");
  if (!user) return NOT_AUTHORIZED;
  await prisma.application.update({
    where: { id },
    data: { read: true, readAt: new Date() },
  });
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
  return { ok: true };
}

export async function markApplicationUnread(id: string) {
  const user = await getAuthorizedUser("applications.view");
  if (!user) return NOT_AUTHORIZED;
  await prisma.application.update({
    where: { id },
    data: { read: false, readAt: null },
  });
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
  return { ok: true };
}

export async function markAllApplicationRead() {
  const user = await getAuthorizedUser("applications.view");
  if (!user) return NOT_AUTHORIZED;
  const result = await prisma.application.updateMany({
    where: { read: false },
    data: { read: true, readAt: new Date() },
  });
  revalidatePath("/admin/applications");
  return { ok: true, count: result.count };
}

export async function deleteContactSubmission(id: string) {
  const user = await getAuthorizedUser("contact.view");
  if (!user) return NOT_AUTHORIZED;
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/contact");
  return { ok: true };
}

export async function markContactRead(id: string) {
  const user = await getAuthorizedUser("contact.view");
  if (!user) return NOT_AUTHORIZED;
  await prisma.contactSubmission.update({
    where: { id },
    data: { read: true, readAt: new Date() },
  });
  revalidatePath("/admin/contact");
  revalidatePath(`/admin/contact/${id}`);
  return { ok: true };
}

export async function markContactUnread(id: string) {
  const user = await getAuthorizedUser("contact.view");
  if (!user) return NOT_AUTHORIZED;
  await prisma.contactSubmission.update({
    where: { id },
    data: { read: false, readAt: null },
  });
  revalidatePath("/admin/contact");
  revalidatePath(`/admin/contact/${id}`);
  return { ok: true };
}

export async function markAllContactRead() {
  const user = await getAuthorizedUser("contact.view");
  if (!user) return NOT_AUTHORIZED;
  const result = await prisma.contactSubmission.updateMany({
    where: { read: false },
    data: { read: true, readAt: new Date() },
  });
  revalidatePath("/admin/contact");
  return { ok: true, count: result.count };
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

  // Don't let the last admin be removed (would lock everyone out).
  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) return { ok: false, error: "Can't delete the last admin account." };
  }

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
  // Validate the JSON before touching the DB so a bad payload returns a
  // clean error instead of an unhandled server exception.
  try {
    JSON.parse(jsonData);
  } catch {
    return { ok: false, error: "Invalid JSON payload." };
  }
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { data: jsonData },
    create: { id: "singleton", data: jsonData },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/contact");
  return { ok: true };
}

// ─── Admin: Live streaming ───────────────────────────────────────────────

/** Ensure the singleton LiveStream row exists, returning it. */
async function getOrCreateLiveStream() {
  return prisma.liveStream.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
}

export async function updateLiveConfig(formData: FormData) {
  const user = await getAuthorizedUser("live.edit");
  if (!user) return NOT_AUTHORIZED;

  const title = String(formData.get("title") ?? "").trim() || "KuberaNow Live";
  const description = String(formData.get("description") ?? "").trim() || null;
  const obsHost = String(formData.get("obsHost") ?? "").trim() || null;
  const obsPort = Number(formData.get("obsPort") ?? 0) || null;
  const obsPassword = String(formData.get("obsPassword") ?? "") || null;
  const rtmpUrl = String(formData.get("rtmpUrl") ?? "").trim() || null;
  const rtmpKey = String(formData.get("rtmpKey") ?? "").trim() || null;
  const hlsUrl = String(formData.get("hlsUrl") ?? "").trim() || null;
  const recordingEnabled = formData.get("recordingEnabled") === "on";

  await prisma.liveStream.upsert({
    where: { id: "singleton" },
    update: {
      title,
      description,
      obsHost,
      obsPort,
      obsPassword,
      rtmpUrl,
      rtmpKey,
      hlsUrl,
      recordingEnabled,
    },
    create: {
      id: "singleton",
      title,
      description,
      obsHost,
      obsPort,
      obsPassword,
      rtmpUrl,
      rtmpKey,
      hlsUrl,
      recordingEnabled,
    },
  });
  revalidatePath("/admin/live");
  revalidatePath("/live");
  return { ok: true };
}

export async function goLive() {
  const user = await getAuthorizedUser("live.start");
  if (!user) return NOT_AUTHORIZED;

  const stream = await getOrCreateLiveStream();
  if (!stream.hlsUrl) {
    return { ok: false, error: "Set a public HLS playback URL in the control panel before going live." };
  }

  const session = await prisma.liveStreamSession.create({
    data: { title: stream.title },
  });

  await prisma.liveStream.update({
    where: { id: "singleton" },
    data: {
      status: "live",
      startedAt: new Date(),
      endedAt: null,
    },
  });
  revalidatePath("/admin/live");
  revalidatePath("/live");
  return { ok: true, sessionId: session.id };
}

export async function endLive() {
  const user = await getAuthorizedUser("live.start");
  if (!user) return NOT_AUTHORIZED;

  // Close the latest open session
  const open = await prisma.liveStreamSession.findFirst({
    where: { endedAt: null },
    orderBy: { startedAt: "desc" },
  });
  if (open) {
    await prisma.liveStreamSession.update({
      where: { id: open.id },
      data: { endedAt: new Date() },
    });
  }

  await prisma.liveStream.update({
    where: { id: "singleton" },
    data: { status: "offline", endedAt: new Date() },
  });
  revalidatePath("/admin/live");
  revalidatePath("/live");
  return { ok: true };
}

export async function testObsConnection() {
  const user = await getAuthorizedUser("live.edit");
  if (!user) return NOT_AUTHORIZED;

  const stream = await getOrCreateLiveStream();
  if (!stream.obsHost) {
    return { ok: false, error: "OBS host is not configured." };
  }
  const result = await connectObs({
    host: stream.obsHost,
    port: stream.obsPort ?? 4455,
    password: stream.obsPassword ?? undefined,
  });
  if (result.ok) {
    await prisma.liveStream.update({
      where: { id: "singleton" },
      data: { obsConnected: true, obsScene: result.scene ?? null },
    });
  } else {
    await prisma.liveStream.update({
      where: { id: "singleton" },
      data: { obsConnected: false, obsScene: null },
    });
  }
  revalidatePath("/admin/live");
  return result;
}

export async function refreshObsStatus() {
  const user = await getAuthorizedUser("live.view");
  if (!user) return NOT_AUTHORIZED;
  const status = await getObsStatus();
  if (status.connected !== undefined) {
    await prisma.liveStream.update({
      where: { id: "singleton" },
      data: { obsConnected: status.connected, obsScene: status.scene ?? null },
    });
  }
  revalidatePath("/admin/live");
  return status;
}

export async function disconnectObsAction() {
  const user = await getAuthorizedUser("live.edit");
  if (!user) return NOT_AUTHORIZED;
  await disconnectObs();
  await prisma.liveStream.update({
    where: { id: "singleton" },
    data: { obsConnected: false, obsScene: null },
  });
  revalidatePath("/admin/live");
  return { ok: true };
}
