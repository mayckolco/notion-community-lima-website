import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COMMUNITY_SESSION_COOKIE_NAME = "aiff_community_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface CommunitySessionData {
  memberId: string;
  email: string;
}

function getSecret(): string {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  if (!secret) throw new Error("EMAIL_VERIFICATION_SECRET is not set");
  return secret;
}

export function createCommunitySessionToken(data: CommunitySessionData): string {
  const secret = getSecret();
  const payload = JSON.stringify({ ...data, exp: Date.now() + SESSION_TTL_MS });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", secret).update(payloadB64).digest("hex");
  return `${payloadB64}.${sig}`;
}

export function parseCommunitySessionToken(token: string): CommunitySessionData | null {
  try {
    const secret = getSecret();
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return null;

    const payloadB64 = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);

    const expectedSig = createHmac("sha256", secret).update(payloadB64).digest("hex");

    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const raw = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString()
    ) as Record<string, unknown>;
    const exp = raw.exp as number;
    if (!exp || Date.now() > exp) return null;

    return { memberId: raw.memberId as string, email: raw.email as string };
  } catch {
    return null;
  }
}

export function getCommunitySession(): CommunitySessionData | null {
  const token = cookies().get(COMMUNITY_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return parseCommunitySessionToken(token);
}

export function communitySessionCookieOptions(token: string) {
  return {
    name: COMMUNITY_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  };
}
