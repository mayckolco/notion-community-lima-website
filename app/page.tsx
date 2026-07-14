import { listDirectorySpeakers } from "@/lib/notion/speakers";
import {
  listConfirmedSlots,
  listPastSlotsWithRecordings,
} from "@/lib/notion/slots";
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
  title: "Notion Lima · Comunidad de Notion en Lima",
  description:
    "La comunidad de Notion en Lima. Aprende, organízate y conecta con personas que usan Notion para gestionar proyectos, equipos y conocimiento.",
  path: "/",
});

export default async function LandingPage() {
  const [allSpeakers, confirmedSlots, pastSlots, novedades] = await Promise.all([
    listDirectorySpeakers().catch(() => []),
    listConfirmedSlots().catch(() => []),
    listPastSlotsWithRecordings().catch(() => []),
    getNovedades(),
  ]);

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
