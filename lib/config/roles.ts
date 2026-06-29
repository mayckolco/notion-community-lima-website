import type { SpeakerEtiqueta } from "@/lib/schemas";

const ADMIN_EMAILS: string[] = [
  "mayckolco@gmail.com",
];

const COLABORADOR_EMAILS: string[] = [
  "scondoripan@unsa.edu.pe",
  "jfloresmacias99@gmail.com",
];

export function getSpeakerEtiqueta(email: string): SpeakerEtiqueta {
  const normalized = email.toLowerCase();
  if (ADMIN_EMAILS.includes(normalized)) return "admin";
  if (COLABORADOR_EMAILS.includes(normalized)) return "colaborador";
  return "speaker";
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isColaboradorEmail(email: string): boolean {
  return COLABORADOR_EMAILS.includes(email.toLowerCase());
}

export function isPrivilegedEmail(email: string): boolean {
  return isAdminEmail(email) || isColaboradorEmail(email);
}

// Sentinel speakerId used for admin users not in the speakers DB
export const ADMIN_SPEAKER_ID = "__admin__";
