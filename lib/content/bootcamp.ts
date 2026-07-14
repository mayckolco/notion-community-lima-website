import type { ProgramaModalidad } from "./programas";

export const BOOTCAMP_CUPOS = {
  virtual: 30,
  presencial: 10,
} as const;

export function getBootcampCupos(modalidad: ProgramaModalidad): number {
  return BOOTCAMP_CUPOS[modalidad];
}

export const BOOTCAMP_HORARIO = "10a.m. - 2 p.m.";
/** @deprecated Use BOOTCAMP_HORARIO */
export const BOOTCAMP_DURACION = BOOTCAMP_HORARIO;

export const BOOTCAMP_YAPE = {
  numero: "961 679 031",
  titular: "Gianmarco Guerrero",
} as const;

export const CLAUDE_BOOTCAMP = {
  slug: "claude-bootcamp",
  nombre: "Notion Bootcamp",
  tagline: "Aprende los fundamentos de Notion",
  descripcion:
    "Intensivo práctico para aprender Notion desde cero: workspace, bases de datos y Notion AI. Mentores, casos reales y demos en vivo en una sola sesión.",
  incluye: {
    virtual: [
      "Curso en vivo (por Meet)",
      "Casos prácticos de tu industria o rol",
      "Mentoría personalizada (durante la sesión)",
      "Materiales",
      "Grabación",
      "Constancia de participación",
      "Soporte técnico (1 mes)",
    ],
    presencial: [
      "Curso presencial en Lima",
      "Casos prácticos de tu industria o rol",
      "Mentoría personalizada (durante la sesión)",
      "Materiales",
      "Revisión de proyecto",
      "Networking",
      "Coffee break",
      "Soporte técnico (3 meses)",
      "Constancia de participación",
    ],
  },
  precio: {
    virtual: 159,
    presencial: 249,
    precioRegular: {
      virtual: 229,
      presencial: 399,
    },
    moneda: "PEN" as const,
  },
} as const;

export interface RutaBloqueada {
  slug: string;
  numero: 1 | 2 | 3;
  accent: "green" | "orange" | "blue";
  nombre: string;
  subtitulo: string;
  descripcion: string;
  precioReferencial: { virtual: number; presencial: number };
}

export const RUTAS_BLOQUEADAS: RutaBloqueada[] = [
  {
    slug: "claude-essentials",
    numero: 1,
    accent: "green",
    nombre: "Notion Essentials",
    subtitulo: "Productividad",
    descripcion:
      "Para cualquier profesional que quiera incorporar IA en su trabajo diario.",
    precioReferencial: { virtual: 399, presencial: 649 },
  },
  {
    slug: "claude-for-teams",
    numero: 2,
    accent: "orange",
    nombre: "Notion for Teams",
    subtitulo: "Colaboración",
    descripcion:
      "Para equipos y empresas que buscan optimizar procesos y trabajo colaborativo.",
    precioReferencial: { virtual: 549, presencial: 899 },
  },
  {
    slug: "claude-builder",
    numero: 3,
    accent: "blue",
    nombre: "Notion Builder",
    subtitulo: "Automatizaciones con Notion",
    descripcion:
      "Para builders que desean crear automatizaciones e integraciones con Notion API y Make.",
    precioReferencial: { virtual: 649, presencial: 1099 },
  },
];

export function buildBootcampInfoUrl(modalidad: ProgramaModalidad): string {
  const label = modalidad === "virtual" ? "virtual" : "presencial";
  const text = `Hola! Quiero más información sobre el Notion Bootcamp en modalidad ${label}. Gracias!`;
  return `https://wa.me/51946542990?text=${encodeURIComponent(text)}`;
}

export function buildCheckoutUrl(modalidad: ProgramaModalidad, fechaId?: string): string {
  const params = new URLSearchParams({
    programa: CLAUDE_BOOTCAMP.slug,
    modalidad,
  });
  if (fechaId) params.set("fecha", fechaId);
  return `/programas/checkout?${params.toString()}`;
}

export function formatBootcampPrecio(amount: number): string {
  return `S/ ${amount}`;
}

export function bootcampUbicacion(modalidad: ProgramaModalidad): string {
  return modalidad === "virtual" ? "En vivo por Meet" : "Lima, Perú";
}

export function generateBootcampReferencia(nombre: string): string {
  const initials = nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CP-${initials || "XX"}-${suffix}`;
}

export interface BootcampFecha {
  id: string;
  fecha: string;
  fechaLabel: string;
  horario: string;
  ubicacion: string;
  modalidad: ProgramaModalidad;
  cuposDisponibles: number;
  programa: string;
}
