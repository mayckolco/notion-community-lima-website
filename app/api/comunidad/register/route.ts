import { NextRequest, NextResponse } from "next/server";
import { comunidadRegisterSchema } from "@/lib/schemas";
import { createMagicLinkToken } from "@/lib/auth/magic-link";
import { sendCommunityMagicLinkEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  createCommunityMember,
  findMemberByEmail,
  getMemberById,
  updateCommunityMember,
} from "@/lib/notion/comunidad";

function getBaseUrl(req: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host")}`
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`comunidad-register:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = comunidadRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { nombre, email, pais, ciudad, rol, empresa, linkedin } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();
  const memberInput = {
    nombre: nombre.trim(),
    email: normalizedEmail,
    pais: pais.trim(),
    ciudad: ciudad.trim(),
    rol: rol?.trim() || undefined,
    empresa: empresa?.trim() || undefined,
    linkedin: linkedin?.trim() || undefined,
  };

  const existingId = await findMemberByEmail(normalizedEmail);
  let memberId = existingId;

  if (existingId) {
    const updated = await updateCommunityMember(existingId, memberInput);
    if (!updated) {
      return NextResponse.json({ error: "update_failed" }, { status: 500 });
    }
  } else {
    memberId = await createCommunityMember(memberInput);
    if (!memberId) {
      return NextResponse.json({ error: "create_failed" }, { status: 500 });
    }
  }

  const token = createMagicLinkToken(normalizedEmail, "community-login");
  const magicUrl = `${getBaseUrl(req)}/api/comunidad/auth/verify?token=${encodeURIComponent(token)}`;

  let greetingName = memberInput.nombre.split(" ")[0];
  if (existingId) {
    const member = await getMemberById(existingId);
    if (member?.nombre) greetingName = member.nombre.split(" ")[0];
  }

  try {
    await sendCommunityMagicLinkEmail({
      to: normalizedEmail,
      nombre: greetingName,
      magicUrl,
    });
  } catch (err) {
    console.error("[comunidad/register] email failed:", err);
    return NextResponse.json({ error: "email_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, memberId });
}
