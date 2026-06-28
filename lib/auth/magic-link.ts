import { createHmac, timingSafeEqual } from "crypto";

const TTL_MS = 15 * 60 * 1000; // 15 minutes

export function createMagicLinkToken(email: string): string {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  if (!secret) throw new Error("EMAIL_VERIFICATION_SECRET is not set");

  const payload = JSON.stringify({ email, exp: Date.now() + TTL_MS, scope: "portal-login" });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", secret).update(payloadB64).digest("hex");
  return `${payloadB64}.${sig}`;
}

export function verifyMagicLinkToken(token: string): { email: string } | null {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  if (!secret) return null;

  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return null;

  const payloadB64 = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);

  const expectedSig = createHmac("sha256", secret).update(payloadB64).digest("hex");

  try {
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const raw = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString()
    ) as Record<string, unknown>;
    if (raw.scope !== "portal-login") return null;
    const exp = raw.exp as number;
    if (!exp || Date.now() > exp) return null;
    return { email: raw.email as string };
  } catch {
    return null;
  }
}
