import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import {
  BOOTCAMP_HORARIO,
  getBootcampCupos,
  bootcampUbicacion,
  NOTION_BOOTCAMP,
  type BootcampFecha,
} from "@/lib/content/bootcamp";
import {
  getDbBootcampDatesId,
  getNotionClient,
} from "./client";
import { uploadPhotoToNotion } from "./speakers";
import type { ProgramaModalidad } from "@/lib/content/programas";

export type { BootcampFecha } from "@/lib/content/bootcamp";

const NOTION_VERSION = "2022-06-28";

/** Estados de cohorte visibles en la web (deben existir en Notion → Estado). */
const BOOTCAMP_ESTADOS_DISPONIBLES = ["Confirmado"] as const;

function isBootcampEstadoDisponible(estado: string): boolean {
  return (BOOTCAMP_ESTADOS_DISPONIBLES as readonly string[]).includes(estado);
}

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
        {
          or: BOOTCAMP_ESTADOS_DISPONIBLES.map((estado) => ({
            property: "Estado",
            status: { equals: estado },
          })),
        },
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
    const cuposMax = getBootcampCupos(pageModalidad);
    const cuposDisponibles = Math.max(0, cuposMax - inscritos);
    if (cuposDisponibles <= 0) continue;

    fechas.push({
      id: page.id as string,
      fecha,
      fechaLabel: formatFechaLabel(fecha),
      horario: BOOTCAMP_HORARIO,
      ubicacion: bootcampUbicacion(pageModalidad),
      modalidad: pageModalidad,
      cuposDisponibles,
      programa: extractTitle(props) || NOTION_BOOTCAMP.nombre,
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

  if (!modalidad || !isBootcampEstadoDisponible(estado) || !fecha) return null;

  try {
    if (isBefore(parseISO(fecha), startOfDay(new Date()))) return null;
  } catch {
    return null;
  }

  const inscritos = extractPersonaIds(props).length;
  const cuposMax = getBootcampCupos(modalidad);
  const cuposDisponibles = Math.max(0, cuposMax - inscritos);
  if (cuposDisponibles <= 0) return null;

  return { id: page.id, cuposDisponibles, modalidad };
}

async function resolveBootcampRegistrosDbId(): Promise<string> {
  const fromEnv = process.env.DB_BOOTCAMP_REGISTROS_ID;
  if (fromEnv) return fromEnv;

  const res = await fetch(notionUrl(`databases/${getDbBootcampDatesId()}`), {
    headers: authHeaders(),
  });
  if (!res.ok) {
    console.error("[bootcamp] could not read dates DB schema:", res.status);
    throw new Error("Could not resolve bootcamp registros database");
  }

  const db = (await res.json()) as {
    properties: Record<string, { type?: string; relation?: { database_id?: string } }>;
  };
  const targetId = db.properties?.Persona?.relation?.database_id;
  if (!targetId) {
    throw new Error("Persona relation on bootcamp dates DB has no linked database");
  }
  return targetId;
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

  const registrosDbId = await resolveBootcampRegistrosDbId();

  const lead = await notion.pages.create({
    parent: { database_id: registrosDbId },
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
        ...(existingIds.length + 1 >= getBootcampCupos(reserva.modalidad)
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
        "¿A qué te dedicas actualmente?": {
          rich_text: [{ text: { content: encuesta.dedicacion.slice(0, 2000) } }],
        },
        "¿Cuál es tu nivel actual con herramientas de IA?": {
          select: { name: encuesta.nivelIa },
        },
        "¿Cuál es el mayor problema en tu trabajo que quisieras resolver con IA?": {
          rich_text: [{ text: { content: encuesta.problema.slice(0, 2000) } }],
        },
        "¿Qué herramienta de IA te genera más curiosidad?": {
          multi_select: encuesta.herramientas.map((name) => ({ name })),
        },
        "¿Qué esperas llevarte del laboratorio?": {
          rich_text: [{ text: { content: encuesta.expectativas.slice(0, 2000) } }],
        },
      },
    });

    return true;
  } catch (err) {
    console.error("[bootcamp] encuesta update failed:", err);
    return false;
  }
}
