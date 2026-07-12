import { NextRequest, NextResponse } from "next/server";
import { getCommunitySession } from "@/lib/auth/community-session";
import { comunidadProyectoSchema } from "@/lib/schemas";
import { getProyectoById, updateProyecto } from "@/lib/notion/proyectos";

function normalizeMemberId(id: string): string {
  return id.replace(/-/g, "");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getCommunitySession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const proyecto = await getProyectoById(params.id);
  if (!proyecto) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const ownerId = proyecto.memberId ? normalizeMemberId(proyecto.memberId) : null;
  const sessionId = normalizeMemberId(session.memberId);
  if (!ownerId || ownerId !== sessionId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = comunidadProyectoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const { nombre, descripcion, stack, url, github } = parsed.data;
  const ok = await updateProyecto(params.id, {
    nombre: nombre.trim(),
    descripcion: descripcion.trim(),
    stack,
    url: url?.trim() || undefined,
    github: github?.trim() || undefined,
  });

  if (!ok) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
