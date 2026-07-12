import { NextRequest, NextResponse } from "next/server";
import { getCommunitySession } from "@/lib/auth/community-session";
import { isCommunityAdminEmail } from "@/lib/config/community-roles";
import {
  listAllComunidadMembers,
  updateMemberAdmin,
} from "@/lib/notion/comunidad";
import {
  listAllProyectos,
  updateProyectoEstado,
} from "@/lib/notion/proyectos";

function requireAdmin(session: { email: string } | null) {
  if (!session || !isCommunityAdminEmail(session.email)) {
    return false;
  }
  return true;
}

export async function GET() {
  const session = getCommunitySession();
  if (!requireAdmin(session)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const [members, proyectos] = await Promise.all([
    listAllComunidadMembers(),
    listAllProyectos(),
  ]);

  return NextResponse.json({ members, proyectos });
}

export async function PATCH(req: NextRequest) {
  const session = getCommunitySession();
  if (!requireAdmin(session)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const payload = body as {
    type?: string;
    id?: string;
    estado?: string;
    member?: {
      nombre: string;
      email: string;
      pais?: string;
      ciudad: string;
      rol?: string;
      empresa?: string;
      linkedin?: string;
      estado?: string;
      tipo?: "miembro" | "admin";
    };
  };

  if (!payload.id || !payload.type) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  if (payload.type === "member" && payload.member) {
    const ok = await updateMemberAdmin(payload.id, payload.member);
    return NextResponse.json({ ok });
  }

  if (payload.type === "proyecto" && payload.estado) {
    const ok = await updateProyectoEstado(payload.id, payload.estado);
    return NextResponse.json({ ok });
  }

  return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
}
