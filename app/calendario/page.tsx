import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, MessageCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { listConfirmedSlots, listAvailableSlots } from "@/lib/notion/slots";
import type { Slot } from "@/lib/schemas";

export const revalidate = 0;

type CalendarEntry = { type: "confirmed"; slot: Slot } | { type: "available"; slot: Slot };

export default async function CalendarioPage() {
  let confirmedSlots: Slot[] = [];
  let availableSlots: Slot[] = [];

  [confirmedSlots, availableSlots] = await Promise.all([
    listConfirmedSlots().catch(() => []),
    listAvailableSlots().catch(() => []),
  ]);

  const entries: CalendarEntry[] = [
    ...confirmedSlots.map((slot): CalendarEntry => ({ type: "confirmed", slot })),
    ...availableSlots.map((slot): CalendarEntry => ({ type: "available", slot })),
  ].sort((a, b) => a.slot.fecha.localeCompare(b.slot.fecha));

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">
              Próximas sesiones
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Calendario de <span className="gradient-text">webinars</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Sesiones confirmadas con builders y founders que comparten sus
              experiencias construyendo con IA.
            </p>
          </div>

          {entries.length === 0 ? (
            <div className="border border-border/50 bg-card p-12 text-center space-y-3">
              <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-lg font-semibold">No hay sesiones confirmadas aún</p>
              <p className="text-sm text-muted-foreground">
                Vuelve pronto — las sesiones se confirman semanas antes.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {entries.map((entry) =>
                entry.type === "confirmed" ? (
                  <ConfirmedSlotCard key={entry.slot.id} slot={entry.slot} />
                ) : (
                  <AvailableSlotCard key={entry.slot.id} slot={entry.slot} />
                )
              )}
            </div>
          )}

          <div className="border border-border/40 bg-card rounded-lg p-8 sm:p-12 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                ¿Quieres ser el próximo <span className="gradient-text">speaker</span>?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                Comparte tu experiencia construyendo con IA frente a la comunidad AI First Founders.
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
                href="https://wa.me/+51946542990"
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

function AvailableSlotCard({ slot }: { slot: Slot }) {
  const date = parseISO(slot.fecha);
  const dayName = format(date, "EEEE d MMM", { locale: es });
  const hora = "11:30am Bogotá";

  return (
    <div className="border border-border/20 bg-card/50 rounded-lg overflow-hidden flex flex-col sm:flex-row opacity-70">
      <div className="flex-1 p-6 sm:p-8 space-y-3 flex flex-col">
        <div className="flex items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {dayName} · {hora}
          </p>
          <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            Disponible
          </span>
        </div>
        <h2 className="text-lg font-semibold text-muted-foreground">
          Fecha abierta para speaker
        </h2>
        <div className="pt-2 mt-auto">
          <Link
            href="/aplicar"
            className="inline-flex items-center gap-2 min-h-[44px] px-5 text-sm font-semibold border border-border/60 text-foreground hover:bg-muted/30 transition-colors touch-manipulation"
          >
            Aplicar para esta fecha
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ConfirmedSlotCard({ slot }: { slot: Slot }) {
  const date = parseISO(slot.fecha);
  const dayName = format(date, "EEEE d MMM", { locale: es });
  const hora = "11:30am Bogotá";

  return (
    <div className="border border-border/30 bg-card rounded-lg overflow-hidden flex flex-col sm:flex-row">
      <div className="flex-1 p-6 sm:p-8 space-y-4 flex flex-col">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {dayName} · {hora}
        </p>

        {slot.titulo ? (
          <h2 className="text-xl sm:text-2xl font-black leading-snug">
            {slot.titulo}
          </h2>
        ) : (
          <h2 className="text-xl sm:text-2xl font-black leading-snug text-muted-foreground">
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
            <a
              href={slot.lumaUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[48px] px-6 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors touch-manipulation"
            >
              Apartar mi lugar →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
