import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Protect authenticated routes.
 * /admin/*  — unauthenticated → /login; reader → /dashboard
 * /dashboard/* — unauthenticated → /login
 */
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if ((isAdminRoute || isDashboardRoute) && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl)
    );
  }

  if (isAdminRoute && role === "reader") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
