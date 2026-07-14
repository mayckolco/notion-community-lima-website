export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const LANDING_FAQ: FAQItem[] = [
  {
    id: "que-es-notion",
    question: "¿Qué es Notion?",
    answer:
      "Notion es una plataforma todo en uno que combina notas, bases de datos, gestión de proyectos y wikis en un solo workspace. Con Notion AI puedes redactar, resumir, traducir y organizar información de forma inteligente sin salir de tu entorno de trabajo.",
  },
  {
    id: "notion-gratis",
    question: "¿Notion es gratis?",
    answer:
      "Sí, Notion tiene un plan gratuito con uso individual ilimitado. Los planes Plus, Business y Enterprise ofrecen más capacidad de colaboración, historial de páginas y funciones de equipo. La comunidad Notion Lima es completamente gratuita: meetups, recursos y grupo de WhatsApp sin costo.",
  },
  {
    id: "notion-ai",
    question: "¿Qué es Notion AI?",
    answer:
      "Notion AI es la inteligencia artificial integrada directamente en tu workspace. Te permite generar texto, resumir documentos, traducir contenido, extraer tareas de reuniones y hacer búsquedas inteligentes en todo tu espacio de trabajo. Es un add-on disponible en todos los planes.",
  },
  {
    id: "para-quien",
    question: "¿Para quién es Notion Lima?",
    answer:
      "Para cualquier persona en Lima que use o quiera aprender Notion: freelancers, emprendedores, equipos de trabajo, estudiantes o profesionales que buscan organizar mejor su vida y trabajo. No se requiere experiencia previa; compartimos desde los conceptos básicos hasta sistemas avanzados.",
  },
  {
    id: "ser-speaker",
    question: "¿Cómo puedo ser speaker en Notion Lima?",
    answer:
      "Visita /aplicar, elige una fecha disponible y completa el formulario con el título de tu charla y una breve descripción de tu sistema o experiencia con Notion. No necesitas experiencia previa como speaker; valoramos casos reales y aprendizajes concretos.",
  },
  {
    id: "afiliacion-notion",
    question: "¿Notion Lima está afiliada a Notion?",
    answer:
      "No. Notion Lima es una comunidad independiente organizada por entusiastas en Lima. No está afiliada oficialmente a Notion Labs, Inc. Notion es una marca registrada de Notion Labs, Inc.",
  },
];

export const RECURSOS_FAQ: FAQItem[] = [
  {
    id: "por-donde-empezar",
    question: "¿Por dónde empiezo si nunca he usado Notion?",
    answer:
      "Crea una cuenta gratuita en notion.so y empieza con una página simple. Luego revisa la categoría 'Empezar con Notion' en esta página y asiste a un meetup de la comunidad para ver casos reales en acción.",
  },
  {
    id: "grabaciones",
    question: "¿Dónde encuentro las grabaciones de charlas?",
    answer:
      "En la categoría 'Comunidad' de esta página aparecen las grabaciones de sesiones pasadas. También puedes verlas en /eventos bajo 'Eventos pasados'.",
  },
];
