import { getDbSlotsId, getDbSpeakersId } from "./client";
import type { AdminSlot, AdminSpeaker, SpeakerEtiqueta, SlotEstado } from "@/lib/schemas";

const NOTION_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

async function fetchSpeakerAdmin(speakerId: string): Promise<AdminSpeaker | null> {
  const res = await fetch(`${NOTION_BASE}/pages/${speakerId}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const page = (await res.json()) as { properties: Record<string, unknown> };
  const p = page.properties;

  const nombre =
    (p["Nombre completo"] as { title?: Array<{ plain_text?: string }> })
      ?.title?.[0]?.plain_text ?? "";
  if (!nombre) return null;

  const email = (p["Email"] as { email?: string })?.email ?? "";
  const rol =
    (p["Rol"] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text ?? null;
  const empresa =
    (p["Empresa"] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text ?? null;
  const etiqueta =
    ((p["Etiqueta"] as { select?: { name?: string } })?.select?.name as SpeakerEtiqueta) ??
    "speaker";

  const fotosRaw = (p["Foto"] as { files?: Array<Record<string, unknown>> })?.files ?? [];
  let foto: string | null = null;
  for (const f of fotosRaw) {
    if (f.type === "file_upload") foto = (f.file_upload as { url?: string })?.url ?? null;
    else if (f.type === "external") foto = (f.external as { url?: string })?.url ?? null;
    else if (f.type === "file") foto = (f.file as { url?: string })?.url ?? null;
    if (foto) break;
  }

  return { nombre, email, foto, rol, empresa, etiqueta };
}

export async function listAllSlotsAdmin(): Promise<AdminSlot[]> {
  const res = await fetch(`${NOTION_BASE}/databases/${getDbSlotsId()}/query`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      page_size: 100,
      sorts: [{ property: "Fecha", direction: "descending" }],
    }),
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { results: Array<Record<string, unknown>> };

  const slots = data.results.map((page) => {
    const props = page.properties as Record<string, unknown>;
    const speakerIds =
      (props["Speaker"] as { relation?: Array<{ id: string }> })?.relation?.map((r) => r.id) ?? [];

    return {
      id: ((page.id as string) ?? "").replace(/-/g, ""),
      titulo:
        (props["Título"] as { title?: Array<{ plain_text?: string }> })
          ?.title?.[0]?.plain_text ?? null,
      fecha:
        (props["Fecha"] as { date?: { start?: string } })?.date?.start ?? null,
      estado:
        ((props["Estado"] as { status?: { name?: string } })?.status?.name ??
          "Disponible") as SlotEstado,
      registrados:
        (props["Registrados"] as { number?: number | null })?.number ?? null,
      asistentes:
        (props["Asistentes"] as { number?: number | null })?.number ?? null,
      speakerIds,
    };
  });

  const withSpeakers = await Promise.all(
    slots.map(async ({ speakerIds, ...slot }) => {
      const speaker =
        speakerIds.length > 0 ? await fetchSpeakerAdmin(speakerIds[0]) : null;
      return { ...slot, speaker };
    })
  );

  return withSpeakers;
}

export async function listAllSpeakersAdmin(): Promise<AdminSpeaker[]> {
  const res = await fetch(`${NOTION_BASE}/databases/${getDbSpeakersId()}/query`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ page_size: 100 }),
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { results: Array<Record<string, unknown>> };

  return data.results
    .map((page) => {
      const p = page.properties as Record<string, unknown>;
      const nombre =
        (p["Nombre completo"] as { title?: Array<{ plain_text?: string }> })
          ?.title?.[0]?.plain_text ?? "";
      if (!nombre) return null;

      const email = (p["Email"] as { email?: string })?.email ?? "";
      const rol =
        (p["Rol"] as { rich_text?: Array<{ plain_text?: string }> })
          ?.rich_text?.[0]?.plain_text ?? null;
      const empresa =
        (p["Empresa"] as { rich_text?: Array<{ plain_text?: string }> })
          ?.rich_text?.[0]?.plain_text ?? null;
      const etiqueta =
        ((p["Etiqueta"] as { select?: { name?: string } })?.select?.name as SpeakerEtiqueta) ??
        "speaker";

      const fotosRaw = (p["Foto"] as { files?: Array<Record<string, unknown>> })?.files ?? [];
      let foto: string | null = null;
      for (const f of fotosRaw) {
        if (f.type === "file_upload") foto = (f.file_upload as { url?: string })?.url ?? null;
        else if (f.type === "external") foto = (f.external as { url?: string })?.url ?? null;
        else if (f.type === "file") foto = (f.file as { url?: string })?.url ?? null;
        if (foto) break;
      }

      return { nombre, email, foto, rol, empresa, etiqueta };
    })
    .filter((s): s is AdminSpeaker => s !== null);
}
