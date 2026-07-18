import type { ReactNode } from "react";

/**
 * Section heading matching the original site's accent-bar pattern:
 * a primary-colored vertical bar with a colored shadow offset, followed
 * by the heading text, all sitting above a bottom border separator.
 */
export function SectionHeading({
  children,
  as: Tag = "h3",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className="border-career-stroke relative flex h-8.25 shrink-0 items-center border-b-2 pb-2">
      <span
        className="bg-primary shadow-[2px_0px_0px_0px_var(--color-career-accent)] absolute left-0 h-5.5 w-1 rounded-xs"
        aria-hidden="true"
      />
      <Tag
        className={`text-career-heading pl-3 text-lg leading-5.5 font-bold lg:text-2xl lg:leading-7 ${className}`}
      >
        {children}
      </Tag>
    </div>
  );
}

/**
 * The gradient icon badge used on contact/advertise cards.
 */
export function GradientIcon({ children }: { children: ReactNode }) {
  return (
    <>
      {/* mobile */}
      <div className="bg-contact-gradient flex h-6 w-6 shrink-0 items-center justify-center rounded text-white lg:hidden">
        {children}
      </div>
      {/* desktop */}
      <div className="bg-contact-gradient hidden h-[32px] w-[32px] shrink-0 items-center justify-center rounded-md p-1 text-white lg:flex">
        {children}
      </div>
    </>
  );
}
