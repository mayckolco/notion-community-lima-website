import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSpeakerEtiqueta } from "@/lib/config/roles";
import { updateGrabacionUrl } from "@/lib/notion/slots";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slotId: string } }
) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const etiqueta = getSpeakerEtiqueta(session.email);
  if (etiqueta !== "admin" && etiqueta !== "colaborador") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let url: string | null;
  try {
    const body = (await req.json()) as { url?: unknown };
    url = typeof body.url === "string" ? body.url.trim() || null : null;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  await updateGrabacionUrl(params.slotId, url);
  return NextResponse.json({ ok: true });
}
