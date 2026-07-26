/**
 * Parse a 1-indexed page number from a search params object. Returns 1 on
 * anything invalid (non-numeric, zero, negative).
 */
export function parsePage(raw: unknown, fallback = 1): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

export const PAGE_SIZE = 20;
