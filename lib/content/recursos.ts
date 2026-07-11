import {
  CLAUDE_API_DOCS_URL,
  CLAUDE_APP_URL,
  CLAUDE_CODE_DOCS_URL,
} from "./constants";

export type RecursoCategoria =
  | "empezar"
  | "prompting"
  | "claude-code"
  | "api"
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
  empezar: "Empezar con Claude",
  prompting: "Prompting",
  "claude-code": "Claude Code",
  api: "API y builders",
  comunidad: "Comunidad",
};

export const RECURSOS_ESTATICOS: Recurso[] = [
  {
    id: "claude-ai",
    titulo: "Claude.ai — Empieza gratis",
    descripcion:
      "Crea tu cuenta y prueba Claude en el navegador. Ideal para tu primer contacto con la herramienta.",
    categoria: "empezar",
    url: CLAUDE_APP_URL,
    tipo: "link",
    externo: true,
  },
  {
    id: "anthropic-docs",
    titulo: "Documentación oficial de Anthropic",
    descripcion:
      "Guías oficiales sobre modelos, API, Claude Code y mejores prácticas de seguridad.",
    categoria: "empezar",
    url: "https://docs.anthropic.com",
    tipo: "link",
    externo: true,
  },
  {
    id: "prompt-engineering",
    titulo: "Guía de prompt engineering",
    descripcion:
      "Técnicas para escribir prompts claros: contexto, ejemplos, formato de salida y iteración.",
    categoria: "prompting",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
    tipo: "link",
    externo: true,
  },
  {
    id: "system-prompts",
    titulo: "System prompts efectivos",
    descripcion:
      "Cómo definir el rol, tono y restricciones de Claude para tareas recurrentes y asistentes personalizados.",
    categoria: "prompting",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts",
    tipo: "link",
    externo: true,
  },
  {
    id: "claude-code-docs",
    titulo: "Claude Code — Documentación",
    descripcion:
      "Instalación, comandos, flujos de trabajo y cómo usar Claude Code en tu terminal.",
    categoria: "claude-code",
    url: CLAUDE_CODE_DOCS_URL,
    tipo: "link",
    externo: true,
  },
  {
    id: "claude-code-tips",
    titulo: "Tips de la comunidad para Claude Code",
    descripcion:
      "Resumen de aprendizajes compartidos en charlas de Claude Perú: CLAUDE.md, hooks y flujos con git.",
    categoria: "claude-code",
    url: "/recursos",
    tipo: "link",
  },
  {
    id: "api-getting-started",
    titulo: "Claude API — Primeros pasos",
    descripcion:
      "Crea tu API key, elige un modelo y haz tu primera llamada. Base para productos con IA.",
    categoria: "api",
    url: CLAUDE_API_DOCS_URL,
    tipo: "link",
    externo: true,
  },
  {
    id: "mcp-docs",
    titulo: "Model Context Protocol (MCP)",
    descripcion:
      "Conecta Claude con herramientas externas: bases de datos, APIs, Notion, GitHub y más.",
    categoria: "api",
    url: "https://modelcontextprotocol.io",
    tipo: "link",
    externo: true,
  },
  {
    id: "aplicar-speaker",
    titulo: "Aplica como speaker",
    descripcion:
      "Comparte tu experiencia construyendo con Claude en un webinar en vivo con la comunidad.",
    categoria: "comunidad",
    url: "/aplicar",
    tipo: "link",
  },
  {
    id: "directorio",
    titulo: "Directorio de speakers",
    descripcion:
      "Conoce a los builders que ya compartieron en Claude Perú y revisa sus charlas.",
    categoria: "comunidad",
    url: "/directorio",
    tipo: "link",
  },
];
