import type { Metadata } from "next";
import { Check, Route } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { BootcampModalidadCard } from "@/components/programas/BootcampModalidadCard";
import { RutaBloqueadaCard } from "@/components/programas/RutaBloqueadaCard";
import {
  BOOTCAMP_HORARIO,
  CLAUDE_BOOTCAMP,
  RUTAS_BLOQUEADAS,
} from "@/lib/content/bootcamp";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata({
  title: "Programas para profesionales",
  description:
    "Claude Bootcamp: aprende Claude Chat, Cowork y Code en una sesión intensiva. Virtual S/ 159 (30 cupos) o presencial S/ 249 (10 cupos). Sin código.",
  path: "/programas/profesionales",
});

export default function ProgramasProfesionalesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Programas", path: "/programas" },
            { name: "Profesionales", path: "/programas/profesionales" },
          ]),
          courseJsonLd({
            name: CLAUDE_BOOTCAMP.nombre,
            description: CLAUDE_BOOTCAMP.descripcion,
            url: `${SITE_URL}/programas/profesionales`,
          }),
        ]}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto space-y-14">
          <header className="space-y-4 max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-primary">
              Programas · Profesionales
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              {CLAUDE_BOOTCAMP.nombre}
            </h1>
            <p className="text-base text-primary font-medium">{CLAUDE_BOOTCAMP.tagline}</p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {CLAUDE_BOOTCAMP.descripcion} Diseñado para personas{" "}
              <strong className="text-foreground font-medium">sin conocimiento de código</strong>.
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <li>· 30 cupos virtual · 10 presencial</li>
              <li>· {BOOTCAMP_HORARIO}</li>
              <li>· Virtual y presencial (Lima)</li>
            </ul>
          </header>

          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl tracking-tight">
              Elige tu modalidad
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <BootcampModalidadCard modalidad="virtual" location="bootcamp_virtual" />
              <BootcampModalidadCard modalidad="presencial" location="bootcamp_presencial" />
            </div>
          </section>

          <section className="border border-border/40 bg-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-lg sm:text-xl tracking-tight">Qué incluye</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {CLAUDE_BOOTCAMP.incluye.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="rutas" className="space-y-4">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <h2 className="font-serif text-xl sm:text-2xl tracking-tight">
                Rutas de aprendizaje
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Próximamente — recorridos guiados de varias sesiones. Precios referenciales.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {RUTAS_BLOQUEADAS.map((ruta) => (
                <RutaBloqueadaCard key={ruta.slug} ruta={ruta} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
