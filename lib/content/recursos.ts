import { NOTION_URL, NOTION_TEMPLATES_URL } from "./constants";

export type RecursoCategoria =
  | "empezar"
  | "notion-ai"
  | "templates"
  | "integraciones"
  | "comunidad";

export type RecursoTipo = "link" | "video" | "grabacion";

export interface Recurso {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: RecursoCategoria;
  url: string;
  tipo: RecursoTipo;
  externo?: boolean;
  fecha?: string;
  speaker?: string;
}

export const RECURSO_CATEGORIAS: Record<RecursoCategoria, string> = {
  empezar: "Empezar con Notion",
  "notion-ai": "Notion AI",
  templates: "Templates",
  integraciones: "Integraciones",
  comunidad: "Comunidad",
};

export const RECURSOS_ESTATICOS: Recurso[] = [
  {
    id: "notion-app",
    titulo: "Notion · Empieza gratis",
    descripcion:
      "Crea tu cuenta y prueba Notion en el navegador. Ideal para tu primer workspace personal o de equipo.",
    categoria: "empezar",
    url: NOTION_URL,
    tipo: "link",
    externo: true,
  },
  {
    id: "notion-docs",
    titulo: "Centro de ayuda oficial de Notion",
    descripcion:
      "Guías oficiales sobre páginas, bases de datos, permisos, integraciones y las últimas funciones.",
    categoria: "empezar",
    url: "https://notion.so/help",
    tipo: "link",
    externo: true,
  },
  {
    id: "notion-ai-intro",
    titulo: "Notion AI · Guía de inicio",
    descripcion:
      "Cómo activar y usar Notion AI para redactar, resumir, traducir y extraer información de tus páginas.",
    categoria: "notion-ai",
    url: "https://notion.so/product/ai",
    tipo: "link",
    externo: true,
  },
  {
    id: "notion-ai-search",
    titulo: "Búsqueda inteligente con Notion AI",
    descripcion:
      "Aprende a hacer preguntas en lenguaje natural a tu workspace y obtener respuestas directas desde cualquier página.",
    categoria: "notion-ai",
    url: "https://notion.so/product/ai",
    tipo: "link",
    externo: true,
  },
  {
    id: "notion-templates-gallery",
    titulo: "Galería de templates oficiales",
    descripcion:
      "Más de 500 templates organizados por industria, tamaño de equipo y caso de uso. Empieza desde un sistema ya probado.",
    categoria: "templates",
    url: NOTION_TEMPLATES_URL,
    tipo: "link",
    externo: true,
  },
  {
    id: "notion-make-integration",
    titulo: "Notion + Make · Automatizaciones sin código",
    descripcion:
      "Conecta Notion con más de 2000 aplicaciones usando Make. Sincroniza datos, crea registros automáticos y dispara flujos desde eventos en tu workspace.",
    categoria: "integraciones",
    url: "https://www.make.com/en/integrations/notion",
    tipo: "link",
    externo: true,
  },
  {
    id: "notion-api-docs",
    titulo: "API de Notion · Documentación oficial",
    descripcion:
      "Referencia completa para desarrolladores: autenticación, endpoints de bases de datos, páginas y bloques.",
    categoria: "integraciones",
    url: "https://developers.notion.com",
    tipo: "link",
    externo: true,
  },
  {
    id: "aplicar-speaker",
    titulo: "Aplica como speaker",
    descripcion:
      "Comparte tu experiencia con Notion en una sesión en vivo con la comunidad.",
    categoria: "comunidad",
    url: "/aplicar",
    tipo: "link",
  },
  {
    id: "directorio",
    titulo: "Directorio de speakers",
    descripcion:
      "Conoce a los miembros que ya compartieron en Notion Lima y revisa sus charlas.",
    categoria: "comunidad",
    url: "/directorio",
    tipo: "link",
  },
];
