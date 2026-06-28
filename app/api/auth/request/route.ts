import { NextRequest, NextResponse } from "next/server";
import { findSpeakerByEmail, getSpeakerById } from "@/lib/notion/speakers";
import { createMagicLinkToken } from "@/lib/auth/magic-link";
import { sendMagicLinkEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit: 3 requests per 10 minutes per IP
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`auth-request:${ip}`, 3, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  let email: string;
  try {
    const body = (await req.json()) as { email?: unknown };
    if (typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    email = body.email.toLowerCase().trim();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Always return success to avoid leaking which emails are registered
  const speakerId = await findSpeakerByEmail(email);
  if (!speakerId) {
    return NextResponse.json({ ok: true });
  }

  const token = createMagicLinkToken(email);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host")}`;
  const magicUrl = `${baseUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;

  let nombre = "Speaker";
  try {
    const speaker = await getSpeakerById(speakerId);
    if (speaker?.nombre) nombre = speaker.nombre.split(" ")[0];
  } catch {
    // use fallback
  }

  await sendMagicLinkEmail({ to: email, nombre, magicUrl });

  return NextResponse.json({ ok: true });
}
