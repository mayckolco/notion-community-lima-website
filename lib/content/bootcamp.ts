import type { ProgramaModalidad } from "./programas";

export const BOOTCAMP_CUPOS = 10;
export const BOOTCAMP_DURACION = "3–4 horas por sesión";

export const CLAUDE_BOOTCAMP = {
  slug: "claude-bootcamp",
  nombre: "Claude Bootcamp",
  tagline: "Domina Claude en un día — sin código",
  descripcion:
    "Intensivo práctico para aprender Claude Chat, Cowork y Code desde cero. Mentores, casos reales y demos en vivo en una sola sesión.",
  incluye: [
    "Clases personalizadas en cohortes de 10 personas",
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
    duracion: "6 sesiones · 3–4 h c/u",
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
    duracion: "3 sesiones · 3–4 h c/u",
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
