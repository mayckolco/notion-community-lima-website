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
  nombre: "Claude Bootcamp",
  tagline: "Domina Claude en un día, sin código",
  descripcion:
    "Intensivo práctico para aprender Claude Chat, Cowork y Code desde cero. Mentores, casos reales y demos en vivo en una sola sesión.",
  incluye: [
    "Clases personalizadas en cohortes (30 virtual · 10 presencial)",
    "Mentor asignado durante la sesión",
    "Casos prácticos de tu industria o rol",
    "Demos en vivo con Claude Chat, Cowork y Code",
    "Material de apoyo y plantillas post-sesión",
  ],
  precio: {
    virtual: 159,
    presencial: 249,
    moneda: "PEN" as const,
  },
} as const;

export interface RutaBloqueada {
  slug: string;
  nombre: string;
  tagline: string;
  descripcion: string;
  duracion: string;
  precioReferencial: { virtual: number; presencial: number };
  pasos: string[];
}

export const RUTAS_BLOQUEADAS: RutaBloqueada[] = [
  {
    slug: "ruta-fundamentos-experto",
    nombre: "Ruta Fundamentos a Experto",
    tagline: "De cero a referente de IA en tu equipo",
    descripcion:
      "Recorrido progresivo por Chat, Cowork y Code en múltiples sesiones. La ruta completa para dominar el ecosistema Claude.",
    duracion: "6 sesiones · 10a.m. - 2 p.m.",
    precioReferencial: { virtual: 699, presencial: 1199 },
    pasos: [
      "Claude Chat desde cero",
      "Productividad avanzada",
      "Cowork para equipos",
      "Code sin programar",
      "Casos prácticos",
      "Flujos y agentes",
    ],
  },
  {
    slug: "ruta-builder-ia",
    nombre: "Ruta Builder con IA",
    tagline: "Construye soluciones sin ser developer",
    descripcion:
      "Tres sesiones para pasar de usuario casual a builder: colabora en equipo, automatiza con Code y resuelve casos propios.",
    duracion: "3 sesiones · 10a.m. - 2 p.m.",
    precioReferencial: { virtual: 449, presencial: 749 },
    pasos: [
      "Claude Chat desde cero",
      "Cowork para equipos",
      "Casos prácticos con Claude",
    ],
  },
];

export function buildBootcampInfoUrl(modalidad: ProgramaModalidad): string {
  const label = modalidad === "virtual" ? "virtual" : "presencial";
  const text = `Hola! Quiero más información sobre Claude Bootcamp en modalidad ${label}. Gracias!`;
  return `https://wa.me/51946542990?text=${encodeURIComponent(text)}`;
}

export function buildCheckoutUrl(modalidad: ProgramaModalidad): string {
  return `/programas/checkout?programa=${CLAUDE_BOOTCAMP.slug}&modalidad=${modalidad}`;
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
