import type { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { FAQSection } from "@/components/FAQSection";
import { RecursosFilter } from "@/components/RecursosFilter";
import { RECURSOS_ESTATICOS, type Recurso } from "@/lib/content/recursos";
import { RECURSOS_FAQ } from "@/lib/content/faq";
import { listPastSlotsWithRecordings } from "@/lib/notion/slots";
import { getNovedades } from "@/lib/novedades/get-novedades";
import { NOVEDAD_TAGS } from "@/lib/content/novedades";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo/json-ld";

export const revalidate = 0;

export const metadata: Metadata = createPageMetadata({
  title: "Recursos",
  description:
    "Guías, links y grabaciones para aprender Notion, Notion AI, templates y automatizaciones. Recursos curados por la comunidad Notion Lima.",
  path: "/recursos",
});

function pastSlotsToRecursos(
  slots: Awaited<ReturnType<typeof listPastSlotsWithRecordings>>
): Recurso[] {
  return slots.map((slot) => ({
    id: `grabacion-${slot.id}`,
    titulo: slot.titulo ?? "Charla de la comunidad",
    descripcion:
      slot.descripcion ??
      "Grabación de una sesión de Notion Lima con casos reales de miembros de la comunidad.",
    categoria: "comunidad" as const,
    url: slot.grabacionUrl,
    tipo: "grabacion" as const,
    externo: true,
    fecha: slot.fecha,
    speaker: slot.speaker?.nombre,
  }));
}

export default async function RecursosPage() {
  const [pastSlots, novedades] = await Promise.all([
    listPastSlotsWithRecordings().catch(() => []),
    getNovedades(),
  ]);
  const grabaciones = pastSlotsToRecursos(pastSlots);
  const recursos = [...grabaciones, ...RECURSOS_ESTATICOS];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Recursos", path: "/recursos" },
          ]),
          faqPageJsonLd(RECURSOS_FAQ),
        ]}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-primary">Recursos</p>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
              Aprende Notion con{" "}
              <span className="gradient-text">recursos curados</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Guías oficiales, tips de la comunidad y grabaciones de charlas.
              Filtra por categoría para encontrar lo que necesitas.
            </p>
          </div>

          <RecursosFilter recursos={recursos} />

          <section className="space-y-6 pt-4 border-t border-border/60">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-primary">Novedades</p>
              <h2 className="font-serif text-2xl tracking-tight">
                Últimos lanzamientos de{" "}
                <span className="gradient-text">Notion</span>
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {novedades.map((item) => {
                const Wrapper = item.url ? "a" : "article";
                const wrapperProps = item.url
                  ? { href: item.url, target: "_blank" as const, rel: "noopener noreferrer", "aria-label": item.titulo }
                  : {};
                return (
                  <Wrapper
                    key={item.id}
                    {...wrapperProps}
                    className={`group rounded-xl border border-border bg-card p-5 space-y-2 shadow-soft transition-all duration-200 hover:border-primary/40 ${item.url ? "block cursor-pointer" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest rounded-full border border-border px-2 py-0.5 text-muted-foreground">
                        {NOVEDAD_TAGS[item.tag]}
                      </span>
                      <time
                        dateTime={item.fecha}
                        className="text-[10px] text-muted-foreground/70"
                      >
                        {format(parseISO(item.fecha), "d MMM yyyy", { locale: es })}
                      </time>
                    </div>
                    <h3 className="font-serif text-base group-hover:text-primary transition-colors">{item.titulo}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.resumen}
                    </p>
                  </Wrapper>
                );
              })}
            </div>
          </section>

          <FAQSection faqs={RECURSOS_FAQ} title="Preguntas sobre recursos" />
        </div>
      </main>
      <Footer />
    </>
  );
}
