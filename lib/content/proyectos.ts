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
    nombre: "Portal de Speakers Notion Lima",
    descripcion:
      "Plataforma para gestionar charlas, covers, grabaciones y portal de speakers. Backend 100% Notion con auth magic link.",
    stack: ["Next.js", "Notion API", "Resend", "Tailwind"],
    url: "https://notion.mayckolco.com",
    autor: "Notion Lima",
    destacado: true,
  },
  {
    id: "notion-crm",
    nombre: "CRM personal en Notion",
    descripcion:
      "Sistema de gestión de contactos y seguimiento de oportunidades construido 100% en Notion con vistas Kanban, filtros y Notion AI para resúmenes de reuniones.",
    stack: ["Notion", "Notion AI", "Make"],
    autor: "Miembro de la comunidad",
  },
  {
    id: "notion-dashboard",
    nombre: "Dashboard de empresa en Notion",
    descripcion:
      "Workspace completo para una startup: OKRs, proyectos, wiki, onboarding y reuniones en un solo espacio conectado.",
    stack: ["Notion", "Make", "Google Calendar"],
    autor: "Miembro de la comunidad",
  },
  {
    id: "template-library",
    nombre: "Biblioteca de templates en español",
    descripcion:
      "Colección curada de templates para gestión personal, freelancers y equipos, probados y compartidos por speakers de Notion Lima.",
    stack: ["Notion", "Notion AI"],
    autor: "Comunidad Notion Lima",
  },
  {
    id: "luma-sync",
    nombre: "Sync automático de eventos Luma",
    descripcion:
      "Cron job que sincroniza eventos de Luma con la base de datos de slots en Notion para mantener el calendario actualizado.",
    stack: ["Next.js", "Luma API", "Notion", "Vercel Cron"],
    autor: "Notion Lima",
  },
  {
    id: "notion-make-flows",
    nombre: "Flujos de automatización con Notion + Make",
    descripcion:
      "Serie de automatizaciones que conectan Notion con Gmail, Slack y Google Sheets para sincronizar datos sin esfuerzo manual.",
    stack: ["Notion API", "Make", "Gmail", "Google Sheets"],
    autor: "Miembro de la comunidad",
  },
];
