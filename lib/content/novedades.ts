import { CLAUDE_CODE_DOCS_URL } from "./constants";

export type NovedadTag = "modelo" | "producto" | "api" | "seguridad";

export interface Novedad {
  id: string;
  fecha: string;
  titulo: string;
  resumen: string;
  url?: string;
  tag: NovedadTag;
}

export const NOVEDAD_TAGS: Record<NovedadTag, string> = {
  modelo: "Modelo",
  producto: "Producto",
  api: "API",
  seguridad: "Seguridad",
};

/** Mantener manualmente. Actualizar cuando Anthropic anuncie novedades relevantes. */
export const CLAUDE_NOVEDADES: Novedad[] = [
  {
    id: "claude-4-family",
    fecha: "2026-05-15",
    titulo: "Familia Claude 4: Sonnet y Opus",
    resumen:
      "Anthropic lanzó Claude 4 con mejor razonamiento, ventanas de contexto ampliadas y capacidades mejoradas para código y análisis de documentos largos.",
    url: "https://www.anthropic.com/news",
    tag: "modelo",
  },
  {
    id: "claude-code-updates",
    fecha: "2026-06-02",
    titulo: "Claude Code: agentes en el repositorio",
    resumen:
      "Nuevas capacidades de Claude Code para navegar codebases, ejecutar tests y aplicar cambios multi-archivo con mayor precisión en proyectos reales.",
    url: CLAUDE_CODE_DOCS_URL,
    tag: "producto",
  },
  {
    id: "mcp-protocol",
    fecha: "2026-04-10",
    titulo: "Model Context Protocol (MCP)",
    resumen:
      "Protocolo abierto para conectar Claude con herramientas externas — bases de datos, APIs, Notion, GitHub y más — de forma estandarizada.",
    url: "https://modelcontextprotocol.io",
    tag: "api",
  },
  {
    id: "extended-thinking",
    fecha: "2026-03-20",
    titulo: "Extended thinking en modelos Claude",
    resumen:
      "Los modelos pueden dedicar más tiempo a razonar antes de responder, mejorando resultados en tareas complejas de matemáticas, código y planificación.",
    tag: "modelo",
  },
];
