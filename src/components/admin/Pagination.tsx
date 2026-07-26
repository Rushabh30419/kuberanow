import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  /** 1-indexed current page */
  page: number;
  /** Total row count across all pages */
  total: number;
  /** Rows per page */
  pageSize: number;
  /**
   * Builds the href for a given page number. The list page controls this so
   * it can preserve other query params (search, filters) if it wants.
   */
  hrefFor: (page: number) => string;
};

/**
 * Server-rendered pager. Uses next/link so navigation is RSC-friendly and
 * the current page is reflected in the URL (?page=N) — shareable + refresh-safe.
 */
export function Pagination({ page, total, pageSize, hrefFor }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;

  // Clamp
  const current = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  // Build a compact page-number list with ellipses
  const pages: (number | "…")[] = [];
  const add = (n: number | "…") => pages.push(n);
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) add(i);
  } else {
    add(1);
    if (current > 3) add("…");
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);
    for (let i = start; i <= end; i++) add(i);
    if (current < totalPages - 2) add("…");
    add(totalPages);
  }

  const linkClass =
    "inline-flex min-w-9 items-center justify-center rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors";
  const activeClass = "border-primary-navy bg-primary-navy text-white";
  const idleClass = "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50";
  const disabledClass = "border-slate-200 bg-slate-50 text-slate-300 pointer-events-none";

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}</span>–
        <span className="font-semibold text-slate-700">{to}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Link
          href={hrefFor(current - 1)}
          aria-label="Previous page"
          className={`${linkClass} ${current === 1 ? disabledClass : idleClass}`}
        >
          <ChevronLeft className="size-4" />
        </Link>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={hrefFor(p)}
              aria-current={p === current ? "page" : undefined}
              className={`${linkClass} ${p === current ? activeClass : idleClass}`}
            >
              {p}
            </Link>
          )
        )}

        <Link
          href={hrefFor(current + 1)}
          aria-label="Next page"
          className={`${linkClass} ${current === totalPages ? disabledClass : idleClass}`}
        >
          <ChevronRight className="size-4" />
        </Link>
      </nav>
    </div>
  );
}
