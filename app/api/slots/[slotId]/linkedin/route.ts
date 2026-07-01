import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSpeakerEtiqueta } from "@/lib/config/roles";
import { updateSpeakerLinkedinUrl } from "@/lib/notion/speakers";

const NOTION_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

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

  // Find the speaker linked to this slot
  const slotRes = await fetch(`${NOTION_BASE}/pages/${params.slotId}`, {
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
    },
  });
  if (!slotRes.ok) return NextResponse.json({ error: "slot_not_found" }, { status: 404 });

  const slotPage = (await slotRes.json()) as { properties: Record<string, unknown> };
  const speakerIds =
    (slotPage.properties["Speaker"] as { relation?: Array<{ id: string }> })
      ?.relation?.map((r) => r.id) ?? [];

  if (speakerIds.length === 0) {
    return NextResponse.json({ error: "no_speaker_linked" }, { status: 400 });
  }

  await updateSpeakerLinkedinUrl(speakerIds[0], url);
  return NextResponse.json({ ok: true });
}
