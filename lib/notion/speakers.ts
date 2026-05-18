import { getDbSpeakersId, getNotionClient } from "./client";
import type { ApplyInput } from "@/lib/schemas";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const NOTION_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
  };
}

export async function uploadPhotoToNotion(photo: File): Promise<string | null> {
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
      console.error("[uploadPhoto] create failed with status:", createRes.status);
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
      console.error("[uploadPhoto] send failed with status:", sendRes.status);
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
    `${NOTION_BASE}/databases/${getDbSpeakersId()}/query`,
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
  photo: File | null,
  fotoId?: string
): Promise<string> {
  const notion = getNotionClient();

  let resolvedFotoId = fotoId ?? null;
  let fotoName = "foto.jpg";

  if (!resolvedFotoId && photo) {
    resolvedFotoId = await uploadPhotoToNotion(photo);
    fotoName = photo.name;
  }

  const fotoProperty: Record<string, unknown> = resolvedFotoId
    ? { Foto: { files: [{ type: "file_upload", name: fotoName, file_upload: { id: resolvedFotoId } }] } }
    : {};

  const whatsappDigits = (data.whatsapp ?? "").replace(/\D/g, "");
  const whatsappNum = whatsappDigits ? parseInt(whatsappDigits, 10) : null;

  const page = await notion.pages.create({
    parent: { database_id: getDbSpeakersId() },
    properties: {
      "Nombre completo": { title: [{ text: { content: data.nombre } }] },
      Email: { email: data.email },
      LinkedIn: { url: data.linkedin || null },
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
  slug: string;
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
      `https://api.notion.com/v1/databases/${getDbSpeakersId()}/query`,
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
  const slug = slugify(nombre);

  return { id: page.id as string, slug, nombre, rol, empresa, titulo, descripcion, biografia, herramientas, foto, linkedin, webinarUrl };
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

export async function getSpeakerBySlug(slug: string): Promise<PastSpeaker | null> {
  const allResults: Array<Record<string, unknown>> = [];
  let cursor: string | undefined = undefined;

  do {
    const res = await fetch(`${NOTION_BASE}/databases/${getDbSpeakersId()}/query`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        page_size: 100,
        sorts: [{ timestamp: "created_time", direction: "descending" }],
        ...(cursor ? { start_cursor: cursor } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) break;
    const data = (await res.json()) as {
      results: Array<Record<string, unknown>>;
      has_more: boolean;
      next_cursor: string | null;
    };
    allResults.push(...data.results);
    cursor = data.has_more && data.next_cursor ? data.next_cursor : undefined;
  } while (cursor);

  const match = allResults.map(parseSpeakerPage).find((s) => s.slug === slug);
  return match ?? null;
}

export async function getSpeakerById(id: string): Promise<PastSpeaker | null> {
  const notion = getNotionClient();
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const speaker = parseSpeakerPage(page as Record<string, unknown>);

    // Resolve herramientas from the linked Webinar
    const props = (page as Record<string, unknown>).properties as Record<string, unknown>;
    const slotRelation = (props["Slot"] as { relation?: Array<{ id: string }> })?.relation ?? [];
    if (slotRelation.length > 0) {
      try {
        const webinarPage = await notion.pages.retrieve({ page_id: slotRelation[0].id });
        const wp = (webinarPage as Record<string, unknown>).properties as Record<string, unknown>;
        const herramientas = (wp["Herramientas"] as { multi_select?: Array<{ name?: string }> })
          ?.multi_select?.map((t) => t.name ?? "").filter(Boolean) ?? [];
        return { ...speaker, herramientas };
      } catch {
        // Webinar not accessible, return speaker without herramientas
      }
    }

    return speaker;
  } catch {
    return null;
  }
}

export interface SpeakerWebinar {
  id: string;
  titulo: string;
  fecha: string | null;
  webinarUrl: string | null;
  herramientas: string[];
}

export async function getWebinarsBySpeakerId(speakerId: string): Promise<SpeakerWebinar[]> {
  const notion = getNotionClient();

  let page: Record<string, unknown>;
  try {
    page = (await notion.pages.retrieve({ page_id: speakerId })) as Record<string, unknown>;
  } catch {
    return [];
  }

  const props = page.properties as Record<string, unknown>;
  const slotRelation = (props["Slot"] as { relation?: Array<{ id: string }> })?.relation ?? [];
  if (slotRelation.length === 0) return [];

  const webinarPages = await Promise.all(
    slotRelation.map(({ id }) =>
      notion.pages.retrieve({ page_id: id }).catch(() => null)
    )
  );

  return webinarPages
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((wp) => {
      const w = (wp as Record<string, unknown>).properties as Record<string, unknown>;

      const titulo =
        (w["Título"] as { title?: Array<{ plain_text?: string }> })
          ?.title?.[0]?.plain_text ?? "";

      const fecha =
        (w["Fecha"] as { date?: { start?: string } })?.date?.start ?? null;

      const webinarUrl =
        (w["Webinar URL"] as { url?: string | null })?.url ?? null;

      const herramientas =
        (w["Herramientas"] as { multi_select?: Array<{ name?: string }> })
          ?.multi_select?.map((t) => t.name ?? "").filter(Boolean) ?? [];

      return {
        id: (wp as Record<string, unknown>).id as string,
        titulo,
        fecha,
        webinarUrl,
        herramientas,
      };
    })
    .filter((w) => !!w.titulo);
}

export async function archiveSpeaker(speakerId: string): Promise<void> {
  const notion = getNotionClient();
  await notion.pages.update({ page_id: speakerId, archived: true });
}
