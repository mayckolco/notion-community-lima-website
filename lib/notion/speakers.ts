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
    // Step 1: Create file upload session
    const createRes = await fetch(`${NOTION_BASE}/file_uploads`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
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

    // Step 2: Send the file bytes
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
  photo: File | null,
  linkedinBio?: string
): Promise<string> {
  const notion = getNotionClient();

  let fotoProperty: Record<string, unknown> = {};
  if (photo) {
    const fileId = await uploadPhotoToNotion(photo);
    if (fileId) {
      fotoProperty = {
        Foto: {
          files: [
            {
              type: "file_upload",
              name: photo.name,
              file_upload: { id: fileId },
            },
          ],
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
      "Título de la charla": {
        rich_text: [{ text: { content: data.titulo } }],
      },
      Descripción: {
        rich_text: [{ text: { content: data.descripcion } }],
      },
      Herramientas: {
        multi_select: data.herramientas.map((name) => ({ name })),
      },
      Estado: { status: { name: "Confirmado" } },
      Slot: { relation: [{ id: slotId }] },
      ...(linkedinBio
        ? { "Biografía": { rich_text: [{ text: { content: linkedinBio.slice(0, 2000) } }] } }
        : {}),
      ...fotoProperty,
    },
  });

  return page.id;
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

interface DateObj { month?: number; year?: number }
interface Position {
  title?: string;
  company?: { name?: string };
  timePeriod?: { startDate?: DateObj; endDate?: DateObj | null };
  totalDuration?: string;
  description?: string;
  locationName?: string;
}
interface Education {
  schoolName?: string;
  degreeName?: string;
  fieldOfStudy?: string;
  timePeriod?: { startDate?: DateObj; endDate?: DateObj | null };
}

function formatDate(d?: DateObj | null): string {
  if (!d) return "Presente";
  const m = d.month ? MONTHS[d.month - 1] : "";
  return [m, d.year].filter(Boolean).join(" ");
}

function h2(text: string) {
  return { object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: text } }] } };
}
function paragraph(text: string) {
  return { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: text.slice(0, 2000) } }] } };
}
function bullet(text: string) {
  return { object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: text.slice(0, 2000) } }] } };
}
// Split long text into multiple paragraph blocks (Notion limit: 2000 chars per element)
function paragraphs(text: string): object[] {
  const blocks: object[] = [];
  for (let i = 0; i < text.length; i += 2000) {
    blocks.push(paragraph(text.slice(i, i + 2000)));
  }
  return blocks;
}

export interface LinkedInPageData {
  headline?: string | null;
  summary?: string | null;
  positions?: Position[];
  educations?: Education[];
}

export async function appendLinkedInContent(pageId: string, data: LinkedInPageData): Promise<void> {
  const notion = getNotionClient();

  // Skip if page already has content blocks (avoid duplicates)
  const existing = await notion.blocks.children.list({ block_id: pageId });
  if (existing.results.length > 0) return;

  const blocks: object[] = [];

  if (data.headline) {
    blocks.push(h2("Headline"), ...paragraphs(data.headline));
  }

  if (data.summary) {
    blocks.push(h2("Acerca de"), ...paragraphs(data.summary));
  }

  if (data.positions?.length) {
    blocks.push(h2("Experiencia"));
    for (const pos of data.positions) {
      const company = pos.company?.name ?? "";
      const start = formatDate(pos.timePeriod?.startDate);
      const end = pos.timePeriod?.endDate ? formatDate(pos.timePeriod.endDate) : "Presente";
      const duration = pos.totalDuration ? ` (${pos.totalDuration})` : "";
      const location = pos.locationName ? ` · ${pos.locationName}` : "";
      let line = pos.title ?? "";
      if (company) line += ` en ${company}`;
      line += ` · ${start} – ${end}${duration}${location}`;
      blocks.push(bullet(line));
      if (pos.description) blocks.push(...paragraphs(pos.description));
    }
  }

  if (data.educations?.length) {
    blocks.push(h2("Educación"));
    for (const edu of data.educations) {
      const degree = [edu.degreeName, edu.fieldOfStudy].filter(Boolean).join(", ");
      const start = formatDate(edu.timePeriod?.startDate);
      const end = edu.timePeriod?.endDate ? formatDate(edu.timePeriod.endDate) : "Presente";
      let line = edu.schoolName ?? "";
      if (degree) line += ` · ${degree}`;
      if (edu.timePeriod?.startDate) line += ` · ${start} – ${end}`;
      blocks.push(bullet(line));
    }
  }

  if (!blocks.length) return;

  // Notion allows max 100 blocks per request — batch if needed
  for (let i = 0; i < blocks.length; i += 100) {
    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks.slice(i, i + 100) as Parameters<typeof notion.blocks.children.append>[0]["children"],
    });
  }
}

export async function updateSpeakerBio(speakerId: string, bio: string): Promise<void> {
  const notion = getNotionClient();
  await notion.pages.update({
    page_id: speakerId,
    properties: {
      "Biografía": { rich_text: [{ text: { content: bio.slice(0, 2000) } }] },
    },
  });
}

export async function archiveSpeaker(speakerId: string): Promise<void> {
  const notion = getNotionClient();
  await notion.pages.update({
    page_id: speakerId,
    archived: true,
  });
}
