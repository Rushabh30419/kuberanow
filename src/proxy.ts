import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Protect /admin/* routes.
 * - Unauthenticated → redirect to /login?callbackUrl=...
 * - Authenticated but role === "reader" → redirect to /dashboard
 *   (readers have no admin access; editors see only part of /admin)
 */
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl)
      );
    }
    if (role === "reader") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Skip NextAuth internals, static assets, and API routes that aren't ours
  matcher: ["/admin/:path*"],
};
