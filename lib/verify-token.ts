import { createHmac, timingSafeEqual } from "crypto";
import type { ApplyInput } from "./schemas";

export type PendingApplication = ApplyInput & { fotoId: string | null };

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function createVerificationToken(data: PendingApplication): string {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  if (!secret) throw new Error("EMAIL_VERIFICATION_SECRET is not set");

  const payload = JSON.stringify({ ...data, exp: Date.now() + TTL_MS });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", secret).update(payloadB64).digest("hex");
  return `${payloadB64}.${sig}`;
}

export function verifyToken(token: string): PendingApplication | null {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  if (!secret) {
    console.error("[verifyToken] EMAIL_VERIFICATION_SECRET is not set");
    return null;
  }

  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return null;

  const payloadB64 = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);

  const expectedSig = createHmac("sha256", secret).update(payloadB64).digest("hex");

  // Constant-time comparison to prevent timing attacks
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
    const raw = JSON.parse(Buffer.from(payloadB64, "base64url").toString()) as Record<string, unknown>;
    const exp = raw.exp as number;
    if (!exp || Date.now() > exp) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp: _exp, ...data } = raw;
    return data as unknown as PendingApplication;
  } catch {
    return null;
  }
}
