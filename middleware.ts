import { NextRequest, NextResponse } from "next/server";

// Cookie presence check only (Edge Runtime can't run Node.js crypto).
// Full HMAC signature validation happens in getSession() inside the Server Component.
const SESSION_COOKIE = "aiff_session";

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
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/portal/charla/:path*"],
};
