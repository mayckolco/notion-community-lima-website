import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SlotCarousel } from "@/components/SlotCarousel";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { JsonLd } from "@/components/JsonLd";
import { listAvailableSlots } from "@/lib/notion/slots";
import type { Slot } from "@/lib/schemas";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

export const revalidate = 0;

export const metadata: Metadata = createPageMetadata({
  title: "Aplicar como speaker",
  description:
    "Postula para compartir tu experiencia con Notion en una sesión de la comunidad Notion Lima. Elige una fecha y envía tu charla.",
  path: "/aplicar",
});

async function getSlots(): Promise<Slot[]> {
  try {
    return await listAvailableSlots();
  } catch (err) {
    console.error("[/aplicar] listAvailableSlots failed:", err);
    return [];
  }
}

export default async function AplicarPage() {
  const slots = await getSlots();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Aplicar como speaker", path: "/aplicar" },
        ])}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 min-h-[44px] touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Volver al inicio
            </Link>

            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight">
              ¡Convocatoria abierta: Notion Lima – <span className="gradient-text">Call for speakers!</span>
            </h1>
            <div className="text-sm sm:text-base text-muted-foreground mt-3 max-w-4xl space-y-3 leading-relaxed">
              <p>¿Usas Notion en tu trabajo, equipo o startup y tienes algo que compartir?</p>
              <p>Tu experiencia, sistemas y aprendizajes pueden inspirar a otros miembros de la comunidad. No importa si es tu primera vez como speaker o ya has presentado antes. Sé parte de los speakers de Notion Lima.</p>
            </div>
          </div>

          {slots.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-card p-12 text-center space-y-3 shadow-soft">
              <p className="text-lg font-semibold">No hay slots disponibles en este momento</p>
              <p className="text-sm text-muted-foreground">
                Vuelve pronto o escríbenos para más información.
              </p>
            </div>
          ) : (
            <SlotCarousel slots={slots} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
