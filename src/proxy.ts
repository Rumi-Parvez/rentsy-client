import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic authentication gate.
 *
 * This only checks that a Better Auth session cookie exists, so
 * unauthenticated visitors never reach the dashboard shell.
 *
 * The real, authoritative authorization (session validation +
 * database role check) happens in the dashboard server layout and
 * in every page via requireRole(). API routes repeat the check
 * again on the Express server, so a forged client cannot elevate
 * its own role.
 */
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isDashboard =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (isDashboard && !getSessionCookie(request)) {
    const signInUrl = new URL("/sign-in", request.url);

    signInUrl.searchParams.set(
      "redirect",
      `${pathname}${search}`
    );

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
