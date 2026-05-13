import { z } from "zod";

export const applySchema = z.object({
  slotId: z.string().min(1, "Selecciona una fecha"),
  nombre: z.string().min(1, "El nombre es requerido").min(2, "Mínimo 2 caracteres"),
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  linkedin: z.string().min(1, "El LinkedIn es requerido").url("URL de LinkedIn inválida"),
  titulo: z.string().min(1, "El título es requerido").min(5, "Mínimo 5 caracteres"),
  descripcion: z.string().min(1, "La descripción es requerida").min(20, "Mínimo 20 caracteres").max(1000),
  herramientas: z.array(z.string()).min(1, "Selecciona al menos una herramienta"),
});

export type ApplyInput = z.infer<typeof applySchema>;

export const HERRAMIENTAS_OPTIONS = [
  "Claude",
  "ChatGPT",
  "Make",
  "n8n",
  "Notion",
  "Replit",
  "Cursor",
  "Lovable",
  "Bolt",
  "Supabase",
  "Vercel",
  "LangChain",
  "Other",
] as const;

export type SlotEstado =
  | "Disponible"
  | "Reservado"
  | "Confirmado"
  | "Bloqueado"
  | "Realizado";

export interface Slot {
  id: string;
  fecha: string;
  estado: SlotEstado;
  lumaUrl: string | null;
}
