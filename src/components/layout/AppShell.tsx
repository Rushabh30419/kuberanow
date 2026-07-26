"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Wraps the app body. Renders the public Header/Footer only on public pages.
 * Console routes (admin, dashboard, login, register) get their own chrome
 * from their respective layouts, so the public header/footer are hidden there.
 */
const CONSOLE_PREFIXES = ["/admin", "/dashboard", "/login", "/register"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConsole = CONSOLE_PREFIXES.some((p) => pathname.startsWith(p));

  if (isConsole) {
    // Console routes manage their own layout (sidebar, headers, etc.)
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
