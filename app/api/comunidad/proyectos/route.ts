import { NextRequest, NextResponse } from "next/server";
import { getCommunitySession } from "@/lib/auth/community-session";
import { comunidadProyectoSchema } from "@/lib/schemas";
import { getMemberById } from "@/lib/notion/comunidad";
import {
  createProyecto,
  isProyectosDbConfigured,
  listProyectosByMember,
} from "@/lib/notion/proyectos";

export async function GET() {
  const session = getCommunitySession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const proyectos = await listProyectosByMember(session.memberId);
  return NextResponse.json({ proyectos, configured: isProyectosDbConfigured() });
}

export async function POST(req: NextRequest) {
  const session = getCommunitySession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isProyectosDbConfigured()) {
    return NextResponse.json({ error: "proyectos_db_missing" }, { status: 503 });
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

  const parsed = comunidadProyectoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const { nombre, descripcion, stack, url, github } = parsed.data;
  const proyectoId = await createProyecto({
    nombre: nombre.trim(),
    descripcion: descripcion.trim(),
    stack,
    url: url?.trim() || undefined,
    github: github?.trim() || undefined,
    autor: member.nombre,
    email: session.email,
    memberId: session.memberId,
  });

  if (!proyectoId) {
    return NextResponse.json({ error: "create_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, proyectoId });
}
