export type TestimonialRole = "Asistente" | "Speaker" | "Organizador";

export interface Testimonial {
  name: string;
  text: string;
  initials: string;
  role: TestimonialRole;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ana Montero",
    initials: "AM",
    role: "Asistente",
    text: "Muy contenta con la metodología y organización de los meetups. Es una comunidad práctica con casos reales de personas que ya usan Notion en su trabajo.",
  },
  {
    name: "Rubén Triviño",
    initials: "RT",
    role: "Asistente",
    text: "Sin duda, una buenísima decisión unirme a Notion Lima. Aprendí a construir mi sistema de freelancer en Notion y a conectarlo con Make en menos de dos sesiones.",
  },
  {
    name: "Jorge Cortizas",
    initials: "JC",
    role: "Asistente",
    text: "Me abrió un mundo nuevo de posibilidades. Tenía muchas ideas, pero no sabía cómo estructurar mi workspace. Aquí aprendí a hacerlo desde cero.",
  },
  {
    name: "Diego Rodríguez",
    initials: "DR",
    role: "Asistente",
    text: "Asistí a un meetup sobre gestión de proyectos en Notion y fue muy generoso en todos los sentidos: demos en vivo, templates y tiempo para preguntas.",
  },
  {
    name: "Eva Palacios",
    initials: "EP",
    role: "Asistente",
    text: "Estoy muy satisfecha de haberme unido. Me siento motivada para construir mi propio sistema en Notion y compartir lo que aprendo con mi equipo.",
  },
  {
    name: "Wilkin Daniel",
    initials: "WD",
    role: "Asistente",
    text: "Muy buena experiencia para aprender Notion desde cero. Fue gratificante porque no tenía base previa y ahora ya tengo un workspace funcional en marcha.",
  },
  {
    name: "Jor Balda",
    initials: "JB",
    role: "Asistente",
    text: "Definitivamente recomiendo Notion Lima a cualquiera que quiera organizarse mejor. La red de contactos y los sistemas que aprendes valen oro.",
  },
  {
    name: "Lucía Vargas",
    initials: "LV",
    role: "Asistente",
    text: "Los meetups mensuales son lo mejor: conoces gente increíble, ves demos en vivo de sistemas reales y sales con ideas concretas para aplicar el mismo día.",
  },
  {
    name: "Carlos Mendoza",
    initials: "CM",
    role: "Asistente",
    text: "La calidad de los speakers es altísima. Cada charla trae aprendizajes aplicables al día siguiente, no teoría abstracta sobre herramientas.",
  },
  {
    name: "Javier Flores",
    initials: "JF",
    role: "Speaker",
    text: "Compartir en Notion Lima me obligó a estructurar lo que había aprendido con mi sistema. La comunidad pregunta cosas concretas y eso eleva el nivel de cada sesión.",
  },
  {
    name: "Mayckol Cruzado",
    initials: "MC",
    role: "Organizador",
    text: "Creamos Notion Lima porque queríamos un espacio donde los usuarios de Notion en Lima compartan sistemas reales, no tutoriales genéricos. Cada meetup es aprendizaje mutuo.",
  },
  {
    name: "Ignacio Velásquez",
    initials: "IV",
    role: "Speaker",
    text: "Fui speaker dos veces y ambas experiencias fueron increíbles: audiencia engaged, preguntas técnicas y conexiones que siguieron después del evento.",
  },
  {
    name: "María Soto",
    initials: "MS",
    role: "Speaker",
    text: "Presenté cómo uso Notion para gestionar mi startup. Salí con tres colaboraciones concretas de gente que vio la charla y quería implementar algo similar.",
  },
  {
    name: "Andrés Quispe",
    initials: "AQ",
    role: "Asistente",
    text: "Llevo varios meetups seguidos y cada uno tiene un aprendizaje distinto. Lo mejor es que todo se comparte en el grupo de WhatsApp después.",
  },
];
