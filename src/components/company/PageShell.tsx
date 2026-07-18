import type { ReactNode } from "react";

/**
 * Shared page container for all content/company pages. Provides a centered,
 * max-width container with consistent padding that matches the header and
 * footer containers (max-w-7xl).
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="bg-background-color flex w-full flex-1 justify-center">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        {children}
      </div>
    </main>
  );
}
