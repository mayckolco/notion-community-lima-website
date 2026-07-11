import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Monitor,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { PreReservaDualButtons } from "@/components/PreReservaButton";
import { RutaSteps } from "@/components/programas/ProgramaCard";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";
import {
  ALL_PROGRAMAS,
  getProgramaBySlug,
  formatPrecio,
  NIVEL_LABELS,
  PRODUCTO_LABELS,
  type ProgramaBundle,
  type RutaAprendizaje,
} from "@/lib/content/programas";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_PROGRAMAS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const programa = getProgramaBySlug(params.slug);
  if (!programa) return {};

  return createPageMetadata({
    title: programa.nombre,
    description: programa.descripcion,
    path: `/programas/profesionales/${programa.slug}`,
  });
}

const TIPO_LABEL: Record<string, string> = {
  curso: "Curso",
  programa: "Programa",
  ruta: "Ruta de aprendizaje",
};

export default function ProgramaDetallePage({ params }: PageProps) {
  const programa = getProgramaBySlug(params.slug);
  if (!programa) notFound();

  const isBundle = programa.tipo === "programa";
  const isRuta = programa.tipo === "ruta";
  const bundle = isBundle ? (programa as ProgramaBundle) : null;
  const ruta = isRuta ? (programa as RutaAprendizaje) : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Programas", path: "/programas" },
            { name: "Profesionales", path: "/programas/profesionales" },
            { name: programa.nombre, path: `/programas/profesionales/${programa.slug}` },
          ]),
          courseJsonLd({
            name: programa.nombre,
            description: programa.descripcion,
            url: `${SITE_URL}/programas/profesionales/${programa.slug}`,
          }),
        ]}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto space-y-10">
          <Link
            href="/programas/profesionales"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Volver al catálogo
          </Link>

          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-primary/40 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary">
                {TIPO_LABEL[programa.tipo]}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {PRODUCTO_LABELS[programa.producto]}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Nivel {programa.nivel} · {NIVEL_LABELS[programa.nivel]}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">{programa.nombre}</h1>
            <p className="text-lg text-primary font-medium">{programa.tagline}</p>
            <p className="text-muted-foreground leading-relaxed">{programa.descripcion}</p>
          </header>

          {/* Pricing & logistics */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Monitor className="h-4 w-4 text-primary" strokeWidth={1.75} />
                Modalidad virtual
              </div>
              <p className="font-serif text-3xl tracking-tight">
                {formatPrecio(programa.precio.virtual)}
              </p>
              <p className="text-xs text-muted-foreground">
                {programa.duracion} · En vivo por videollamada
              </p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" strokeWidth={1.75} />
                Modalidad presencial
              </div>
              <p className="font-serif text-3xl tracking-tight">
                {formatPrecio(programa.precio.presencial)}
              </p>
              <p className="text-xs text-muted-foreground">
                {programa.duracion} · Lima, Perú
              </p>
            </div>
          </div>

          <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" strokeWidth={1.75} />
              {programa.cupos} cupos por cohorte
            </li>
            <li className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" strokeWidth={1.75} />
              {programa.duracion}
            </li>
            {ruta?.duracionTotal && (
              <li className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" strokeWidth={1.75} />
                {ruta.duracionTotal}
              </li>
            )}
          </ul>

          {bundle && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm">
              Ahorras{" "}
              <strong>{formatPrecio(bundle.ahorroVirtual)}</strong> en virtual o{" "}
              <strong>{formatPrecio(bundle.ahorroPresencial)}</strong> en presencial vs
              comprar los cursos por separado.
            </div>
          )}

          <PreReservaDualButtons
            programaNombre={programa.nombre}
            location={`programa_detalle_${programa.slug}`}
          />

          {/* Para quién */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl tracking-tight">Para quién es</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{programa.paraQuien}</p>
            {programa.prerequisitos && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Requisitos: </span>
                {programa.prerequisitos}
              </p>
            )}
          </section>

          {/* Ruta steps */}
          {ruta && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl tracking-tight">Pasos de la ruta</h2>
              <RutaSteps pasos={ruta.pasos} />
            </section>
          )}

          {/* Temario */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-tight">Temario</h2>
            <ul className="space-y-2">
              {programa.temario.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2
                    className="h-4 w-4 text-primary shrink-0 mt-0.5"
                    strokeWidth={1.75}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Incluye */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-tight">Qué incluye</h2>
            <ul className="space-y-2">
              {programa.incluye.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2
                    className="h-4 w-4 text-primary shrink-0 mt-0.5"
                    strokeWidth={1.75}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-border/40 pt-8">
            <PreReservaDualButtons
              programaNombre={programa.nombre}
              location={`programa_detalle_footer_${programa.slug}`}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
