import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import {
  BOOTCAMP_CUPOS,
  BOOTCAMP_HORARIO,
  bootcampUbicacion,
  CLAUDE_BOOTCAMP,
  type BootcampFecha,
} from "@/lib/content/bootcamp";
import {
  getDbBootcampDatesId,
  getDbBootcampRegistrosId,
  getNotionClient,
} from "./client";
import { uploadPhotoToNotion } from "./speakers";
import type { ProgramaModalidad } from "@/lib/content/programas";

export type { BootcampFecha } from "@/lib/content/bootcamp";

const NOTION_VERSION = "2022-06-28";

function notionUrl(path: string): string {
  return `https://api.notion.com/v1/${path}`;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

function extractTitle(props: Record<string, unknown>): string {
  const p = props as Record<string, { title?: Array<{ plain_text?: string }> }>;
  return p["Nombre del programa"]?.title?.[0]?.plain_text ?? "";
}

function extractDate(props: Record<string, unknown>): string | null {
  const p = props as Record<string, { date?: { start?: string } }>;
  return p["Fecha"]?.date?.start ?? null;
}

function extractModalidad(props: Record<string, unknown>): ProgramaModalidad | null {
  const p = props as Record<string, { select?: { name?: string } }>;
  const name = p["Modalidad"]?.select?.name;
  if (name === "Virtual") return "virtual";
  if (name === "Presencial") return "presencial";
  return null;
}

function extractEstado(props: Record<string, unknown>): string {
  const p = props as Record<string, { status?: { name?: string } }>;
  return p["Estado"]?.status?.name ?? "";
}

function extractPersonaIds(props: Record<string, unknown>): string[] {
  const p = props as Record<string, { relation?: Array<{ id: string }> }>;
  return p["Persona"]?.relation?.map((r) => r.id) ?? [];
}

function formatFechaLabel(fecha: string): string {
  try {
    const formatted = format(parseISO(fecha), "EEEE d 'de' MMMM", { locale: es });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return fecha;
  }
}

async function queryDatabase(
  databaseId: string,
  body: Record<string, unknown>
): Promise<Array<Record<string, unknown>>> {
  const res = await fetch(notionUrl(`databases/${databaseId}/query`), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error("[bootcamp] query failed:", res.status, await res.text());
    return [];
  }
  const data = (await res.json()) as { results: Array<Record<string, unknown>> };
  return data.results;
}

export async function fetchBootcampFechas(
  modalidad: ProgramaModalidad
): Promise<BootcampFecha[]> {
  const modalidadNotion = modalidad === "virtual" ? "Virtual" : "Presencial";
  const today = startOfDay(new Date()).toISOString().slice(0, 10);

  const results = await queryDatabase(getDbBootcampDatesId(), {
    filter: {
      and: [
        { property: "Modalidad", select: { equals: modalidadNotion } },
        { property: "Estado", status: { equals: "Confirmado" } },
        { property: "Fecha", date: { on_or_after: today } },
      ],
    },
    sorts: [{ property: "Fecha", direction: "ascending" }],
    page_size: 20,
  });

  const fechas: BootcampFecha[] = [];

  for (const page of results) {
    const props = (page.properties ?? {}) as Record<string, unknown>;
    const fecha = extractDate(props);
    const pageModalidad = extractModalidad(props);
    if (!fecha || !pageModalidad) continue;

    try {
      if (isBefore(parseISO(fecha), startOfDay(new Date()))) continue;
    } catch {
      continue;
    }

    const inscritos = extractPersonaIds(props).length;
    const cuposDisponibles = Math.max(0, BOOTCAMP_CUPOS - inscritos);
    if (cuposDisponibles <= 0) continue;

    fechas.push({
      id: page.id as string,
      fecha,
      fechaLabel: formatFechaLabel(fecha),
      horario: BOOTCAMP_HORARIO,
      ubicacion: bootcampUbicacion(pageModalidad),
      modalidad: pageModalidad,
      cuposDisponibles,
      programa: extractTitle(props) || CLAUDE_BOOTCAMP.nombre,
    });
  }

  return fechas;
}

export async function getBootcampReserva(
  reservaId: string
): Promise<{ id: string; cuposDisponibles: number; modalidad: ProgramaModalidad } | null> {
  const res = await fetch(notionUrl(`pages/${reservaId}`), {
    headers: authHeaders(),
  });
  if (!res.ok) return null;

  const page = (await res.json()) as { id: string; properties: Record<string, unknown> };
  const props = page.properties;
  const modalidad = extractModalidad(props);
  const estado = extractEstado(props);
  const fecha = extractDate(props);

  if (!modalidad || estado !== "Confirmado" || !fecha) return null;

  try {
    if (isBefore(parseISO(fecha), startOfDay(new Date()))) return null;
  } catch {
    return null;
  }

  const inscritos = extractPersonaIds(props).length;
  const cuposDisponibles = Math.max(0, BOOTCAMP_CUPOS - inscritos);
  if (cuposDisponibles <= 0) return null;

  return { id: page.id, cuposDisponibles, modalidad };
}

export async function createBootcampInscripcion(params: {
  reservaId: string;
  nombre: string;
  email: string;
  whatsapp: string;
  referencia: string;
  comprobante: File;
}): Promise<{ leadId: string } | null> {
  const reserva = await getBootcampReserva(params.reservaId);
  if (!reserva) return null;

  const comprobanteId = await uploadPhotoToNotion(params.comprobante);
  if (!comprobanteId) return null;

  const whatsappDigits = params.whatsapp.replace(/\D/g, "");
  const phoneFormatted = whatsappDigits
    ? whatsappDigits.startsWith("51")
      ? `+${whatsappDigits}`
      : `+51${whatsappDigits}`
    : null;

  const notion = getNotionClient();

  const lead = await notion.pages.create({
    parent: { database_id: getDbBootcampRegistrosId() },
    properties: {
      Nombre: { title: [{ text: { content: params.nombre } }] },
      Correo: { email: params.email },
      ...(phoneFormatted ? { WhatsApp: { phone_number: phoneFormatted } } : {}),
      Programa: { relation: [{ id: params.reservaId }] },
      "Estado del pago": { status: { name: "Pendiente" } },
      Comprobante: {
        files: [
          {
            type: "file_upload",
            name: params.comprobante.name,
            file_upload: { id: comprobanteId },
          },
        ],
      },
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: `Referencia de pago: ${params.referencia}` },
            },
          ],
        },
      },
    ],
  });

  const reservaPage = await fetch(notionUrl(`pages/${params.reservaId}`), {
    headers: authHeaders(),
  });
  if (reservaPage.ok) {
    const reservaData = (await reservaPage.json()) as {
      properties: Record<string, unknown>;
    };
    const existingIds = extractPersonaIds(reservaData.properties);

    await notion.pages.update({
      page_id: params.reservaId,
      properties: {
        Persona: { relation: [...existingIds, lead.id].map((id) => ({ id })) },
        ...(existingIds.length + 1 >= BOOTCAMP_CUPOS
          ? { Estado: { status: { name: "Reservado" } } }
          : {}),
      },
    });
  }

  return { leadId: lead.id };
}

export async function appendBootcampEncuesta(
  leadId: string,
  encuesta: {
    dedicacion: string;
    nivelIa: string;
    problema: string;
    herramientas: string[];
    expectativas: string;
  }
): Promise<boolean> {
  const notion = getNotionClient();

  try {
    await notion.pages.update({
      page_id: leadId,
      properties: {
        Rol: { rich_text: [{ text: { content: encuesta.dedicacion.slice(0, 2000) } }] },
        Empresa: {
          rich_text: [
            {
              text: {
                content: `Nivel IA: ${encuesta.nivelIa}`.slice(0, 2000),
              },
            },
          ],
        },
      },
    });

    await notion.blocks.children.append({
      block_id: leadId,
      children: [
        {
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [{ type: "text", text: { content: "Encuesta post-inscripción" } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: `¿A qué te dedicas?: ${encuesta.dedicacion}` },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: `Nivel con IA: ${encuesta.nivelIa}` },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: `Problema a resolver: ${encuesta.problema}` },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `Herramientas de interés: ${encuesta.herramientas.join(", ")}`,
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: `Expectativas: ${encuesta.expectativas}` },
              },
            ],
          },
        },
      ],
    });

    return true;
  } catch (err) {
    console.error("[bootcamp] encuesta append failed:", err);
    return false;
  }
}
