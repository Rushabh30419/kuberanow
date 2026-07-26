import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

// ─── Card ────────────────────────────────────────────────────────────────

export function Card({
  children,
  className = "",
  as: Comp = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Comp className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </Comp>
  );
}

// ─── PageHeader ──────────────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-career-heading">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary-navy text-white hover:bg-dark-navy1 border border-transparent",
  outline: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300",
  danger: "bg-white text-red-600 hover:bg-red-50 border border-red-200",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-60 ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
    >
      {Icon && <Icon className="size-4" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
    >
      {Icon && <Icon className="size-4" />}
      {children}
    </Link>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────

type BadgeColor = "navy" | "green" | "amber" | "red" | "slate" | "cyan";

const BADGE_COLORS: Record<BadgeColor, string> = {
  navy: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-rose-50 text-rose-700",
  slate: "bg-slate-100 text-slate-600",
  cyan: "bg-cyan-50 text-cyan-700",
};

export function Badge({
  children,
  color = "slate",
  className = "",
}: {
  children: ReactNode;
  color?: BadgeColor;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_COLORS[color]} ${className}`}>
      {children}
    </span>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  color = "navy",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  color?: BadgeColor;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${BADGE_COLORS[color]}`}>
          {label}
        </span>
        <Icon className="size-5 text-slate-400" />
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-career-heading">{value}</p>
    </>
  );
  const cls = "block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md";
  return href ? (
    <Link href={href} className={cls}>
      {content}
    </Link>
  ) : (
    <div className={cls}>{content}</div>
  );
}

// ─── DataTable ───────────────────────────────────────────────────────────

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
}) {
  if (rows.length === 0) {
    return (
      empty ?? (
        <EmptyState
          title="Nothing here yet"
          description="When data arrives, it will appear in this table."
        />
      )
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop table */}
      <table className="hidden w-full text-sm sm:table">
        <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 text-left ${c.hideOnMobile ? "hidden md:table-cell" : ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 text-slate-700 ${c.hideOnMobile ? "hidden md:table-cell" : ""} ${c.className ?? ""}`}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 sm:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="p-4">
            {columns.map((c, i) => (
              <div key={c.key} className={i === 0 ? "mb-1" : "mt-1 flex justify-between gap-3 text-sm"}>
                {i === 0 ? (
                  <div className="font-semibold text-career-heading">{c.cell(row)}</div>
                ) : (
                  <>
                    <span className="text-slate-400">{c.header}</span>
                    <span className="text-right text-slate-700">{c.cell(row)}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      {Icon && <Icon className="mb-3 size-8 text-slate-300" />}
      <p className="font-semibold text-slate-700">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Form primitives ─────────────────────────────────────────────────────

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-primary-navy focus:ring-2 focus:ring-primary-navy/15 placeholder:text-slate-400";
