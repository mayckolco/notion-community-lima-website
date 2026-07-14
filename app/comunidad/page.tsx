import type { Metadata } from "next";
import { MapPin, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { CommunityAccountLink } from "@/components/CommunityAccountLink";
import { JoinCommunityButton } from "@/components/JoinCommunityButton";
import { CommunityMembersSection } from "@/components/comunidad/CommunityMembersSection";
import { CommunityMap } from "@/components/comunidad/CommunityMap";
import { CommunitySuccessBanner } from "@/components/comunidad/CommunitySuccessBanner";
import { listComunidadMembersWithProyectos } from "@/lib/notion/comunidad";
import { getCommunitySession } from "@/lib/auth/community-session";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = createPageMetadata({
  title: "Comunidad",
  description:
    "Mapa de miembros de Notion Lima. Descubre quién forma parte de la comunidad y desde dónde usan Notion.",
  path: "/comunidad",
});

export default async function ComunidadPage() {
  const [members, session] = await Promise.all([
    listComunidadMembersWithProyectos(),
    Promise.resolve(getCommunitySession()),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Comunidad", path: "/comunidad" },
        ])}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="space-y-4">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">
              Comunidad
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight">
              Miembros de <span className="gradient-text">Notion Lima</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Personas que forman parte de la comunidad y comparten lo que construyen
              con Notion. Haz clic en un punto del mapa para ver cuántas personas hay en cada ciudad.
            </p>
          </header>

          <CommunitySuccessBanner />

          <section className="space-y-4" aria-labelledby="mapa-comunidad">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div className="space-y-1">
                <h2 id="mapa-comunidad" className="font-serif text-xl tracking-tight">
                  Mapa de la comunidad
                </h2>
                <p className="text-sm text-muted-foreground">
                  {members.length > 0
                    ? `${members.length} ${members.length === 1 ? "persona registrada" : "personas registradas"}`
                    : "Aún no hay registros publicados en el mapa"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Perú y Latinoamérica
              </div>
            </div>

            <CommunityMap members={members} />
          </section>

          <CommunityMembersSection members={members} isLoggedIn={!!session} />

          <section className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary shrink-0">
                <Users className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-lg">¿Quieres aparecer en el mapa?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Únete a la comunidad y comparte tu ubicación para conectar con otros
                  builders cerca de ti.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <CommunityAccountLink
                loggedInHref="/cuenta/comunidad"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors touch-manipulation"
              >
                Registrarme en la comunidad
              </CommunityAccountLink>
              <JoinCommunityButton
                location="comunidad_cta"
                size="default"
                variant="outline"
              >
                Comunidad de WhatsApp
              </JoinCommunityButton>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
