import type { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, MessageCircle, ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { RegisterEventLink } from "@/components/RegisterEventLink";
import { listConfirmedSlots, listPastSlotsWithRecordings } from "@/lib/notion/slots";
import type { PastSlotRecord } from "@/lib/notion/slots";
import type { Slot } from "@/lib/schemas";
import { EVENT_SLOT_HORARIO } from "@/lib/content/constants";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, eventJsonLd } from "@/lib/seo/json-ld";

export const revalidate = 0;

export const metadata: Metadata = createPageMetadata({
  title: "Eventos",
  description:
    "Próximos eventos y webinars de la comunidad Claude Perú. Sesiones con builders y founders que comparten sus experiencias construyendo con IA.",
  path: "/eventos",
});

export default async function EventosPage() {
  const [slots, pastSlots] = await Promise.all([
    listConfirmedSlots().catch(() => []),
    listPastSlotsWithRecordings().catch(() => []),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Eventos", path: "/eventos" },
          ]),
          ...slots.map((slot) => eventJsonLd(slot)),
        ]}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">
              Próximos eventos
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight">
              Eventos de <span className="gradient-text">Claude Perú</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Sesiones disponibles con builders y founders que comparten sus
              experiencias construyendo con IA.
            </p>
          </div>

          {slots.length === 0 ? (
            <div className="border border-border/50 bg-card p-12 text-center space-y-3">
              <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-lg font-semibold">No hay eventos disponibles aún</p>
              <p className="text-sm text-muted-foreground">
                Vuelve pronto — los eventos se confirman semanas antes.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {slots.map((slot) => (
                <ConfirmedSlotCard key={slot.id} slot={slot} />
              ))}
            </div>
          )}

          {pastSlots.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-border/60">
              <div className="space-y-2">
                <p className="text-xs font-mono text-primary uppercase tracking-widest">
                  Eventos pasados
                </p>
                <h2 className="text-2xl font-serif tracking-tight">
                  Grabaciones de <span className="gradient-text">charlas anteriores</span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Revive los webinars con casos reales de la comunidad.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {pastSlots.map((slot) => (
                  <PastSlotCard key={slot.id} slot={slot} />
                ))}
              </div>
            </section>
          )}

          <div className="border border-border/40 bg-card rounded-lg p-8 sm:p-12 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif tracking-tight">
                ¿Quieres ser el próximo <span className="gradient-text">speaker</span>?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                Comparte tu experiencia construyendo con IA frente a la comunidad Claude Perú.
              </p>
            </div>

            <Link
              href="/aplicar"
              className="inline-flex items-center gap-2 min-h-[52px] px-8 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors touch-manipulation"
            >
              Aplicar ahora
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">¿Prefieres hablar con alguien antes?</p>
              <a
                href="https://wa.me/51946542990"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 text-sm font-semibold border border-border/60 text-foreground hover:bg-muted/30 transition-colors touch-manipulation"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                Escribir por WhatsApp
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}


function PastSlotCard({ slot }: { slot: PastSlotRecord }) {
  const date = parseISO(slot.fecha);
  const dayName = format(date, "EEEE d MMM yyyy", { locale: es });

  return (
    <div className="border border-border/30 bg-card rounded-lg p-6 sm:p-8 space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {dayName}
      </p>

      <h3 className="text-lg sm:text-xl font-serif leading-snug">
        {slot.titulo ?? "Charla de la comunidad"}
      </h3>

      {slot.speaker && (
        <p className="text-sm text-muted-foreground">
          {slot.speaker.nombre}
          {(slot.speaker.rol || slot.speaker.empresa) &&
            ` · ${[slot.speaker.rol, slot.speaker.empresa].filter(Boolean).join(" · ")}`}
        </p>
      )}

      <a
        href={slot.grabacionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 min-h-[44px] px-5 text-sm font-semibold border border-primary/40 text-primary hover:bg-primary/5 transition-colors touch-manipulation"
      >
        <Play className="h-4 w-4" />
        Ver grabación
      </a>
    </div>
  );
}

function ConfirmedSlotCard({ slot }: { slot: Slot }) {
  const date = parseISO(slot.fecha);
  const dayName = format(date, "EEEE d MMM", { locale: es });
  const hora = EVENT_SLOT_HORARIO;

  return (
    <div className="border border-border/30 bg-card rounded-lg overflow-hidden flex flex-col sm:flex-row">
      <div className="flex-1 p-6 sm:p-8 space-y-4 flex flex-col">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Disponible · {dayName} · {hora}
        </p>

        {slot.titulo ? (
          <h2 className="text-xl sm:text-2xl font-serif leading-snug">
            {slot.titulo}
          </h2>
        ) : (
          <h2 className="text-xl sm:text-2xl font-serif leading-snug text-muted-foreground">
            Sesión confirmada
          </h2>
        )}

        {slot.speaker && (
          <div className="flex items-center gap-3 pt-1">
            {slot.speaker.foto ? (
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                <Image
                  src={slot.speaker.foto}
                  alt={slot.speaker.nombre}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/20 shrink-0 flex items-center justify-center text-xs font-bold text-primary">
                {slot.speaker.nombre.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium leading-none truncate">
                {slot.speaker.nombre}
              </p>
              {(slot.speaker.rol || slot.speaker.empresa) && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {[slot.speaker.rol, slot.speaker.empresa]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 mt-auto">
          {slot.lumaUrl ? (
            <RegisterEventLink
              href={slot.lumaUrl}
              slotId={slot.id}
              className="inline-flex items-center gap-2 min-h-[48px] px-6 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors touch-manipulation"
            >
              Apartar mi lugar →
            </RegisterEventLink>
          ) : null}
        </div>
      </div>
    </div>
  );
}
