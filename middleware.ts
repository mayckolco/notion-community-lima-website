import { NextRequest, NextResponse } from "next/server";

// Cookie presence check only (Edge Runtime can't run Node.js crypto).
// Full HMAC signature validation happens in getSession() inside the Server Component.
const SESSION_COOKIE = "aiff_session";
const COMMUNITY_SESSION_COOKIE = "aiff_community_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/programas/checkout") {
    const programa = req.nextUrl.searchParams.get("programa");
    if (programa === "claude-bootcamp") {
      const url = req.nextUrl.clone();
      url.searchParams.set("programa", "notion-bootcamp");
      return NextResponse.redirect(url, 301);
    }
  }

  if (pathname === "/login") {
    if (req.cookies.get(COMMUNITY_SESSION_COOKIE)?.value) {
      return NextResponse.redirect(new URL("/cuenta/perfil", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/portal/login") {
    if (req.cookies.get(SESSION_COOKIE)?.value) {
      return NextResponse.redirect(new URL("/portal", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/portal")) {
    if (pathname.startsWith("/portal/login")) {
      return NextResponse.next();
    }

    const hasSession = !!req.cookies.get(SESSION_COOKIE)?.value;
    if (!hasSession) {
      return NextResponse.redirect(new URL("/portal/login", req.url));
    }
  }

  if (pathname.startsWith("/cuenta")) {
    const hasCommunitySession = !!req.cookies.get(COMMUNITY_SESSION_COOKIE)?.value;
    if (!hasCommunitySession) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/programas/checkout",
    "/login",
    "/portal/login",
    "/portal/:path*",
    "/portal/charla/:path*",
    "/cuenta/:path*",
  ],
};
