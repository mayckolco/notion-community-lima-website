export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const LANDING_FAQ: FAQItem[] = [
  {
    id: "que-es-claude",
    question: "¿Qué es Claude?",
    answer:
      "Claude es un asistente de inteligencia artificial creado por Anthropic. Puede conversar, redactar textos, analizar documentos, escribir código y razonar sobre problemas complejos. Está disponible en claude.ai, como Claude Code en la terminal y vía API para integrarlo en productos propios.",
  },
  {
    id: "claude-en-peru",
    question: "¿Cómo uso Claude en Perú?",
    answer:
      "Puedes empezar gratis en claude.ai desde cualquier lugar de Perú. Para ir más allá, únete a Claude Perú: asiste a webinars semanales en vivo, revisa grabaciones en /recursos, explora el directorio de speakers y participa en meetups presenciales en Lima.",
  },
  {
    id: "claude-gratis",
    question: "¿Claude es gratis?",
    answer:
      "Sí, Claude tiene un plan gratuito en claude.ai con uso diario limitado. Los planes Pro y Max ofrecen más capacidad, acceso a modelos avanzados y Claude Code. La comunidad Claude Perú es gratuita: webinars, recursos y grupo de WhatsApp sin costo.",
  },
  {
    id: "claude-code-vs-chat",
    question: "¿Cuál es la diferencia entre Claude y Claude Code?",
    answer:
      "Claude (claude.ai) es un chat para tareas generales: redacción, análisis y conversación. Claude Code es un agente en tu terminal que entiende tu repositorio, edita archivos, ejecuta comandos y automatiza flujos de desarrollo. Ambos usan los modelos de Anthropic.",
  },
  {
    id: "ser-speaker",
    question: "¿Cómo puedo ser speaker en Claude Perú?",
    answer:
      "Visita /aplicar, elige una fecha disponible y completa el formulario con el título de tu charla, herramientas que usas y una breve descripción. No necesitas experiencia previa como speaker — valoramos casos reales y aprendizajes concretos.",
  },
  {
    id: "afiliacion-anthropic",
    question: "¿Claude Perú está afiliado a Anthropic?",
    answer:
      "No. Claude Perú es una comunidad independiente organizada por entusiastas en Perú. No está afiliada oficialmente a Anthropic. Claude es una marca registrada de Anthropic, PBC.",
  },
];

export const RECURSOS_FAQ: FAQItem[] = [
  {
    id: "por-donde-empezar",
    question: "¿Por dónde empiezo si nunca he usado Claude?",
    answer:
      "Crea una cuenta en claude.ai y prueba con una tarea concreta de tu trabajo. Luego revisa la categoría 'Empezar con Claude' en esta página y asiste a un webinar de la comunidad para ver casos reales.",
  },
  {
    id: "grabaciones",
    question: "¿Dónde encuentro las grabaciones de charlas?",
    answer:
      "En la categoría 'Comunidad' de esta página aparecen las grabaciones de webinars pasados. También puedes verlas en /eventos bajo 'Eventos pasados'.",
  },
];
