import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/login",
  "/register",
  "/checkup",
  "/payment",
  "/legacy-register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/leads",
];

const publicPathPrefixes = [
  "/api/auth/",
  "/_next/",
  "/favicon.ico",
  "/logo.png",
];

function isPublicPath(pathname: string): boolean {
  if (publicPaths.includes(pathname)) return true;
  
  return publicPathPrefixes.some(prefix => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("joyfit_session");

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!sessionCookie && !pathname.startsWith("/login")) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
