import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken } from "@/lib/auth/magic-link";
import { findSpeakerByEmail } from "@/lib/notion/speakers";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host")}`;

  const rawToken = req.nextUrl.searchParams.get("token");
  if (!rawToken) {
    return NextResponse.redirect(`${baseUrl}/login?error=link_invalido`);
  }

  const payload = verifyMagicLinkToken(rawToken);
  if (!payload) {
    return NextResponse.redirect(`${baseUrl}/login?error=link_expirado`);
  }

  const speakerId = await findSpeakerByEmail(payload.email);
  if (!speakerId) {
    return NextResponse.redirect(`${baseUrl}/login?error=no_encontrado`);
  }

  const sessionToken = createSessionToken({ speakerId, email: payload.email });
  const response = NextResponse.redirect(`${baseUrl}/portal`);
  response.cookies.set(sessionCookieOptions(sessionToken));

  return response;
}
