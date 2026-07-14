import { NOTION_URL, NOTION_TEMPLATES_URL } from "./constants";

export interface NotionProduct {
  id: string;
  nombre: string;
  tagline: string;
  descripcion: string;
  paraQuien: string;
  url: string;
  destacado?: boolean;
}

export const NOTION_PRODUCTS: NotionProduct[] = [
  {
    id: "notion-workspace",
    nombre: "Notion",
    tagline: "Tu workspace todo en uno",
    descripcion:
      "Docs, bases de datos, wikis y proyectos en un solo lugar. Organiza notas, procesos y conocimiento de tu equipo con total flexibilidad.",
    paraQuien: "Profesionales, equipos y founders que quieren un sistema propio sin depender de múltiples apps.",
    url: NOTION_URL,
    destacado: true,
  },
  {
    id: "notion-ai",
    nombre: "Notion AI",
    tagline: "IA dentro de tu workspace",
    descripcion:
      "Redacta, resume, traduce y organiza con IA directamente en tus páginas. Búsqueda inteligente en todo tu workspace y generación de contenido con contexto.",
    paraQuien: "Usuarios que quieren aprovechar la IA sin salir de su sistema de trabajo.",
    url: "https://notion.so/product/ai",
  },
  {
    id: "notion-calendar",
    nombre: "Notion Calendar",
    tagline: "Gestiona tu tiempo con contexto",
    descripcion:
      "Calendario integrado con tu workspace. Ve tus eventos junto a tus proyectos y tareas. Conecta con Google Calendar y mantén todo en un solo flujo.",
    paraQuien: "Personas que quieren unificar agenda y trabajo en Notion.",
    url: "https://notion.so/product/calendar",
  },
  {
    id: "notion-templates",
    nombre: "Templates",
    tagline: "Empieza desde un sistema probado",
    descripcion:
      "Más de 500 templates creados por la comunidad y el equipo de Notion. Desde gestión personal hasta operaciones completas de empresa.",
    paraQuien: "Cualquiera que quiera arrancar rápido con un sistema ya diseñado.",
    url: NOTION_TEMPLATES_URL,
  },
];
