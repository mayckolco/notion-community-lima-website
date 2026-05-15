import { DB_SPEAKERS_ID, getNotionClient } from "./client";
import type { ApplyInput } from "@/lib/schemas";

const NOTION_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
  };
}

async function uploadPhotoToNotion(photo: File): Promise<string | null> {
  try {
    const createRes = await fetch(`${NOTION_BASE}/file_uploads`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "single_part",
        filename: photo.name,
        content_type: photo.type,
      }),
    });

    if (!createRes.ok) {
      console.error("[uploadPhoto] create failed:", await createRes.text());
      return null;
    }

    const session = (await createRes.json()) as { id?: string };
    const fileUploadId = session.id;
    if (!fileUploadId) return null;

    const formData = new FormData();
    formData.append("file", photo, photo.name);

    const sendRes = await fetch(`${NOTION_BASE}/file_uploads/${fileUploadId}/send`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });

    if (!sendRes.ok) {
      console.error("[uploadPhoto] send failed:", await sendRes.text());
      return null;
    }

    return fileUploadId;
  } catch (err) {
    console.error("[uploadPhoto] unexpected error:", err);
    return null;
  }
}

export async function createSpeaker(
  data: ApplyInput,
  slotId: string,
  photo: File | null
): Promise<string> {
  const notion = getNotionClient();

  let fotoProperty: Record<string, unknown> = {};
  if (photo) {
    const fileId = await uploadPhotoToNotion(photo);
    if (fileId) {
      fotoProperty = {
        Foto: {
          files: [{ type: "file_upload", name: photo.name, file_upload: { id: fileId } }],
        },
      };
    }
  }

  const page = await notion.pages.create({
    parent: { database_id: DB_SPEAKERS_ID },
    properties: {
      "Nombre completo": { title: [{ text: { content: data.nombre } }] },
      Email: { email: data.email },
      LinkedIn: { url: data.linkedin },
      WhatsApp: { phone_number: data.whatsapp },
      Rol: { rich_text: [{ text: { content: data.rol } }] },
      Empresa: { rich_text: [{ text: { content: data.empresa } }] },
      "Título de la charla": { rich_text: [{ text: { content: data.titulo } }] },
      Descripción: { rich_text: [{ text: { content: data.descripcion } }] },
      Herramientas: { multi_select: data.herramientas.map((name) => ({ name })) },
      Estado: { status: { name: "Confirmado" } },
      Slot: { relation: [{ id: slotId }] },
      ...fotoProperty,
    },
  });

  return page.id;
}

export interface PastSpeaker {
  id: string;
  nombre: string;
  titulo: string;
  herramientas: string[];
  foto: string | null;
  linkedin: string | null;
  webinarUrl: string | null;
}

async function querySpeakers(): Promise<Array<Record<string, unknown>>> {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${DB_SPEAKERS_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "Estado", status: { equals: "Confirmado" } },
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      }),
      cache: "no-store",
    }
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { results: Array<Record<string, unknown>> };
  return data.results;
}

function parseSpeakerPage(page: Record<string, unknown>): PastSpeaker {
  const props = page.properties as Record<string, unknown>;

  const nombre =
    (props["Nombre completo"] as { title?: Array<{ plain_text?: string }> })
      ?.title?.[0]?.plain_text ?? "";

  const titulo =
    (props["Título de la charla"] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text ?? "";

  const herramientas =
    (props["Herramientas"] as { multi_select?: Array<{ name?: string }> })
      ?.multi_select?.map((t) => t.name ?? "").filter(Boolean) ?? [];

  const linkedin =
    (props["LinkedIn"] as { url?: string | null })?.url ?? null;

  const webinarRollup = props["Webinar"] as {
    rollup?: { array?: Array<{ url?: string }> };
    url?: string | null;
  };
  const webinarUrl =
    webinarRollup?.rollup?.array?.[0]?.url ??
    webinarRollup?.url ??
    null;

  const fotosRaw = (props["Foto"] as { files?: Array<Record<string, unknown>> })?.files ?? [];
  let foto: string | null = null;
  for (const f of fotosRaw) {
    if (f.type === "file_upload") {
      foto = (f.file_upload as { url?: string })?.url ?? null;
    } else if (f.type === "external") {
      foto = (f.external as { url?: string })?.url ?? null;
    } else if (f.type === "file") {
      foto = (f.file as { url?: string })?.url ?? null;
    }
    if (foto) break;
  }

  return { id: page.id as string, nombre, titulo, herramientas, foto, linkedin, webinarUrl };
}

export async function listPastSpeakers(): Promise<PastSpeaker[]> {
  const pages = await querySpeakers();
  return pages
    .map(parseSpeakerPage)
    .filter((s) => !!s.webinarUrl);
}

export async function listDirectorySpeakers(): Promise<PastSpeaker[]> {
  const pages = await querySpeakers();
  return pages.map(parseSpeakerPage);
}

export async function archiveSpeaker(speakerId: string): Promise<void> {
  const notion = getNotionClient();
  await notion.pages.update({ page_id: speakerId, archived: true });
}
