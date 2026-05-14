import { HERRAMIENTAS_OPTIONS } from "@/lib/schemas";
import type { LinkedInProfile } from "./apify";

const SKILL_MAP: Record<string, string> = {
  // AI / LLMs
  "chatgpt": "ChatGPT",
  "openai": "ChatGPT",
  "claude": "Claude",
  "anthropic": "Claude",
  "langchain": "LangChain",
  "llm": "LangChain",
  // Automation
  "make": "Make",
  "integromat": "Make",
  "n8n": "n8n",
  "zapier": "Make",
  // Dev
  "replit": "Replit",
  "cursor": "Cursor",
  "lovable": "Lovable",
  "bolt": "Bolt",
  "supabase": "Supabase",
  "vercel": "Vercel",
  // Productivity
  "notion": "Notion",
};

export interface FormPrefill {
  nombre: string | null;
  titulo: string | null;
  descripcion: string | null;
  herramientas: string[];
  photoUrl: string | null;
}

export function mapLinkedInToForm(profile: LinkedInProfile): FormPrefill {
  const herramientas: string[] = [];

  for (const skill of profile.skills) {
    const key = skill.toLowerCase();
    const match = Object.entries(SKILL_MAP).find(([k]) => key.includes(k));
    if (match) {
      const tool = match[1];
      if (
        HERRAMIENTAS_OPTIONS.includes(tool as (typeof HERRAMIENTAS_OPTIONS)[number]) &&
        !herramientas.includes(tool)
      ) {
        herramientas.push(tool);
      }
    }
  }

  const titulo = profile.headline
    ? `Charla sobre ${profile.headline.split("|")[0].trim()}`
    : null;

  return {
    nombre: profile.fullName,
    titulo,
    descripcion: profile.summary,
    herramientas,
    photoUrl: profile.profilePicture,
  };
}
