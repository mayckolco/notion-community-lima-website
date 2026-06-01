import { addWeeks, isBefore, parseISO, startOfDay } from "date-fns";
import { getDbSlotsId, getNotionClient } from "./client";
import type { Slot, SlotEstado, SlotSpeaker } from "@/lib/schemas";

const NOTION_VERSION = "2022-06-28";

function notionUrl(path: string): string {
  return `https://api.notion.com/v1/${path}`;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

function extractStatus(props: Record<string, unknown>): SlotEstado {
  const p = props as Record<string, { status?: { name?: string } }>;
  return (p["Estado"]?.status?.name ?? "Bloqueado") as SlotEstado;
}

function extractDate(props: Record<string, unknown>): string | null {
  const p = props as Record<string, { date?: { start?: string } }>;
  return p["Fecha"]?.date?.start ?? null;
}

function extractLumaUrl(props: Record<string, unknown>): string | null {
  const p = props as Record<string, { url?: string | null }>;
  return p["Luma URL"]?.url ?? null;
}

function extractTitulo(props: Record<string, unknown>): string | null {
  const p = props as Record<string, { title?: Array<{ plain_text?: string }> }>;
  return p["Título"]?.title?.[0]?.plain_text ?? null;
}

function extractDescripcion(props: Record<string, unknown>): string | null {
  const p = props as Record<string, { rich_text?: Array<{ plain_text?: string }> }>;
  return p["Descripción"]?.rich_text?.[0]?.plain_text ?? null;
}

function extractHerramientas(props: Record<string, unknown>): string[] {
  const p = props as Record<string, { multi_select?: Array<{ name?: string }> }>;
  return p["Herramientas"]?.multi_select?.map((t) => t.name ?? "").filter(Boolean) ?? [];
}

function extractSpeakerIds(props: Record<string, unknown>): string[] {
  const p = props as Record<string, { relation?: Array<{ id: string }> }>;
  return p["Speaker"]?.relation?.map((r) => r.id) ?? [];
}

async function fetchSpeakerBasic(speakerId: string): Promise<SlotSpeaker | null> {
  const res = await fetch(notionUrl(`pages/${speakerId}`), {
    headers: authHeaders(),
  });
  if (!res.ok) return null;
  const page = (await res.json()) as { properties: Record<string, unknown> };
  const p = page.properties;

  const nombre =
    (p["Nombre completo"] as { title?: Array<{ plain_text?: string }> })
      ?.title?.[0]?.plain_text ?? "";
  if (!nombre) return null;

  const rol =
    (p["Rol"] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text ?? null;

  const empresa =
    (p["Empresa"] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text ?? null;

  const fotosRaw = (p["Foto"] as { files?: Array<Record<string, unknown>> })?.files ?? [];
  let foto: string | null = null;
  for (const f of fotosRaw) {
    if (f.type === "file_upload") foto = (f.file_upload as { url?: string })?.url ?? null;
    else if (f.type === "external") foto = (f.external as { url?: string })?.url ?? null;
    else if (f.type === "file") foto = (f.file as { url?: string })?.url ?? null;
    if (foto) break;
  }

  return { nombre, foto, rol, empresa };
}

async function queryDatabase(
  databaseId: string,
  body: Record<string, unknown>
): Promise<{ results: Array<Record<string, unknown>> }> {
  const res = await fetch(notionUrl(`databases/${databaseId}/query`), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Notion query failed with status: ${res.status}`);
  }

  return res.json() as Promise<{ results: Array<Record<string, unknown>> }>;
}

export async function listSlots(): Promise<Slot[]> {
  const now = new Date();
  const until = addWeeks(now, 20);

  const data = await queryDatabase(getDbSlotsId(), {
    filter: {
      and: [
        { property: "Fecha", date: { on_or_after: now.toISOString() } },
        { property: "Fecha", date: { on_or_before: until.toISOString() } },
      ],
    },
    sorts: [{ property: "Fecha", direction: "ascending" }],
  });

  const today = startOfDay(now);

  return data.results
    .map((page) => {
      const props = page.properties as Record<string, unknown>;
      return {
        id: ((page.id as string) ?? "").replace(/-/g, ""),
        fecha: extractDate(props) ?? "",
        estado: extractStatus(props),
        lumaUrl: extractLumaUrl(props),
        titulo: extractTitulo(props),
        descripcion: extractDescripcion(props),
        herramientas: extractHerramientas(props),
        speaker: null,
      };
    })
    .filter((slot) => slot.fecha && !isBefore(parseISO(slot.fecha), today));
}

export async function listConfirmedSlots(): Promise<Slot[]> {
  const now = new Date();
  const until = addWeeks(now, 20);

  const data = await queryDatabase(getDbSlotsId(), {
    filter: {
      and: [
        { property: "Estado", status: { equals: "Confirmado" } },
        { property: "Fecha", date: { on_or_after: now.toISOString() } },
        { property: "Fecha", date: { on_or_before: until.toISOString() } },
      ],
    },
    sorts: [{ property: "Fecha", direction: "ascending" }],
  });

  const today = startOfDay(now);

  const slots = data.results
    .map((page) => {
      const props = page.properties as Record<string, unknown>;
      return {
        id: ((page.id as string) ?? "").replace(/-/g, ""),
        fecha: extractDate(props) ?? "",
        estado: extractStatus(props),
        lumaUrl: extractLumaUrl(props),
        titulo: extractTitulo(props),
        descripcion: extractDescripcion(props),
        herramientas: extractHerramientas(props),
        speakerIds: extractSpeakerIds(props),
      };
    })
    .filter((slot) => slot.fecha && !isBefore(parseISO(slot.fecha), today));

  const withSpeakers = await Promise.all(
    slots.map(async ({ speakerIds, ...slot }) => {
      const speaker = speakerIds.length > 0
        ? await fetchSpeakerBasic(speakerIds[0])
        : null;
      return { ...slot, speaker };
    })
  );

  return withSpeakers;
}

export async function getSlot(slotId: string): Promise<Slot | null> {
  const notion = getNotionClient();

  try {
    const page = await notion.pages.retrieve({ page_id: slotId });
    const props = (page as Record<string, unknown>).properties as Record<string, unknown>;
    return {
      id: ((page as Record<string, unknown>).id as string).replace(/-/g, ""),
      fecha: extractDate(props) ?? "",
      estado: extractStatus(props),
      lumaUrl: extractLumaUrl(props),
      titulo: extractTitulo(props),
      descripcion: extractDescripcion(props),
      herramientas: extractHerramientas(props),
      speaker: null,
    };
  } catch {
    return null;
  }
}

export async function confirmWebinar(
  slotId: string,
  speakerId: string,
  talk: { titulo: string; herramientas: string[]; descripcion: string }
): Promise<void> {
  const notion = getNotionClient();
  await notion.pages.update({
    page_id: slotId,
    properties: {
      Título: { title: [{ text: { content: talk.titulo } }] },
      Herramientas: { multi_select: talk.herramientas.map((name) => ({ name })) },
      Descripción: { rich_text: [{ text: { content: talk.descripcion } }] },
      Speaker: { relation: [{ id: speakerId }] },
      Estado: { status: { name: "Confirmado" } },
    },
  });
}

export async function upsertSlot(params: {
  fecha: string;
  lumaEventId?: string;
  lumaUrl?: string;
}): Promise<void> {
  const notion = getNotionClient();

  const existing = await queryDatabase(getDbSlotsId(), {
    filter: { property: "Fecha", date: { equals: params.fecha } },
  });

  if (existing.results.length > 0) {
    const page = existing.results[0];
    const props = page.properties as Record<string, unknown>;
    const currentStatus = extractStatus(props);
    if (currentStatus === "Confirmado") return;

    await notion.pages.update({
      page_id: page.id as string,
      properties: {
        ...(params.lumaEventId
          ? { "Luma Event ID": { rich_text: [{ text: { content: params.lumaEventId } }] } }
          : {}),
        ...(params.lumaUrl ? { "Luma URL": { url: params.lumaUrl } } : {}),
      },
    });
  } else {
    const title = new Date(params.fecha).toLocaleDateString("es", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    await notion.pages.create({
      parent: { database_id: getDbSlotsId() },
      properties: {
        Slot: { title: [{ text: { content: title } }] },
        Fecha: { date: { start: params.fecha } },
        Estado: { status: { name: "Disponible" } },
        ...(params.lumaEventId
          ? { "Luma Event ID": { rich_text: [{ text: { content: params.lumaEventId } }] } }
          : {}),
        ...(params.lumaUrl ? { "Luma URL": { url: params.lumaUrl } } : {}),
      },
    });
  }
}
