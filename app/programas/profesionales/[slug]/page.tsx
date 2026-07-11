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
import { PreReservaButton } from "@/components/PreReservaButton";
import { RutaSteps } from "@/components/programas/ProgramaCard";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";
import {
  ALL_PROGRAMAS,
  getProgramaBySlug,
  formatPrecio,
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
      <main className="min-h-screen px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <Link
            href="/programas/profesionales"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Volver al catálogo
          </Link>

          <header className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-primary/40 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary">
                {TIPO_LABEL[programa.tipo]}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {PRODUCTO_LABELS[programa.producto]}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {programa.nivelLabel}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight">
              {programa.nombre}
            </h1>
            <p className="text-base text-primary font-medium">{programa.tagline}</p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {programa.descripcion}
            </p>
          </header>

          {/* Precios con CTA integrado */}
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Precios y modalidades
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex flex-col rounded-2xl border border-border/40 bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Monitor className="h-4 w-4 text-primary shrink-0" strokeWidth={1.75} />
                  Virtual
                </div>
                <p className="font-serif text-2xl sm:text-3xl tracking-tight">
                  {formatPrecio(programa.precio.virtual)}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {programa.duracion}. En vivo por videollamada.
                </p>
                <PreReservaButton
                  programaNombre={programa.nombre}
                  modalidad="virtual"
                  location={`programa_detalle_virtual_${programa.slug}`}
                  layout="card"
                />
              </div>
              <div className="flex flex-col rounded-2xl border border-primary/25 bg-primary/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary shrink-0" strokeWidth={1.75} />
                  Presencial
                </div>
                <p className="font-serif text-2xl sm:text-3xl tracking-tight">
                  {formatPrecio(programa.precio.presencial)}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {programa.duracion}. Lima, Perú.
                </p>
                <PreReservaButton
                  programaNombre={programa.nombre}
                  modalidad="presencial"
                  location={`programa_detalle_presencial_${programa.slug}`}
                  layout="card"
                  variant="outline"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.75} />
              {programa.cupos} cupos por cohorte
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.75} />
              {programa.duracion}
            </span>
            {ruta?.duracionTotal && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.75} />
                {ruta.duracionTotal}
              </span>
            )}
          </div>

          {bundle && (
            <p className="rounded-lg border border-green-500/25 bg-green-500/5 px-4 py-2.5 text-xs sm:text-sm text-muted-foreground">
              Paquete con descuento: ahorras{" "}
              <strong className="text-foreground">{formatPrecio(bundle.ahorroVirtual)}</strong> en
              virtual o{" "}
              <strong className="text-foreground">{formatPrecio(bundle.ahorroPresencial)}</strong> en
              presencial vs cursos sueltos.
            </p>
          )}

          {/* Para quién */}
          <section className="space-y-2 border-t border-border/40 pt-6">
            <h2 className="font-serif text-lg sm:text-xl tracking-tight">Para quién es</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{programa.paraQuien}</p>
            {programa.prerequisitos && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Requisitos: </span>
                {programa.prerequisitos}
              </p>
            )}
          </section>

          {ruta && (
            <section className="space-y-3">
              <h2 className="font-serif text-lg sm:text-xl tracking-tight">Pasos de la ruta</h2>
              <RutaSteps pasos={ruta.pasos} />
            </section>
          )}

          <section className="space-y-3">
            <h2 className="font-serif text-lg sm:text-xl tracking-tight">Temario</h2>
            <ul className="space-y-2">
              {programa.temario.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2
                    className="h-4 w-4 text-primary shrink-0 mt-0.5"
                    strokeWidth={1.75}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg sm:text-xl tracking-tight">Qué incluye</h2>
            <ul className="space-y-2">
              {programa.incluye.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2
                    className="h-4 w-4 text-primary shrink-0 mt-0.5"
                    strokeWidth={1.75}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-4 sm:px-5 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Pre-reserva sin pago anticipado. Te confirmamos fechas por WhatsApp.
            </p>
            <div className="flex gap-2 shrink-0">
              <PreReservaButton
                programaNombre={programa.nombre}
                modalidad="virtual"
                location={`programa_detalle_footer_${programa.slug}`}
                layout="detail"
              />
              <PreReservaButton
                programaNombre={programa.nombre}
                modalidad="presencial"
                location={`programa_detalle_footer_${programa.slug}`}
                layout="detail"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
