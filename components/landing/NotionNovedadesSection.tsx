import Link from "next/link";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import type { Novedad } from "@/lib/content/novedades";
import { NOVEDAD_TAGS } from "@/lib/content/novedades";

interface NotionNovedadesSectionProps {
  novedades: Novedad[];
}

export function NotionNovedadesSection({ novedades }: NotionNovedadesSectionProps) {
  const items = novedades.slice(0, 4);
  const isAutomated = novedades.some((n) => n.id.startsWith("notion-"));

  return (
    <section className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-primary">Novedades</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
              Lo último de <span className="gradient-text">Notion</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Features, actualizaciones y lanzamientos relevantes para la comunidad.
              {isAutomated ? " Sincronizado automáticamente." : " Curado manualmente."}
            </p>
          </div>
          <Link
            href="/recursos"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline shrink-0"
          >
            Ver recursos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const Wrapper = item.url ? "a" : "article";
            const wrapperProps = item.url
              ? {
                  href: item.url,
                  target: "_blank" as const,
                  rel: "noopener noreferrer",
                  "aria-label": item.titulo,
                }
              : {};
            return (
              <Wrapper
                key={item.id}
                {...wrapperProps}
                className={`group rounded-xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-3 transition-all duration-200 hover:border-primary/40 hover:shadow-clay ${item.url ? "cursor-pointer block" : ""}`}
              >
                <div className="flex items-center gap-2 flex-wrap">
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
                <h3 className="font-serif text-lg leading-snug group-hover:text-primary transition-colors">{item.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.resumen}</p>
                {item.url && (
                  <span className="inline-flex items-center gap-1 text-xs text-primary">
                    Leer más
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
