export type ProgramaProducto = "chat" | "cowork" | "code";
export type ProgramaNivel = 1 | 2 | 3 | 4;
export type ProgramaModalidad = "virtual" | "presencial";
export type ProgramaTipo = "curso" | "programa" | "ruta";

export interface ProgramaPrecio {
  virtual: number;
  presencial: number;
  moneda: "PEN";
}

export interface ProgramaBase {
  slug: string;
  tipo: ProgramaTipo;
  nombre: string;
  tagline: string;
  descripcion: string;
  producto: ProgramaProducto | "mixto";
  nivel: ProgramaNivel;
  nivelLabel: string;
  duracion: string;
  cupos: number;
  precio: ProgramaPrecio;
  incluye: string[];
  temario: string[];
  paraQuien: string;
  prerequisitos?: string;
}

export interface Curso extends ProgramaBase {
  tipo: "curso";
}

export interface ProgramaBundle extends ProgramaBase {
  tipo: "programa";
  cursosIncluidos: string[];
  ahorroVirtual: number;
  ahorroPresencial: number;
}

export interface RutaAprendizaje extends ProgramaBase {
  tipo: "ruta";
  pasos: { orden: number; cursoSlug: string; titulo: string }[];
  duracionTotal: string;
}

export const COHORT_CUPOS = 10;
export const DURACION_SESION = "3–4 horas por sesión";

export const PROGRAMA_FEATURES = [
  "Clases personalizadas en cohortes de 10 personas",
  "Mentor asignado durante todo el programa",
  "Casos prácticos de tu industria o rol",
  "Demos en vivo con Claude Chat, Cowork y Code",
  "Material de apoyo y plantillas post-sesión",
] as const;

export const CURSOS: Curso[] = [
  {
    slug: "claude-chat-fundamentos",
    tipo: "curso",
    nombre: "Claude Chat desde cero",
    tagline: "Tu primer paso con IA, sin tecnicismos",
    descripcion:
      "Aprende a usar Claude en el navegador y móvil para redactar, resumir, investigar y organizar tu trabajo. Diseñado para personas sin experiencia previa en IA ni programación.",
    producto: "chat",
    nivel: 1,
    nivelLabel: "Fundamentos",
    duracion: DURACION_SESION,
    cupos: COHORT_CUPOS,
    precio: { virtual: 179, presencial: 299, moneda: "PEN" },
    incluye: [...PROGRAMA_FEATURES],
    temario: [
      "Qué es Claude y cómo se diferencia de otros chats",
      "Crear tu cuenta y primeros prompts efectivos",
      "Redactar emails, informes y presentaciones",
      "Analizar PDFs y documentos largos",
      "Buenas prácticas de privacidad y verificación",
    ],
    paraQuien:
      "Profesionales, emprendedores, estudiantes y cualquier persona que quiera empezar con IA desde cero.",
  },
  {
    slug: "claude-chat-productividad",
    tipo: "curso",
    nombre: "Claude Chat: productividad avanzada",
    tagline: "Automatiza tareas repetitivas sin código",
    descripcion:
      "Domina proyectos, instrucciones personalizadas, artefactos y flujos de trabajo con Claude Chat. Lleva tu productividad al siguiente nivel con técnicas de prompting avanzado.",
    producto: "chat",
    nivel: 2,
    nivelLabel: "Intermedio",
    duracion: DURACION_SESION,
    cupos: COHORT_CUPOS,
    precio: { virtual: 199, presencial: 329, moneda: "PEN" },
    incluye: [...PROGRAMA_FEATURES],
    temario: [
      "Proyectos y contexto persistente en Claude",
      "Instrucciones personalizadas para tu rol",
      "Artefactos: informes, tablas y mini-apps sin código",
      "Cadenas de prompts para flujos complejos",
      "Integración con Google Drive y herramientas del día a día",
    ],
    paraQuien:
      "Quienes ya usan Claude ocasionalmente y quieren sistematizar su trabajo diario.",
    prerequisitos: "Haber completado Claude Chat desde cero o uso básico equivalente.",
  },
  {
    slug: "claude-cowork-equipos",
    tipo: "curso",
    nombre: "Claude Cowork para equipos",
    tagline: "Colabora con IA en proyectos compartidos",
    descripcion:
      "Aprende a usar Claude Cowork para coordinar tareas, compartir contexto y trabajar en equipo con IA. Ideal para equipos pequeños y líderes que quieren adoptar IA sin fricción.",
    producto: "cowork",
    nivel: 2,
    nivelLabel: "Intermedio",
    duracion: DURACION_SESION,
    cupos: COHORT_CUPOS,
    precio: { virtual: 199, presencial: 329, moneda: "PEN" },
    incluye: [...PROGRAMA_FEATURES],
    temario: [
      "Qué es Claude Cowork y cuándo usarlo vs Chat",
      "Configurar espacios de trabajo compartidos",
      "Delegar tareas y seguimiento con el equipo",
      "Compartir documentos y contexto de proyecto",
      "Casos: reuniones, briefs, reportes de equipo",
    ],
    paraQuien:
      "Líderes de equipo, project managers y profesionales que coordinan trabajo grupal.",
    prerequisitos: "Conocimiento básico de Claude Chat.",
  },
  {
    slug: "claude-code-sin-codigo",
    tipo: "curso",
    nombre: "Claude Code sin programar",
    tagline: "Construye y automatiza hablando en español",
    descripcion:
      "Descubre Claude Code desde la perspectiva de un no-técnico: crea scripts, automatiza archivos y prototipa soluciones describiendo lo que necesitas, sin escribir código manualmente.",
    producto: "code",
    nivel: 3,
    nivelLabel: "Avanzado",
    duracion: DURACION_SESION,
    cupos: COHORT_CUPOS,
    precio: { virtual: 229, presencial: 369, moneda: "PEN" },
    incluye: [...PROGRAMA_FEATURES],
    temario: [
      "Instalar y configurar Claude Code paso a paso",
      "Pedirle a Claude que escriba y ejecute por ti",
      "Automatizar reportes, renombrar archivos, limpiar datos",
      "Prototipar una herramienta interna sin ser developer",
      "Límites, seguridad y cuándo pedir ayuda técnica",
    ],
    paraQuien:
      "Profesionales curiosos que quieren ir más allá del chat sin volverse programadores.",
    prerequisitos: "Claude Chat desde cero o nivel intermedio equivalente.",
  },
  {
    slug: "claude-casos-practicos",
    tipo: "curso",
    nombre: "Casos prácticos con Claude",
    tagline: "Resuelve problemas reales de tu trabajo",
    descripcion:
      "Taller intensivo donde traes tus propios casos (marketing, ventas, RR.HH., educación, operaciones) y los resolvemos en vivo con mentores. Sal con soluciones listas para usar.",
    producto: "mixto",
    nivel: 3,
    nivelLabel: "Avanzado",
    duracion: DURACION_SESION,
    cupos: COHORT_CUPOS,
    precio: { virtual: 199, presencial: 329, moneda: "PEN" },
    incluye: [...PROGRAMA_FEATURES],
    temario: [
      "Diagnóstico de tu caso de uso con el mentor",
      "Diseño de flujo con Chat, Cowork o Code",
      "Implementación guiada en sesión",
      "Iteración y refinamiento en vivo",
      "Plan de adopción para las próximas 2 semanas",
    ],
    paraQuien:
      "Quienes ya usan Claude y quieren resultados concretos en su rol o empresa.",
    prerequisitos: "Al menos un curso de nivel 1 o 2 completado.",
  },
  {
    slug: "claude-experto-flujos",
    tipo: "curso",
    nombre: "Claude Experto: flujos y agentes",
    tagline: "Orquesta Chat, Cowork y Code como un pro",
    descripcion:
      "El nivel más alto para no-técnicos: diseña flujos multi-herramienta, conecta MCP básico, crea agentes simples y establece estándares de IA en tu equipo u organización.",
    producto: "mixto",
    nivel: 4,
    nivelLabel: "Experto",
    duracion: DURACION_SESION,
    cupos: COHORT_CUPOS,
    precio: { virtual: 249, presencial: 399, moneda: "PEN" },
    incluye: [...PROGRAMA_FEATURES],
    temario: [
      "Arquitectura de flujos: cuándo usar Chat vs Cowork vs Code",
      "Conectores MCP para no-programadores",
      "Agentes simples con instrucciones y herramientas",
      "Gobernanza: políticas de uso de IA en equipos",
      "Roadmap personal de adopción continua",
    ],
    paraQuien:
      "Power users y líderes que quieren ser referentes de IA en su organización.",
    prerequisitos: "Haber completado al menos 3 cursos de niveles 1–3.",
  },
];

export const PROGRAMAS: ProgramaBundle[] = [
  {
    slug: "programa-chat-completo",
    tipo: "programa",
    nombre: "Programa Chat Completo",
    tagline: "De cero a productivo con Claude Chat",
    descripcion:
      "Dos sesiones progresivas que te llevan desde tu primer prompt hasta flujos de trabajo avanzados. El camino más rápido para dominar Claude Chat.",
    producto: "chat",
    nivel: 2,
    nivelLabel: "Fundamentos → Intermedio",
    duracion: "2 sesiones · " + DURACION_SESION,
    cupos: COHORT_CUPOS,
    precio: { virtual: 329, presencial: 549, moneda: "PEN" },
    cursosIncluidos: ["claude-chat-fundamentos", "claude-chat-productividad"],
    ahorroVirtual: 49,
    ahorroPresencial: 79,
    incluye: [...PROGRAMA_FEATURES, "Descuento por paquete vs cursos sueltos"],
    temario: [
      "Sesión 1: Claude Chat desde cero",
      "Sesión 2: Productividad avanzada",
      "Mentoría de seguimiento entre sesiones",
    ],
    paraQuien: "Profesionales que quieren dominar Claude Chat en 2 semanas.",
  },
  {
    slug: "programa-builder-sin-codigo",
    tipo: "programa",
    nombre: "Programa Builder sin código",
    tagline: "Cowork + Code + casos reales",
    descripcion:
      "Tres sesiones para pasar de usuario casual a builder con IA: colabora en equipo, automatiza sin programar y resuelve casos propios con mentores.",
    producto: "mixto",
    nivel: 3,
    nivelLabel: "Intermedio → Avanzado",
    duracion: "3 sesiones · " + DURACION_SESION,
    cupos: COHORT_CUPOS,
    precio: { virtual: 549, presencial: 899, moneda: "PEN" },
    cursosIncluidos: [
      "claude-cowork-equipos",
      "claude-code-sin-codigo",
      "claude-casos-practicos",
    ],
    ahorroVirtual: 78,
    ahorroPresencial: 128,
    incluye: [...PROGRAMA_FEATURES, "Descuento por paquete vs cursos sueltos"],
    temario: [
      "Sesión 1: Claude Cowork para equipos",
      "Sesión 2: Claude Code sin programar",
      "Sesión 3: Casos prácticos con tu trabajo",
    ],
    paraQuien:
      "Profesionales ambiciosos que quieren construir soluciones con IA sin ser developers.",
    prerequisitos: "Claude Chat desde cero o nivel equivalente.",
  },
  {
    slug: "programa-experto-total",
    tipo: "programa",
    nombre: "Programa Experto Total",
    tagline: "Los 6 cursos en un solo paquete",
    descripcion:
      "Acceso a toda la formación Claude Perú: desde fundamentos hasta experto. La inversión más completa para convertirte en referente de IA en tu entorno.",
    producto: "mixto",
    nivel: 4,
    nivelLabel: "Fundamentos → Experto",
    duracion: "6 sesiones · " + DURACION_SESION,
    cupos: COHORT_CUPOS,
    precio: { virtual: 899, presencial: 1499, moneda: "PEN" },
    cursosIncluidos: CURSOS.map((c) => c.slug),
    ahorroVirtual: 356,
    ahorroPresencial: 526,
    incluye: [
      ...PROGRAMA_FEATURES,
      "Máximo descuento del catálogo",
      "Prioridad en fechas de cohorte",
      "Certificado de finalización Claude Perú",
    ],
    temario: CURSOS.map((c) => c.nombre),
    paraQuien:
      "Quienes quieren la ruta completa con el mejor precio y acompañamiento integral.",
  },
];

export const RUTAS: RutaAprendizaje[] = [
  {
    slug: "ruta-desde-cero",
    tipo: "ruta",
    nombre: "Ruta Desde Cero a Experto",
    tagline: "El camino completo por cada producto Claude",
    descripcion:
      "Recorre los 6 cursos en orden progresivo: Chat → Cowork → Code → casos → experto. La ruta diseñada para personas no técnicas que quieren dominar todo el ecosistema Claude.",
    producto: "mixto",
    nivel: 4,
    nivelLabel: "Fundamentos → Experto",
    duracion: "6 sesiones · " + DURACION_SESION,
    duracionTotal: "6 semanas recomendadas (1 sesión/semana)",
    cupos: COHORT_CUPOS,
    precio: { virtual: 899, presencial: 1499, moneda: "PEN" },
    pasos: CURSOS.map((c, i) => ({
      orden: i + 1,
      cursoSlug: c.slug,
      titulo: c.nombre,
    })),
    incluye: [
      ...PROGRAMA_FEATURES,
      "Secuencia guiada paso a paso",
      "Mismo mentor a lo largo de la ruta",
      "Certificado al completar los 6 módulos",
    ],
    temario: [
      "Fase 1: Chat: fundamentos y productividad",
      "Fase 2: Cowork: colaboración en equipo",
      "Fase 3: Code: automatización sin programar",
      "Fase 4: Casos prácticos y flujos experto",
    ],
    paraQuien:
      "Personas sin conocimiento de código que quieren una guía estructurada de principio a fin.",
  },
  {
    slug: "ruta-profesional",
    tipo: "ruta",
    nombre: "Ruta Profesional",
    tagline: "Domina Claude Chat para tu trabajo",
    descripcion:
      "Ruta enfocada en productividad individual: fundamentos, avanzado y casos prácticos. Ideal si tu prioridad es el día a día profesional sin entrar a Code.",
    producto: "chat",
    nivel: 3,
    nivelLabel: "Fundamentos → Avanzado",
    duracion: "3 sesiones · " + DURACION_SESION,
    duracionTotal: "3 semanas recomendadas",
    cupos: COHORT_CUPOS,
    precio: { virtual: 499, presencial: 829, moneda: "PEN" },
    pasos: [
      { orden: 1, cursoSlug: "claude-chat-fundamentos", titulo: "Claude Chat desde cero" },
      { orden: 2, cursoSlug: "claude-chat-productividad", titulo: "Productividad avanzada" },
      { orden: 3, cursoSlug: "claude-casos-practicos", titulo: "Casos prácticos" },
    ],
    incluye: [...PROGRAMA_FEATURES, "Enfoque 100% en Claude Chat"],
    temario: [
      "Semana 1: Primeros pasos y prompts",
      "Semana 2: Flujos y automatización sin código",
      "Semana 3: Tu caso real resuelto en vivo",
    ],
    paraQuien:
      "Profesionales de cualquier área que quieren maximizar Claude Chat en su rol.",
  },
  {
    slug: "ruta-equipos",
    tipo: "ruta",
    nombre: "Ruta para Equipos",
    tagline: "Adopta IA en tu equipo con Cowork y casos",
    descripcion:
      "Ruta para líderes y equipos: fundamentos compartidos, Cowork colaborativo y taller de casos grupales. Perfecta para cohortes de la misma empresa.",
    producto: "cowork",
    nivel: 3,
    nivelLabel: "Fundamentos → Avanzado",
    duracion: "3 sesiones · " + DURACION_SESION,
    duracionTotal: "3 semanas recomendadas",
    cupos: COHORT_CUPOS,
    precio: { virtual: 499, presencial: 829, moneda: "PEN" },
    pasos: [
      { orden: 1, cursoSlug: "claude-chat-fundamentos", titulo: "Claude Chat desde cero" },
      { orden: 2, cursoSlug: "claude-cowork-equipos", titulo: "Claude Cowork para equipos" },
      { orden: 3, cursoSlug: "claude-casos-practicos", titulo: "Casos prácticos en equipo" },
    ],
    incluye: [
      ...PROGRAMA_FEATURES,
      "Diseñado para equipos de la misma organización",
      "Casos de uso alineados a tu industria",
    ],
    temario: [
      "Semana 1: Base común de Claude para todo el equipo",
      "Semana 2: Espacios Cowork y coordinación",
      "Semana 3: Casos reales del equipo en taller grupal",
    ],
    paraQuien:
      "Equipos de 3–10 personas que quieren adoptar IA de forma coordinada.",
    prerequisitos: "Ideal para cohortes inscritas juntas desde la misma empresa.",
  },
];

export const ALL_PROGRAMAS: ProgramaBase[] = [...CURSOS, ...PROGRAMAS, ...RUTAS];

export function getProgramaBySlug(slug: string): ProgramaBase | undefined {
  return ALL_PROGRAMAS.find((p) => p.slug === slug);
}

export function getCursoBySlug(slug: string): Curso | undefined {
  return CURSOS.find((c) => c.slug === slug);
}

export function formatPrecio(amount: number, moneda: "PEN" = "PEN"): string {
  return moneda === "PEN" ? `S/ ${amount}` : `${amount}`;
}

export const PRODUCTO_LABELS: Record<ProgramaProducto | "mixto", string> = {
  chat: "Claude Chat",
  cowork: "Claude Cowork",
  code: "Claude Code",
  mixto: "Ecosistema completo",
};

export const NIVEL_LABELS: Record<ProgramaNivel, string> = {
  1: "Fundamentos",
  2: "Intermedio",
  3: "Avanzado",
  4: "Experto",
};
