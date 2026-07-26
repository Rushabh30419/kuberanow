/** Values accepted from Next.js page searchParams. */
export type SearchParamValue = string | string[] | undefined;

/**
 * Parse a 1-indexed page number from a search params object. Returns 1 on
 * anything invalid (non-numeric, zero, negative).
 */
export function parsePage(raw: unknown, fallback = 1): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

/** Read the first string value and trim it for use in list filters. */
export function parseParam(raw: unknown, fallback = ""): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" ? value.trim() : fallback;
}

/** Accept only known values from a query-string filter or sort parameter. */
export function parseChoice<T extends string>(raw: unknown, allowed: readonly T[], fallback: T): T {
  const value = parseParam(raw);
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/** Keep a requested page inside the available result range. */
export function clampPage(page: number, total: number, pageSize = PAGE_SIZE): number {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return Math.min(Math.max(1, page), totalPages);
}

/** Build a list URL while retaining active search, filter, and sort values. */
export function buildListHref(
  path: string,
  params: Record<string, string | undefined>,
  page: number,
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (key === "page" || value === undefined || value === "") continue;
    query.set(key, value);
  }

  if (page > 1) query.set("page", String(page));
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

/** Number of rows rendered by every admin collection page. */
export const PAGE_SIZE = 15;
