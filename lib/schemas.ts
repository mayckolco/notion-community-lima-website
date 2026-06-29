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
