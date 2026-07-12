import { NextRequest, NextResponse } from "next/server";

// Cookie presence check only (Edge Runtime can't run Node.js crypto).
// Full HMAC signature validation happens in getSession() inside the Server Component.
const SESSION_COOKIE = "aiff_session";
const COMMUNITY_SESSION_COOKIE = "aiff_community_session";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/portal")) {
    if (req.nextUrl.pathname.startsWith("/portal/login")) {
      return NextResponse.next();
    }

    const hasSession = !!req.cookies.get(SESSION_COOKIE)?.value;
    if (!hasSession) {
      return NextResponse.redirect(new URL("/portal/login", req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith("/cuenta")) {
    const hasCommunitySession = !!req.cookies.get(COMMUNITY_SESSION_COOKIE)?.value;
    if (!hasCommunitySession) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/portal/charla/:path*", "/cuenta/:path*"],
};
