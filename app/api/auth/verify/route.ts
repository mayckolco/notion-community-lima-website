import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken } from "@/lib/auth/magic-link";
import { findSpeakerByEmail } from "@/lib/notion/speakers";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";
import { isAdminEmail, isColaboradorEmail, ADMIN_SPEAKER_ID } from "@/lib/config/roles";

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

  let speakerId = await findSpeakerByEmail(payload.email);
  if (!speakerId) {
    if (isAdminEmail(payload.email) || isColaboradorEmail(payload.email)) {
      speakerId = ADMIN_SPEAKER_ID;
    } else {
      return NextResponse.redirect(`${baseUrl}/login?error=no_encontrado`);
    }
  }

  const sessionToken = createSessionToken({ speakerId, email: payload.email });
  const redirectPath = speakerId === ADMIN_SPEAKER_ID ? "/portal/admin" : "/portal";
  const response = NextResponse.redirect(`${baseUrl}${redirectPath}`);
  response.cookies.set(sessionCookieOptions(sessionToken));

  return response;
}
