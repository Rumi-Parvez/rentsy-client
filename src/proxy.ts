import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

const VERIFIED_USER_HEADER = "x-rentsy-verified-user";

function redirectToSignIn(request: NextRequest) {
  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set(
    "redirect",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(signInUrl);
}

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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    VERIFIED_USER_HEADER,
    encodeURIComponent(
      JSON.stringify({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      })
    )
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/equipment/:path+"],
};