import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SlotCarousel } from "@/components/SlotCarousel";
import { Footer } from "@/components/Footer";
import { listSlots } from "@/lib/notion/slots";
import type { Slot } from "@/lib/schemas";

export const revalidate = 0;

async function getSlots(): Promise<Slot[]> {
  try {
    return await listSlots();
  } catch (err) {
    console.error("[/aplicar] listSlots failed:", err);
    return [];
  }
}

export default async function AplicarPage() {
  const slots = await getSlots();

  return (
    <>
    <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 min-h-[44px] touch-manipulation"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            ¡Convocatoria abierta: AIFF – <span className="gradient-text">Call for speakers!</span>
          </h1>
          <div className="text-sm sm:text-base text-muted-foreground mt-3 max-w-4xl space-y-3 leading-relaxed">
            <p>¿Estás construyendo una startup o desarrollando productos con inteligencia artificial?</p>
            <p>Tu experiencia, aprendizajes y desafíos pueden inspirar a la próxima generación de founders y builders. No importa si es tu primera vez como speaker o si ya has compartido en escenarios antes y sé parte de AIFF Speakers.</p>
          </div>
        </div>

        {slots.length === 0 ? (
          <div className="border border-border/50 bg-card p-12 text-center space-y-3">
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
