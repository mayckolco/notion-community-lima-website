import type { Metadata } from "next";
import { Route } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { BootcampFechasSection } from "@/components/programas/BootcampFechasSection";
import { RutaBloqueadaCard } from "@/components/programas/RutaBloqueadaCard";
import {
  CLAUDE_BOOTCAMP,
  RUTAS_BLOQUEADAS,
} from "@/lib/content/bootcamp";
import { fetchBootcampFechas } from "@/lib/notion/bootcamp";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata({
  title: "Programas para profesionales",
  description:
    "Claude Bootcamp: aprende los fundamentos de Claude Chat, Cowork y Code en una sesión intensiva. Virtual S/ 159 o presencial S/ 249.",
  path: "/programas/profesionales",
});

export default async function ProgramasProfesionalesPage() {
  const [fechasVirtual, fechasPresencial] = await Promise.all([
    fetchBootcampFechas("virtual").catch(() => []),
    fetchBootcampFechas("presencial").catch(() => []),
  ]);

  const fechas = [...fechasVirtual, ...fechasPresencial].sort((a, b) =>
    a.fecha.localeCompare(b.fecha)
  );

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
              <strong className="text-foreground font-medium">sin conocimiento técnico</strong>.
            </p>
          </header>

          <BootcampFechasSection fechas={fechas} />

          <section id="rutas" className="space-y-4">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <h2 className="font-serif text-xl sm:text-2xl tracking-tight">
                Rutas de aprendizaje
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Próximamente: recorridos guiados de varias sesiones en modalidad virtual o presencial.
            </p>
            <div className="grid gap-4 lg:grid-cols-3">
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
