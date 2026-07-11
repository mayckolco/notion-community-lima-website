import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { PastSpeakerCard } from "@/components/PastSpeakerCard";
import { DirectorioHero } from "@/components/DirectorioHero";
import { listDirectorySpeakers } from "@/lib/notion/speakers";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

export const revalidate = 0;

export const metadata: Metadata = createPageMetadata({
  title: "Directorio de speakers",
  description:
    "Conoce a los builders peruanos que han compartido en Claude Perú. Directorio de speakers con charlas, herramientas y grabaciones.",
  path: "/directorio",
});

export default async function DirectorioPage() {
  const speakers = (await listDirectorySpeakers()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es")
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Directorio", path: "/directorio" },
        ])}
      />
      <Navbar />
      <main className="min-h-screen">
        <DirectorioHero speakers={speakers} />

        <div id="speakers" className="px-6 sm:px-10 py-10 sm:py-16">
          <div className="space-y-8 sm:space-y-10">

            <div className="space-y-1">
              <p className="text-xs font-mono text-primary uppercase tracking-widest">Directorio</p>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-tight">
                Todos los <span className="gradient-text">speakers</span>
              </h2>
            </div>

            {speakers.length === 0 ? (
              <div className="border border-border/50 bg-card p-8 sm:p-12 text-center space-y-3">
                <p className="text-lg font-semibold">Aún no hay speakers registrados</p>
                <p className="text-sm text-muted-foreground">
                  Vuelve pronto — cada martes se suma un nuevo builder.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {speakers.map((speaker, i) => (
                  <PastSpeakerCard key={speaker.id} speaker={speaker} index={i} />
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
