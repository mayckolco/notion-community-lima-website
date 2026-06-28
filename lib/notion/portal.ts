import { getNotionClient, getDbSpeakersId } from "./client";

export interface PortalSlot {
  id: string;
  titulo: string | null;
  descripcion: string | null;
  fecha: string | null;
  lumaUrl: string | null;
  webinarUrl: string | null;
  herramientas: string[];
  estado: string;
  fotos: string[];
  covers: string[];
}

export interface PortalSpeaker {
  id: string;
  nombre: string;
  email: string;
  foto: string | null;
  biografia: string | null;
  rol: string | null;
  empresa: string | null;
  linkedin: string | null;
  estado: string;
  slots: PortalSlot[];
}

const NOTION_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
  };
}

function extractFoto(files: Array<Record<string, unknown>>): string | null {
  for (const f of files) {
    let url: string | null = null;
    if (f.type === "file_upload") url = (f.file_upload as { url?: string })?.url ?? null;
    else if (f.type === "external") url = (f.external as { url?: string })?.url ?? null;
    else if (f.type === "file") url = (f.file as { url?: string })?.url ?? null;
    if (url) return url;
  }
  return null;
}

function extractFotos(files: Array<Record<string, unknown>>): string[] {
  return files
    .map((f) => {
      if (f.type === "file_upload") return (f.file_upload as { url?: string })?.url ?? null;
      if (f.type === "external") return (f.external as { url?: string })?.url ?? null;
      if (f.type === "file") return (f.file as { url?: string })?.url ?? null;
      return null;
    })
    .filter((url): url is string => url !== null && url !== "");
}

export async function fetchSlot(slotId: string): Promise<PortalSlot | null> {
  const res = await fetch(`${NOTION_BASE}/pages/${slotId}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const page = (await res.json()) as { id: string; properties: Record<string, unknown> };
  const p = page.properties;

  return {
    id: page.id,
    titulo:
      (p["Título"] as { title?: Array<{ plain_text?: string }> })?.title?.[0]?.plain_text ?? null,
    descripcion:
      (p["Descripción"] as { rich_text?: Array<{ plain_text?: string }> })
        ?.rich_text?.[0]?.plain_text ?? null,
    fecha: (p["Fecha"] as { date?: { start?: string } })?.date?.start ?? null,
    lumaUrl: (p["Luma URL"] as { url?: string | null })?.url ?? null,
    webinarUrl: (p["Meet URL"] as { url?: string | null })?.url ?? null,
    herramientas:
      (p["Herramientas"] as { multi_select?: Array<{ name?: string }> })?.multi_select
        ?.map((t) => t.name ?? "")
        .filter(Boolean) ?? [],
    estado: (p["Estado"] as { status?: { name?: string } })?.status?.name ?? "Disponible",
    fotos: extractFotos(
      (p["Fotos"] as { files?: Array<Record<string, unknown>> })?.files ?? []
    ),
    covers: extractFotos(
      (p["Cover"] as { files?: Array<Record<string, unknown>> })?.files ?? []
    ),
  };
}

async function buildPortalSpeaker(page: Record<string, unknown>): Promise<PortalSpeaker> {
  const props = page.properties as Record<string, unknown>;

  const slotRelation =
    (props["Slot"] as { relation?: Array<{ id: string }> })?.relation ?? [];

  const fetchedSlots = await Promise.all(slotRelation.map((r) => fetchSlot(r.id)));
  const slots = fetchedSlots
    .filter((s): s is PortalSlot => s !== null)
    .sort((a, b) => {
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });

  return {
    id: page.id as string,
    nombre:
      (props["Nombre completo"] as { title?: Array<{ plain_text?: string }> })
        ?.title?.[0]?.plain_text ?? "",
    email: (props["Email"] as { email?: string })?.email ?? "",
    foto: extractFoto(
      (props["Foto"] as { files?: Array<Record<string, unknown>> })?.files ?? []
    ),
    biografia:
      (props["Biografía"] as { rich_text?: Array<{ plain_text?: string }> })
        ?.rich_text?.[0]?.plain_text ?? null,
    rol:
      (props["Rol"] as { rich_text?: Array<{ plain_text?: string }> })
        ?.rich_text?.[0]?.plain_text ?? null,
    empresa:
      (props["Empresa"] as { rich_text?: Array<{ plain_text?: string }> })
        ?.rich_text?.[0]?.plain_text ?? null,
    linkedin: (props["LinkedIn"] as { url?: string | null })?.url ?? null,
    estado:
      (props["Estado"] as { status?: { name?: string } })?.status?.name ?? "Aplicado",
    slots,
  };
}

export async function getSpeakerPortalByEmail(email: string): Promise<PortalSpeaker | null> {
  const res = await fetch(`${NOTION_BASE}/databases/${getDbSpeakersId()}/query`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      filter: { property: "Email", email: { equals: email } },
      page_size: 1,
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { results: Array<Record<string, unknown>> };
  if (data.results.length === 0) return null;

  return buildPortalSpeaker(data.results[0]);
}

export async function getSpeakerPortalById(speakerId: string): Promise<PortalSpeaker | null> {
  const notion = getNotionClient();
  try {
    const page = await notion.pages.retrieve({ page_id: speakerId });
    return buildPortalSpeaker(page as Record<string, unknown>);
  } catch {
    return null;
  }
}
