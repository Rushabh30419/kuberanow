import { prisma } from "./db";
import type {
  MarketCategory,
  MarketRow,
  NewsArticle,
  Job,
  PageContent,
  PageSection,
  SiteSettingsData,
  CalculationType,
  UserRole,
} from "./types";

// ─── Formatting helpers ──────────────────────────────────────────────────

/** Format a number as an Indian-rupee price string (no decimal for large, 2 for small). */
function formatPrice(n: number): string {
  if (n >= 1000) return "₹" + Math.round(n).toLocaleString("en-IN");
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Build the `extra` field MarketTable expects, based on category-specific columns. */
function buildExtra(q: {
  category: string;
  dayRangeLow: number | null;
  dayRangeHigh: number | null;
  cagr3y: number | null;
  lotSize: string | null;
  unit: string | null;
}): { label: string; value: string } | undefined {
  if (q.category === "index" && q.dayRangeLow != null && q.dayRangeHigh != null) {
    return { label: "Day Range", value: `${q.dayRangeLow.toLocaleString("en-IN")} – ${q.dayRangeHigh.toLocaleString("en-IN")}` };
  }
  if (q.category === "mutual_fund" && q.cagr3y != null) {
    return { label: "3Y CAGR", value: `${q.cagr3y}%` };
  }
  if (q.category === "ipo" && q.lotSize) {
    return { label: "Lot Size", value: q.lotSize };
  }
  if (q.category === "commodity" && q.unit) {
    return { label: "Unit", value: q.unit };
  }
  return undefined;
}

// ─── Market data ─────────────────────────────────────────────────────────

export async function getMarketRows(category: MarketCategory): Promise<MarketRow[]> {
  const rows = await prisma.marketQuote.findMany({
    where: { category },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((q) => ({
    symbol: q.symbol,
    name: q.name,
    price: formatPrice(q.price),
    change: q.change,
    volume: q.volume ?? undefined,
    extra: buildExtra(q),
  }));
}

// ─── News ────────────────────────────────────────────────────────────────

const READ_TIME_BY_WORDS = 200; // wpm

function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / READ_TIME_BY_WORDS));
  return `${minutes} min read`;
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getNewsArticles(categorySlug: string): Promise<NewsArticle[]> {
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return [];

  const rows = await prisma.article.findMany({
    where: { categoryId: category.id, status: "published" },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: category.name,
    author: a.author,
    date: a.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: estimateReadTime(a.body),
    image: a.imageUrl ?? "",
  }));
}

export async function getArticleBySlug(slug: string): Promise<(NewsArticle & { body: string }) | null> {
  const a = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!a || a.status !== "published") return null;

  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    body: a.body,
    category: a.category.name,
    author: a.author,
    date: a.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: estimateReadTime(a.body),
    image: a.imageUrl ?? "",
  };
}

// ─── Jobs ────────────────────────────────────────────────────────────────

export async function getJobs(): Promise<Job[]> {
  const rows = await prisma.job.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((j) => ({
    id: j.id,
    title: j.title,
    description: j.description,
    experience: j.experience,
    salary: j.salary,
    location: j.location,
    type: j.type,
    mode: j.mode,
  }));
}

// ─── CMS pages ───────────────────────────────────────────────────────────

export async function getPage(slug: string): Promise<PageContent | null> {
  const p = await prisma.page.findUnique({ where: { slug } });
  if (!p) return null;
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle ?? undefined,
    sections: JSON.parse(p.sections) as PageSection[],
  };
}

// ─── Site settings ───────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettingsData | null> {
  const s = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!s) return null;
  return JSON.parse(s.data) as SiteSettingsData;
}

// ─── User-scoped reads ───────────────────────────────────────────────────

export async function getSavedCalculations(userId: string) {
  const rows = await prisma.savedCalculation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    type: r.type as CalculationType,
    label: r.label ?? undefined,
    inputs: JSON.parse(r.inputs),
    result: JSON.parse(r.result),
    createdAt: r.createdAt,
  }));
}

export async function getApplications(userId: string) {
  const rows = await prisma.application.findMany({
    where: { userId },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((a) => ({
    id: a.id,
    jobTitle: a.job.title,
    name: a.name,
    email: a.email,
    createdAt: a.createdAt,
  }));
}

// ─── Admin overview counts ──────────────────────────────────────────────

export async function getAdminCounts() {
  const [articles, jobs, users, submissions, applications] = await Promise.all([
    prisma.article.count(),
    prisma.job.count(),
    prisma.user.count(),
    prisma.contactSubmission.count(),
    prisma.application.count(),
  ]);
  return { articles, jobs, users, submissions, applications };
}

export async function getUsers() {
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return rows.map((r) => ({ ...r, role: r.role as UserRole }));
}

export async function getContactSubmissions() {
  return prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAllApplications() {
  return prisma.application.findMany({
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });
}
