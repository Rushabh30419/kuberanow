import type { ReactNode } from "react";
import { PageShell } from "./PageShell";

/**
 * Legal/policy page wrapper: a bordered surface card with the accent-bar
 * title, matching the original site's `border-border-soft bg-surface` card.
 */
export function LegalCard({
  title,
  titleColor = "text-career-heading",
  children,
}: {
  title: string;
  titleColor?: "text-career-heading" | "text-career-dark";
  children: ReactNode;
}) {
  return (
    <PageShell>
      <div className="border-border-soft bg-surface shadow-content-panel w-full max-w-[950px] min-w-0 rounded-lg border p-3 md:p-5">
        {/* Title */}
        <div className="border-career-stroke relative mb-6 flex h-8.25 shrink-0 items-center border-b-2 pb-2">
          <span className="bg-primary shadow-[2px_0px_0px_0px_var(--color-career-accent)] absolute left-0 h-5.5 w-1 rounded-xs" />
          <h3 className={`text-heading-small pl-3 leading-7 font-bold md:text-2xl ${titleColor}`}>
            {title}
          </h3>
        </div>
        {children}
      </div>
    </PageShell>
  );
}

/**
 * Numbered section heading (e.g. "1.1  Acceptance of Terms").
 */
export function LegalSectionHeading({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <h2 className="text-career-dark mb-3 mt-4 flex gap-4 text-base leading-[26px] font-bold lg:mb-4 lg:mt-8 lg:text-[22px] first:mt-0">
      <span className="shrink-0">{number}</span>
      <span>{label}</span>
    </h2>
  );
}

export function LegalH3({ number, label }: { number: string; label: string }) {
  return (
    <h3 className="text-career-dark mb-3 mt-2 flex gap-4 text-sm leading-[22px] font-bold lg:mb-4 lg:mt-6 lg:text-lg">
      <span className="shrink-0">{number}</span>
      <span>{label}</span>
    </h3>
  );
}

export function LegalH4({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-career-dark mb-2 text-sm leading-5.5 font-bold lg:text-lg">
      {children}
    </h4>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return (
    <p className="text-career-dark mb-2 text-xs leading-4 last:mb-0 md:text-sm md:leading-5 lg:mb-4 lg:text-base">
      {children}
    </p>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="text-career-dark mb-3 list-disc space-y-2 pl-6 text-xs leading-4 last:mb-0 md:space-y-3 md:text-sm md:leading-5 lg:text-base">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

export function LegalManagedBy({ children }: { children: ReactNode }) {
  return (
    <p className="text-career-muted mb-2 text-[10px] leading-4 lg:mb-4 lg:text-xs">
      {children}
    </p>
  );
}
