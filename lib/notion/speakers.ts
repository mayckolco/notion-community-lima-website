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
  photo: File | null
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
      ...fotoProperty,
    },
  });

  return page.id;
}

export async function archiveSpeaker(speakerId: string): Promise<void> {
  const notion = getNotionClient();
  await notion.pages.update({
    page_id: speakerId,
    archived: true,
  });
}
