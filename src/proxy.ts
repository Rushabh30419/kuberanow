import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Protect authenticated routes.
 * /admin/*     — unauthenticated → /login; no dashboard.view permission → /dashboard
 * /dashboard/* — unauthenticated → /login
 */
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const permissions = req.auth?.user?.permissions ?? [];

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if ((isAdminRoute || isDashboardRoute) && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl)
    );
  }

  // Anyone in /admin must at least be able to view the dashboard.
  if (isAdminRoute && !permissions.includes("dashboard.view")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
