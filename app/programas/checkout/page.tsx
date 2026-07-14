import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "@/components/programas/CheckoutForm";
import { CLAUDE_BOOTCAMP } from "@/lib/content/bootcamp";
import type { ProgramaModalidad } from "@/lib/content/programas";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Inscripción · Notion Bootcamp",
  description:
    "Inscríbete a Notion Bootcamp: elige fecha, completa tus datos y paga por Yape. Virtual S/ 159 o presencial S/ 249.",
  path: "/programas/checkout",
  noIndex: true,
});

interface PageProps {
  searchParams: { programa?: string; modalidad?: string; fecha?: string };
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
  if (!searchParams.fecha) redirect("/programas/profesionales");

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen px-4 sm:px-6 py-12 sm:py-16"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--border) / 0.4) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <CheckoutForm modalidad={modalidad} initialFechaId={searchParams.fecha} />
        </div>
      </main>
      <Footer />
    </>
  );
}
