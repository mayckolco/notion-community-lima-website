import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken } from "@/lib/auth/magic-link";
import {
  createCommunitySessionToken,
  communitySessionCookieOptions,
} from "@/lib/auth/community-session";
import { findMemberByEmail, publishCommunityMember } from "@/lib/notion/comunidad";
import { getBaseUrl } from "@/lib/base-url";

export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl(req);

  const rawToken = req.nextUrl.searchParams.get("token");
  if (!rawToken) {
    return NextResponse.redirect(`${baseUrl}/login?error=link_invalido`);
  }

  const payload = verifyMagicLinkToken(rawToken, "community-login");
  if (!payload) {
    return NextResponse.redirect(`${baseUrl}/login?error=link_expirado`);
  }

  const memberId = await findMemberByEmail(payload.email);
  if (!memberId) {
    return NextResponse.redirect(`${baseUrl}/login?error=no_encontrado`);
  }

  await publishCommunityMember(memberId);

  const sessionToken = createCommunitySessionToken({
    memberId,
    email: payload.email,
  });

  const response = NextResponse.redirect(`${baseUrl}/cuenta/perfil`);
  response.cookies.set(communitySessionCookieOptions(sessionToken));
  return response;
}
