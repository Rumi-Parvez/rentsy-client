import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname, search } = request.nextUrl;

  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);

    signInUrl.searchParams.set(
      "redirect",
      `${pathname}${search}`,
    );

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/equipment/:path*",
  ],
};
