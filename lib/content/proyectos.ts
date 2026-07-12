export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  stack: string[];
  url?: string;
  github?: string;
  autor: string;
  destacado?: boolean;
}

export const PROYECTOS_COMUNIDAD: Proyecto[] = [
  {
    id: "speakers-platform",
    nombre: "Portal de Speakers Claude Perú",
    descripcion:
      "Plataforma para gestionar charlas, covers, grabaciones y portal de speakers. Backend 100% Notion con auth magic link.",
    stack: ["Next.js", "Notion API", "Resend", "Tailwind"],
    url: "https://speakers.mayckolco.com",
    autor: "Claude Perú",
    destacado: true,
  },
  {
    id: "agente-notion",
    nombre: "Agente de reportes con Claude",
    descripcion:
      "Bot que consulta Notion, genera reportes semanales y envía resúmenes por WhatsApp usando Claude API y MCP.",
    stack: ["Claude API", "MCP", "Notion", "n8n"],
    autor: "Builder de la comunidad",
  },
  {
    id: "claude-code-starter",
    nombre: "Starter kit Claude Code",
    descripcion:
      "Plantilla con CLAUDE.md, hooks de pre-commit y flujos de PR automatizados para equipos que empiezan con Claude Code.",
    stack: ["Claude Code", "TypeScript", "GitHub Actions"],
    github: "https://github.com",
    autor: "Builder de la comunidad",
  },
  {
    id: "prompt-library",
    nombre: "Biblioteca de prompts en español",
    descripcion:
      "Colección curada de system prompts para ventas, contenido, código y análisis, probados por speakers de Claude Perú.",
    stack: ["Claude", "Notion"],
    autor: "Comunidad Claude Perú",
  },
  {
    id: "luma-sync",
    nombre: "Sync automático de eventos Luma",
    descripcion:
      "Cron job que sincroniza eventos de Luma con la base de datos de slots para mantener el calendario actualizado.",
    stack: ["Next.js", "Luma API", "Notion", "Vercel Cron"],
    autor: "Claude Perú",
  },
  {
    id: "cover-generator",
    nombre: "Generador de covers para charlas",
    descripcion:
      "Flujo con Claude para generar copy y assets de promoción (Instagram, LinkedIn, Stories) para cada webinar.",
    stack: ["Claude", "Figma", "Make"],
    autor: "Builder de la comunidad",
  },
];
