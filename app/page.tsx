import { listDirectorySpeakers } from "@/lib/notion/speakers";
import {
  listConfirmedSlots,
  listPastSlotsWithRecordings,
} from "@/lib/notion/slots";
import { SpeakerMarquee } from "@/components/SpeakerMarquee";
import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { FAQSection } from "@/components/FAQSection";
import { LandingHero } from "@/components/landing/LandingHero";
import { WhatIsClaudeSection } from "@/components/landing/WhatIsClaudeSection";
import { ClaudeProductsSection } from "@/components/landing/ClaudeProductsSection";
import { ClaudeNovedadesSection } from "@/components/landing/ClaudeNovedadesSection";
import { CommunityStatsSection } from "@/components/landing/CommunityStatsSection";
import {
  CommunityPillarsSection,
  FinalCTASection,
} from "@/components/landing/CommunitySections";
import { LANDING_FAQ } from "@/lib/content/faq";
import { getNovedades } from "@/lib/novedades/get-novedades";
import { createPageMetadata } from "@/lib/seo/metadata";
import { faqPageJsonLd, organizationJsonLd } from "@/lib/seo/json-ld";

export const metadata = createPageMetadata({
  title: "Claude Perú — Comunidad de builders con IA",
  description:
    "La referencia en español sobre Claude en Perú. Aprende, construye y conecta con builders que usan Claude, Claude Code y la API en casos reales.",
  path: "/",
});

export default async function LandingPage() {
  const [allSpeakers, confirmedSlots, pastSlots, novedades] = await Promise.all([
    listDirectorySpeakers().catch(() => []),
    listConfirmedSlots().catch(() => []),
    listPastSlotsWithRecordings().catch(() => []),
    getNovedades(),
  ]);

  const speakersWithPhoto = allSpeakers.filter((s) => s.foto);
  const nextEvent = confirmedSlots[0] ?? null;

  return (
    <>
      <JsonLd data={[organizationJsonLd(), faqPageJsonLd(LANDING_FAQ)]} />
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <LandingHero nextEvent={nextEvent} />
        <WhatIsClaudeSection />
        <ClaudeProductsSection />
        <CommunityStatsSection
          speakerCount={allSpeakers.length}
          eventCount={pastSlots.length}
        />
        <CommunityPillarsSection />
        <ClaudeNovedadesSection novedades={novedades} />

        {speakersWithPhoto.length > 0 && (
          <section aria-label="Speakers de la comunidad" className="border-t border-border/60 py-12">
            <SpeakerMarquee speakers={speakersWithPhoto} />
          </section>
        )}

        <TestimonialsMarquee />
        <FAQSection
          faqs={LANDING_FAQ}
          subtitle="Respuestas directas para buscadores, IA y nuevos miembros."
        />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}
