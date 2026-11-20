import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic authentication gate using Better Auth session cookies.
 * Authoritative session + role verification still runs in layouts, pages,
 * and on the Express backend.
 */
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const isProtectedEquipment =
    pathname === "/equipment" || pathname.startsWith("/equipment/");

  if ((isDashboard || isProtectedEquipment) && !getSessionCookie(request)) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/equipment/:path*"],
};