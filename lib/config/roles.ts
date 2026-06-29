import type { SpeakerEtiqueta } from "@/lib/schemas";

const ADMIN_EMAILS: string[] = [
  // "email@ejemplo.com",
];

const COLABORADOR_EMAILS: string[] = [
  // "email@ejemplo.com",
];

export function getSpeakerEtiqueta(email: string): SpeakerEtiqueta {
  const normalized = email.toLowerCase();
  if (ADMIN_EMAILS.includes(normalized)) return "admin";
  if (COLABORADOR_EMAILS.includes(normalized)) return "colaborador";
  return "speaker";
}
