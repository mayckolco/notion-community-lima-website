import { z } from "zod";

// Notion IDs arrive without dashes (32 hex chars)
const notionId = z
  .string()
  .regex(/^[0-9a-f]{32}$/i, "ID de slot inválido");

const linkedinUrl = z
  .string()
  .refine(
    (val) => {
      if (!val) return true;
      try {
        const url = new URL(val);
        return (
          (url.protocol === "https:" || url.protocol === "http:") &&
          (url.hostname === "linkedin.com" || url.hostname === "www.linkedin.com")
        );
      } catch {
        return false;
      }
    },
    "Debe ser una URL válida de linkedin.com"
  );

const whatsappNumber = z
  .string()
  .refine(
    (val) => {
      if (!val) return true;
      const digits = val.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    },
    "Número de WhatsApp inválido (7–15 dígitos)"
  );

export const applySchema = z.object({
  slotId: notionId,
  nombre: z.string().min(1, "El nombre es requerido").min(2, "Mínimo 2 caracteres"),
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  linkedin: linkedinUrl.optional().or(z.literal("")),
  titulo: z.string().min(1, "El título es requerido").min(5, "Mínimo 5 caracteres"),
  whatsapp: whatsappNumber.optional().or(z.literal("")),
  rol: z.string().min(1, "El rol es requerido"),
  empresa: z.string().min(1, "La empresa es requerida"),
  descripcion: z.string().min(1, "La descripción es requerida").min(20, "Mínimo 20 caracteres").max(2000, "Máximo 2000 caracteres"),
  herramientas: z.array(z.string()).min(1, "Selecciona al menos una herramienta"),
});

export type ApplyInput = z.infer<typeof applySchema>;

export const newsletterSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  nombre: z.string().max(80).optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

const notionIdDashed = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "ID inválido"
  );

export const bootcampInscripcionSchema = z.object({
  reservaId: notionIdDashed,
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(120),
  email: z.string().email("Email inválido"),
  whatsapp: z
    .string()
    .min(1, "WhatsApp requerido")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      },
      "Número de WhatsApp inválido (7–15 dígitos)"
    ),
  referencia: z
    .string()
    .regex(/^CP-[A-Z]{1,4}-[A-Z0-9]{4,8}$/, "Referencia inválida"),
});

export type BootcampInscripcionInput = z.infer<typeof bootcampInscripcionSchema>;

export const BOOTCAMP_NIVEL_IA_OPTIONS = [
  "Nunca las he usado",
  "Las he probado pero muy poco",
  "Las uso ocasionalmente",
  "Las uso regularmente en mi trabajo",
] as const;

export const BOOTCAMP_HERRAMIENTAS_OPTIONS = [
  "ChatGPT",
  "Claude",
  "Midjourney",
  "Gemini",
  "Notion AI",
  "No sé por dónde empezar",
] as const;

export const bootcampEncuestaSchema = z.object({
  leadId: notionIdDashed,
  dedicacion: z.string().min(2, "Cuéntanos a qué te dedicas").max(500),
  nivelIa: z.enum(BOOTCAMP_NIVEL_IA_OPTIONS),
  problema: z.string().min(10, "Describe tu problema con más detalle").max(2000),
  herramientas: z
    .array(z.enum(BOOTCAMP_HERRAMIENTAS_OPTIONS))
    .min(1, "Elige al menos una herramienta"),
  expectativas: z.string().min(5, "Cuéntanos qué esperas").max(2000),
});

export type BootcampEncuestaInput = z.infer<typeof bootcampEncuestaSchema>;

export const HERRAMIENTAS_OPTIONS = [
  "Notion",
  "Make",
  "n8n",
  "Supabase",
  "Zapier",
  "V0",
  "Replit",
  "Cursor",
  "Claude Code",
  "Codex",
  "Windsurf",
  "Antigravity",
  "Lovable",
  "Bolt",
  "Claude",
  "ChatGPT",
  "Otros",
] as const;

export type SlotEstado =
  | "Disponible"
  | "Reservado"
  | "Confirmado"
  | "Cover lista"
  | "Copys listos"
  | "Bloqueado"
  | "Publicado"
  | "En promoción";

export interface SlotSpeaker {
  nombre: string;
  foto: string | null;
  rol: string | null;
  empresa: string | null;
}

export interface Slot {
  id: string;
  fecha: string;
  estado: SlotEstado;
  lumaUrl: string | null;
  titulo: string | null;
  descripcion: string | null;
  herramientas: string[];
  speaker: SlotSpeaker | null;
}

export type SpeakerEtiqueta = "speaker" | "admin" | "colaborador";

export interface AdminSpeaker {
  nombre: string;
  email: string;
  foto: string | null;
  rol: string | null;
  empresa: string | null;
  etiqueta: SpeakerEtiqueta;
}

export interface AdminSlot {
  id: string;
  titulo: string | null;
  fecha: string | null;
  estado: SlotEstado;
  registrados: number | null;
  asistentes: number | null;
  speaker: AdminSpeaker | null;
}
