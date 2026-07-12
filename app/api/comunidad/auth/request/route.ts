import { NextRequest, NextResponse } from "next/server";
import { comunidadLoginSchema } from "@/lib/schemas";
import { createMagicLinkToken } from "@/lib/auth/magic-link";
import { sendCommunityMagicLinkEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { findMemberByEmail, getMemberById } from "@/lib/notion/comunidad";

function getBaseUrl(req: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host")}`
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`comunidad-auth-request:${ip}`, 3, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = comunidadLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  const memberId = await findMemberByEmail(email);
  if (!memberId) {
    return NextResponse.json({ ok: true });
  }

  const token = createMagicLinkToken(email, "community-login");
  const magicUrl = `${getBaseUrl(req)}/api/comunidad/auth/verify?token=${encodeURIComponent(token)}`;

  let nombre = "builder";
  const member = await getMemberById(memberId);
  if (member?.nombre) nombre = member.nombre.split(" ")[0];

  await sendCommunityMagicLinkEmail({ to: email, nombre, magicUrl });

  return NextResponse.json({ ok: true });
}
