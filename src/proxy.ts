import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  try {
    // Get the real Better Auth session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // No valid session
    if (!session) {
      const signInUrl = new URL("/sign-in", request.url);

      signInUrl.searchParams.set(
        "redirect",
        `${request.nextUrl.pathname}${request.nextUrl.search}`
      );

      return NextResponse.redirect(signInUrl);
    }

    // Valid session
    return NextResponse.next();
  } catch (error) {
    console.error("Proxy session check failed:", error);

    const signInUrl = new URL("/sign-in", request.url);

    signInUrl.searchParams.set(
      "redirect",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );

    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: ["/equipment/:path"],
};
