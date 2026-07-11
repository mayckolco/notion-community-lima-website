import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Layers, Route } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ProgramaCard } from "@/components/programas/ProgramaCard";
import { PreReservaDualButtons } from "@/components/PreReservaButton";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";
import {
  CURSOS,
  PROGRAMAS,
  RUTAS,
  PROGRAMA_FEATURES,
  COHORT_CUPOS,
  DURACION_SESION,
} from "@/lib/content/programas";

export const metadata: Metadata = createPageMetadata({
  title: "Programas para profesionales",
  description:
    "Cursos, programas y rutas para aprender Claude desde cero hasta experto. Chat, Cowork y Code para personas no técnicas. Cohortes de 10, virtual y presencial.",
  path: "/programas/profesionales",
});

const SECTIONS = [
  {
    id: "cursos",
    icon: GraduationCap,
    title: "Cursos",
    description:
      "Sesiones de 3–4 horas por producto y nivel. Empieza con Claude Chat, avanza a Cowork y Code sin programar.",
  },
  {
    id: "programas",
    icon: Layers,
    title: "Programas",
    description:
      "Paquetes con descuento que combinan varios cursos. La forma más eficiente de avanzar por etapas.",
  },
  {
    id: "rutas",
    icon: Route,
    title: "Rutas de aprendizaje",
    description:
      "Recorridos guiados de cero a experto con el mismo mentor. Elige la ruta según tu objetivo.",
  },
] as const;

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
            name: "Formaciones Claude Perú para profesionales",
            description:
              "Cursos, programas y rutas para aprender Claude Chat, Cowork y Code desde cero hasta experto.",
            url: `${SITE_URL}/programas/profesionales`,
          }),
        ]}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero */}
          <div className="space-y-6 max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-primary">
              Programas · Profesionales
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Aprende Claude de{" "}
              <span className="gradient-text">cero a experto</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              Cursos, programas y rutas diseñados para personas{" "}
              <strong className="text-foreground font-medium">sin conocimiento de código</strong>.
              Cubrimos Claude Chat, Cowork y Code con mentores, casos prácticos y demos en vivo.
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li>· {COHORT_CUPOS} cupos por cohorte — clases personalizadas</li>
              <li>· {DURACION_SESION} (virtual y presencial)</li>
              <li>· Modalidad virtual y presencial (Lima)</li>
              <li>· Pre-reserva por WhatsApp — sin pago anticipado</li>
            </ul>
          </div>

          {/* Featured CTA */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-[#1c1917] px-6 py-10 sm:px-10 sm:py-14">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217, 119, 87, 0.35), transparent 70%)",
              }}
            />
            <div className="relative max-w-2xl mx-auto text-center space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-[#f5f1eb]">
                ¿No sabes por dónde empezar?
              </h2>
              <p className="text-sm sm:text-base text-[#f5f1eb]/75 leading-relaxed">
                La <strong className="text-[#f5f1eb]">Ruta Desde Cero a Experto</strong> te guía
                por los 6 cursos en orden. O escríbenos y te recomendamos la mejor opción.
              </p>
              <PreReservaDualButtons
                programaNombre="Ruta Desde Cero a Experto"
                location="profesionales_hero"
                layout="hero"
                className="justify-center"
              />
              <Link
                href="/programas/profesionales/ruta-desde-cero"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Ver ruta completa
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>

          {/* What's included */}
          <section className="border border-border/40 bg-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl tracking-tight">
              Qué incluye cada formación
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {PROGRAMA_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          {/* Sections nav */}
          <nav className="flex flex-wrap gap-3">
            {SECTIONS.map(({ id, icon: Icon, title }) => (
              <a
                key={id}
                href={`#${id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {title}
              </a>
            ))}
          </nav>

          {/* Cursos */}
          <section id="cursos" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">
                {SECTIONS[0].title}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
                {SECTIONS[0].description}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {CURSOS.map((curso) => (
                <ProgramaCard
                  key={curso.slug}
                  programa={curso}
                  href={`/programas/profesionales/${curso.slug}`}
                  location="profesionales_cursos"
                />
              ))}
            </div>
          </section>

          {/* Programas */}
          <section id="programas" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">
                {SECTIONS[1].title}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
                {SECTIONS[1].description}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {PROGRAMAS.map((programa) => (
                <ProgramaCard
                  key={programa.slug}
                  programa={programa}
                  href={`/programas/profesionales/${programa.slug}`}
                  location="profesionales_programas"
                />
              ))}
            </div>
          </section>

          {/* Rutas */}
          <section id="rutas" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">
                {SECTIONS[2].title}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
                {SECTIONS[2].description}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {RUTAS.map((ruta) => (
                <ProgramaCard
                  key={ruta.slug}
                  programa={ruta}
                  href={`/programas/profesionales/${ruta.slug}`}
                  location="profesionales_rutas"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
