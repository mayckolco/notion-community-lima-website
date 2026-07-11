import { INSTAGRAM_URL, WHATSAPP_COMMUNITY_URL } from "@/lib/content/constants";
import type { FAQItem } from "@/lib/content/faq";
import type { Slot } from "@/lib/schemas";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Claude Community",
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    description: SITE_DESCRIPTION,
    sameAs: [INSTAGRAM_URL, WHATSAPP_COMMUNITY_URL],
    location: {
      "@type": "Place",
      name: "Lima, Perú",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lima",
        addressCountry: "PE",
      },
    },
  };
}

export function faqPageJsonLd(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function eventJsonLd(slot: Slot) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: slot.titulo ?? "Webinar Claude Perú",
    description:
      slot.descripcion ??
      "Sesión en vivo de la comunidad Claude Perú con builders peruanos.",
    startDate: slot.fecha,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: slot.lumaUrl ?? `${SITE_URL}/eventos`,
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(slot.speaker
      ? {
          performer: {
            "@type": "Person",
            name: slot.speaker.nombre,
          },
        }
      : {}),
  };
}

export function courseJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: "es-PE",
    educationalLevel: "Beginner",
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function personJsonLd(speaker: {
  nombre: string;
  rol: string | null;
  empresa: string | null;
  biografia: string | null;
  linkedin: string | null;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: speaker.nombre,
    jobTitle: speaker.rol ?? undefined,
    worksFor: speaker.empresa
      ? { "@type": "Organization", name: speaker.empresa }
      : undefined,
    description: speaker.biografia ?? undefined,
    url: `${SITE_URL}/directorio/${speaker.slug}`,
    sameAs: speaker.linkedin ? [speaker.linkedin] : undefined,
  };
}
