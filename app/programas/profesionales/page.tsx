import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Programas para profesionales · Claude Perú",
  description:
    "Formaciones prácticas para dominar Claude en tu trabajo: fundamentos, prompting y casos de uso reales. Empieza desde cero con la comunidad Claude Perú.",
};

const PRE_RESERVA_URL = "https://chat.whatsapp.com/CvBaizXWjtZCstUgXlJqi3";

export default function ProgramasProfesionalesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-primary">
              Programas · Profesionales
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
              Domina Claude en tu <span className="gradient-text">trabajo diario</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Formaciones prácticas para profesionales de cualquier área: aprende los
              fundamentos de Claude, prompting efectivo y casos de uso aplicables desde
              el primer día — sin experiencia previa en IA.
            </p>
          </div>

          <article className="relative overflow-hidden rounded-2xl border border-primary/25 bg-[#1c1917] px-6 py-12 sm:px-10 sm:py-16 text-center shadow-clay">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217, 119, 87, 0.35), transparent 70%)",
              }}
            />

            <div className="relative mx-auto max-w-2xl space-y-6 sm:space-y-8">
              <span className="inline-block rounded-full border border-primary/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                Próximamente
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight bg-gradient-to-r from-[#fb923c] via-primary to-[#fb7185] bg-clip-text text-transparent">
                Claude para principiantes
              </h2>

              <p className="text-sm sm:text-base text-[#f5f1eb]/75 leading-relaxed">
                Programa introductorio para empezar con Claude desde cero. Aprende los
                fundamentos, casos de uso prácticos y cómo integrarlo en tu día a día
                como builder — sin experiencia previa en IA.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  size="lg"
                  className="min-h-[52px] bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white border-0 shadow-[0_8px_24px_-6px_rgba(249,115,22,0.55)] hover:opacity-95"
                  render={
                    <a
                      href={PRE_RESERVA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  Pre-reserva
                  <ArrowRight className="h-5 w-5 ml-2" strokeWidth={1.75} />
                </Button>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
