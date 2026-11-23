import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const signInUrl = new URL("/sign-in", request.url);

      signInUrl.searchParams.set(
        "callbackURL",
        `${request.nextUrl.pathname}${request.nextUrl.search}`
      );

      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication error:", error);

    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/equipment/:path",
  ],
};