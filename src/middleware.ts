import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccessTier } from "@/lib/access-tier";

const SESSION_COOKIE = "joyfit_session";

async function fetchAuthUser(request: NextRequest): Promise<{ approvalStatus: string; role: string } | null> {
  const url = new URL("/api/auth/me", request.url);
  const res = await fetch(url.toString(), {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });
  const data = await res.json();
  if (!data.ok || !data.user) return null;
  return data.user;
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const pathname = request.nextUrl.pathname;

  // Admin routes: require admin role
  if (pathname.startsWith("/admin")) {
    const user = await fetchAuthUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // App routes: tier-based access
  if (pathname.startsWith("/app")) {
    // Leaderboard is always allowed
    if (pathname === "/app/leaderboard" || pathname.startsWith("/app/leaderboard/")) {
      return NextResponse.next();
    }

    const user = await fetchAuthUser(request);
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const tier = getAccessTier({ approvalStatus: user.approvalStatus });
    if (tier !== "FULL") {
      const redirectUrl = new URL("/app/leaderboard", request.url);
      redirectUrl.searchParams.set("locked", "1");
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app", "/app/:path*", "/admin", "/admin/:path*"],
};
