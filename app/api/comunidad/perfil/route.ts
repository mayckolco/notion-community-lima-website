import { NextRequest, NextResponse } from "next/server";
import { getCommunitySession } from "@/lib/auth/community-session";
import { comunidadPerfilSchema } from "@/lib/schemas";
import { getMemberById, updateCommunityMember } from "@/lib/notion/comunidad";

export async function PATCH(req: NextRequest) {
  const session = getCommunitySession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const member = await getMemberById(session.memberId);
  if (!member) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = comunidadPerfilSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const { nombre, pais, ciudad, rol, empresa, linkedin } = parsed.data;
  const ok = await updateCommunityMember(session.memberId, {
    nombre: nombre.trim(),
    email: session.email,
    pais: pais.trim(),
    ciudad: ciudad.trim(),
    rol: rol?.trim() || undefined,
    empresa: empresa?.trim() || undefined,
    linkedin: linkedin?.trim() || undefined,
  });

  if (!ok) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
