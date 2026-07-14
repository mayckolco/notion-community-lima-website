export type NovedadTag = "feature" | "producto" | "api" | "template";

export interface Novedad {
  id: string;
  fecha: string;
  titulo: string;
  resumen: string;
  url?: string;
  tag: NovedadTag;
}

export const NOVEDAD_TAGS: Record<NovedadTag, string> = {
  feature: "Feature",
  producto: "Producto",
  api: "API",
  template: "Template",
};

/** Mantener manualmente. Actualizar cuando Notion anuncie novedades relevantes. */
export const NOTION_NOVEDADES: Novedad[] = [
  {
    id: "notion-ai-search",
    fecha: "2026-06-10",
    titulo: "Notion AI: búsqueda inteligente en todo el workspace",
    resumen:
      "Notion lanzó búsqueda semántica con IA que entiende el contexto de tus preguntas y devuelve respuestas directas desde cualquier página de tu workspace, sin necesidad de saber exactamente qué buscar.",
    url: "https://notion.so/product/ai",
    tag: "feature",
  },
  {
    id: "notion-calendar-tasks",
    fecha: "2026-05-20",
    titulo: "Notion Calendar integra tareas de bases de datos",
    resumen:
      "Ahora puedes ver tus tareas y fechas límite de cualquier base de datos directamente en Notion Calendar, unificando agenda y gestión de proyectos en una sola vista.",
    url: "https://notion.so/product/calendar",
    tag: "producto",
  },
  {
    id: "notion-api-v2",
    fecha: "2026-04-15",
    titulo: "API de Notion: nuevos endpoints para bases de datos relacionales",
    resumen:
      "La API de Notion añade soporte completo para propiedades relacionales y rollups, permitiendo automatizaciones más complejas con Make, Zapier y código propio.",
    url: "https://developers.notion.com",
    tag: "api",
  },
  {
    id: "notion-templates-2026",
    fecha: "2026-03-08",
    titulo: "Galería de templates rediseñada con filtros por industria",
    resumen:
      "La galería oficial de Notion se rediseñó con más de 500 templates organizados por industria, tamaño de equipo y caso de uso. Más fácil que nunca encontrar el sistema que necesitas.",
    url: "https://notion.so/templates",
    tag: "template",
  },
];
