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

export async function findSpeakerByEmail(email: string): Promise<string | null> {
  const res = await fetch(
    `${NOTION_BASE}/databases/${DB_SPEAKERS_ID}/query`,
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: { property: "Email", email: { equals: email } },
        page_size: 1,
      }),
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { results: Array<{ id: string }> };
  if (data.results.length === 0) return null;
  return data.results[0].id;
}

export async function createSpeakerProfile(
  data: ApplyInput,
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

  const whatsappDigits = data.whatsapp.replace(/\D/g, "");
  const whatsappNum = whatsappDigits ? parseInt(whatsappDigits, 10) : null;

  const page = await notion.pages.create({
    parent: { database_id: DB_SPEAKERS_ID },
    properties: {
      "Nombre completo": { title: [{ text: { content: data.nombre } }] },
      Email: { email: data.email },
      LinkedIn: { url: data.linkedin },
      ...(whatsappNum !== null ? { Whatsapp: { number: whatsappNum } } : {}),
      Rol: { rich_text: [{ text: { content: data.rol } }] },
      Empresa: { rich_text: [{ text: { content: data.empresa } }] },
      Estado: { status: { name: "Aplicado" } },
      ...fotoProperty,
    },
  });

  return page.id;
}

export interface PastSpeaker {
  id: string;
  nombre: string;
  rol: string | null;
  empresa: string | null;
  titulo: string;
  descripcion: string | null;
  biografia: string | null;
  herramientas: string[];
  foto: string | null;
  linkedin: string | null;
  webinarUrl: string | null;
}

async function querySpeakers(): Promise<Array<Record<string, unknown>>> {
  const allResults: Array<Record<string, unknown>> = [];
  let cursor: string | undefined = undefined;

  do {
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
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
        }),
        cache: "no-store",
      }
    );
    if (!res.ok) break;
    const data = (await res.json()) as {
      results: Array<Record<string, unknown>>;
      has_more: boolean;
      next_cursor: string | null;
    };
    allResults.push(...data.results);
    cursor = data.has_more && data.next_cursor ? data.next_cursor : undefined;
  } while (cursor);

  return allResults;
}

function parseSpeakerPage(page: Record<string, unknown>): PastSpeaker {
  const props = page.properties as Record<string, unknown>;

  const nombre =
    (props["Nombre completo"] as { title?: Array<{ plain_text?: string }> })
      ?.title?.[0]?.plain_text ?? "";

  const linkedin =
    (props["LinkedIn"] as { url?: string | null })?.url ?? null;

  const descripcion =
    (props["Descripción"] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text ?? null;

  const rol =
    (props["Rol"] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text ?? null;

  const empresa =
    (props["Empresa"] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text ?? null;

  const webinarRollup = props["Webinar URL"] as {
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

  const biografia =
    (props["Biografía"] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text ?? null;

  // titulo and herramientas come from the linked Webinar — not stored in Speaker
  const titulo = "";
  const herramientas: string[] = [];

  return { id: page.id as string, nombre, rol, empresa, titulo, descripcion, biografia, herramientas, foto, linkedin, webinarUrl };
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

export async function getSpeakerById(id: string): Promise<PastSpeaker | null> {
  const notion = getNotionClient();
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    return parseSpeakerPage(page as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function archiveSpeaker(speakerId: string): Promise<void> {
  const notion = getNotionClient();
  await notion.pages.update({ page_id: speakerId, archived: true });
}
