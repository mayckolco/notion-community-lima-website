import {
  CLAUDE_API_DOCS_URL,
  CLAUDE_APP_URL,
  CLAUDE_CODE_DOCS_URL,
} from "./constants";

export interface ClaudeProduct {
  id: string;
  nombre: string;
  tagline: string;
  descripcion: string;
  paraQuien: string;
  url: string;
  destacado?: boolean;
}

export const CLAUDE_PRODUCTS: ClaudeProduct[] = [
  {
    id: "claude-app",
    nombre: "Claude",
    tagline: "Tu asistente de IA en el navegador y móvil",
    descripcion:
      "Conversa con Claude para redactar, analizar documentos, programar, investigar y resolver problemas complejos. Disponible en web, iOS y Android con planes Free, Pro y Max.",
    paraQuien: "Profesionales, estudiantes y cualquier persona que quiera usar IA en su día a día.",
    url: CLAUDE_APP_URL,
    destacado: true,
  },
  {
    id: "claude-code",
    nombre: "Claude Code",
    tagline: "IA en tu terminal para builders",
    descripcion:
      "Agente de código que entiende tu repositorio, ejecuta comandos, edita archivos y automatiza tareas de desarrollo. Ideal para prototipar, refactorizar y construir features completas.",
    paraQuien: "Developers, founders técnicos y equipos que construyen software con IA.",
    url: CLAUDE_CODE_DOCS_URL,
  },
  {
    id: "claude-api",
    nombre: "Claude API",
    tagline: "Integra Claude en tus productos",
    descripcion:
      "Accede a los modelos Claude (Sonnet, Opus, Haiku) vía API para crear chatbots, agentes, pipelines de análisis y productos con IA embebida. Compatible con MCP y tool use.",
    paraQuien: "Builders que quieren productos propios con IA, no solo usar un chat.",
    url: CLAUDE_API_DOCS_URL,
  },
];
