import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COMMUNITY_SESSION_COOKIE_NAME,
  parseCommunitySessionToken,
} from "@/lib/auth/community-session";
import { SESSION_COOKIE_NAME, parseSessionToken } from "@/lib/auth/session";
import { ADMIN_SPEAKER_ID } from "@/lib/config/roles";

export async function GET() {
  const speakerToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  const communityToken = cookies().get(COMMUNITY_SESSION_COOKIE_NAME)?.value;

  const speakerSession = speakerToken ? parseSessionToken(speakerToken) : null;
  const communitySession = communityToken ? parseCommunitySessionToken(communityToken) : null;

  return NextResponse.json({
    speaker: speakerSession
      ? {
          href:
            speakerSession.speakerId === ADMIN_SPEAKER_ID ? "/portal/admin" : "/portal",
        }
      : null,
    community: communitySession ? { href: "/cuenta/perfil" } : null,
  });
}
