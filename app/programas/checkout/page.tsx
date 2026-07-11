import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "@/components/programas/CheckoutForm";
import { CLAUDE_BOOTCAMP } from "@/lib/content/bootcamp";
import type { ProgramaModalidad } from "@/lib/content/programas";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Checkout — Claude Bootcamp",
  description: "Pre-reserva tu cupo en Claude Bootcamp. Pasarela de demostración — confirmación final por WhatsApp.",
  path: "/programas/checkout",
  noIndex: true,
});

interface PageProps {
  searchParams: { programa?: string; modalidad?: string };
}

function parseModalidad(value: string | undefined): ProgramaModalidad | null {
  if (value === "virtual" || value === "presencial") return value;
  return null;
}

export default function CheckoutPage({ searchParams }: PageProps) {
  if (searchParams.programa !== CLAUDE_BOOTCAMP.slug) {
    redirect("/programas/profesionales");
  }

  const modalidad = parseModalidad(searchParams.modalidad);
  if (!modalidad) notFound();

  const modalidadLabel = modalidad === "virtual" ? "Virtual" : "Presencial";

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-widest text-primary">Checkout</p>
            <h1 className="font-serif text-2xl sm:text-3xl tracking-tight">
              Pre-reserva · {CLAUDE_BOOTCAMP.nombre}
            </h1>
            <p className="text-sm text-muted-foreground">Modalidad {modalidadLabel}</p>
          </div>
          <CheckoutForm modalidad={modalidad} />
        </div>
      </main>
      <Footer />
    </>
  );
}
