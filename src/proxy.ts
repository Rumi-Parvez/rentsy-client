import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import dns from 'node:dns';

import { auth } from "@/lib/auth";

dns.setServers(['8.8.8.8', '8.8.4.4']);
export async function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return redirectToSignIn(request);
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id || !session.user.email) {
    return redirectToSignIn(request);
  }

  return NextResponse.next();
}

function redirectToSignIn(request: NextRequest) {
  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set(
    "redirect",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/equipment/:path+"],
};
