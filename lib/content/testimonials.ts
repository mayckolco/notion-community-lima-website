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
    text: "Muy contenta con la metodología y la organización de los webinars. Es una comunidad completa y práctica, con casos reales de builders peruanos usando Claude.",
  },
  {
    name: "Rubén Triviño",
    initials: "RT",
    role: "Asistente",
    text: "Sin duda, una buenísima decisión unirme a Claude Perú. Aprendí a automatizar flujos con Claude Code y conectar APIs sin partir de cero.",
  },
  {
    name: "Jorge Cortizas",
    initials: "JC",
    role: "Asistente",
    text: "Me abrió un mundo nuevo de posibilidades. Tenía muchas ideas en la cabeza, pero sentía que estaba limitado por no saber por dónde empezar con IA.",
  },
  {
    name: "Diego Rodríguez",
    initials: "DR",
    role: "Asistente",
    text: "Asistí a un webinar sobre agentes con Claude y fue muy generoso en todos los sentidos: demos en vivo, recursos y tiempo para preguntas.",
  },
  {
    name: "Eva Palacios",
    initials: "EP",
    role: "Asistente",
    text: "Estoy muy satisfecha de haberme unido a esta comunidad. Me siento motivada para empezar a construir productos con Claude y compartir lo que aprendo.",
  },
  {
    name: "Wilkin Daniel",
    initials: "WD",
    role: "Asistente",
    text: "Muy buena experiencia para aprender Claude desde cero. Fue gratificante porque no tenía base previa y ahora ya tengo un proyecto en marcha.",
  },
  {
    name: "Jor Balda",
    initials: "JB",
    role: "Asistente",
    text: "Definitivamente recomiendo Claude Perú a cualquiera que quiera dar un salto de calidad construyendo con IA. La red de contactos vale oro.",
  },
  {
    name: "Lucía Vargas",
    initials: "LV",
    role: "Asistente",
    text: "Los meetups mensuales son lo mejor: conoces gente increíble, ves demos en vivo y sales con ideas concretas para tu próximo side project.",
  },
  {
    name: "Carlos Mendoza",
    initials: "CM",
    role: "Asistente",
    text: "La calidad de los speakers es altísima. Cada charla trae aprendizajes aplicables al día siguiente, no teoría abstracta.",
  },
  {
    name: "Javier Flores",
    initials: "JF",
    role: "Speaker",
    text: "Compartir en Claude Perú me obligó a estructurar lo que había aprendido construyendo con Claude Code. La comunidad pregunta cosas concretas y eso eleva el nivel de cada charla.",
  },
  {
    name: "Mayckol Cruzado",
    initials: "MC",
    role: "Organizador",
    text: "Creamos Claude Perú porque queríamos un espacio donde los builders peruanos compartan casos reales, no slides genéricos. Cada webinar es aprendizaje mutuo.",
  },
  {
    name: "Ignacio Velásquez",
    initials: "IV",
    role: "Speaker",
    text: "Fui speaker dos veces y ambas experiencias fueron increíbles: audiencia engaged, preguntas técnicas y conexiones que siguieron después del webinar.",
  },
  {
    name: "María Soto",
    initials: "MS",
    role: "Speaker",
    text: "Presenté cómo uso Claude para automatizar reportes en mi startup. Salí con tres colaboraciones concretas de gente que vio la charla en vivo.",
  },
  {
    name: "Andrés Quispe",
    initials: "AQ",
    role: "Asistente",
    text: "Llevo 8 webinars seguidos y cada uno tiene un aprendizaje distinto. Lo mejor es que todo se comparte en el grupo de WhatsApp después.",
  },
];
