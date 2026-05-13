import { addWeeks } from "date-fns";
import { DB_SLOTS_ID, getNotionClient } from "./client";
import type { Slot, SlotEstado } from "@/lib/schemas";

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
    const text = await res.text();
    throw new Error(`Notion query failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<{ results: Array<Record<string, unknown>> }>;
}

export async function listSlots(): Promise<Slot[]> {
  const now = new Date();
  const until = addWeeks(now, 8);

  const data = await queryDatabase(DB_SLOTS_ID, {
    filter: {
      and: [
        { property: "Fecha", date: { on_or_after: now.toISOString() } },
        { property: "Fecha", date: { on_or_before: until.toISOString() } },
      ],
    },
    sorts: [{ property: "Fecha", direction: "ascending" }],
  });

  return data.results.map((page) => {
    const props = page.properties as Record<string, unknown>;
    return {
      id: ((page.id as string) ?? "").replace(/-/g, ""),
      fecha: extractDate(props) ?? "",
      estado: extractStatus(props),
      lumaUrl: extractLumaUrl(props),
    };
  });
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
    };
  } catch {
    return null;
  }
}

export async function lockSlot(slotId: string): Promise<void> {
  const notion = getNotionClient();
  await notion.pages.update({
    page_id: slotId,
    properties: {
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

  const existing = await queryDatabase(DB_SLOTS_ID, {
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
      parent: { database_id: DB_SLOTS_ID },
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
