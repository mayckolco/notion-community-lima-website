"use client";

import Link from "next/link";
import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { Check, Clock, MapPin, Monitor, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildBootcampInfoUrl,
  buildCheckoutUrl,
  CLAUDE_BOOTCAMP,
  formatBootcampPrecio,
} from "@/lib/content/bootcamp";
import type { BootcampFecha } from "@/lib/content/bootcamp";
import { GA_EVENTS } from "@/lib/seo/analytics";
import { cn } from "@/lib/utils";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface BootcampFechaCardProps {
  fecha: BootcampFecha;
  location: string;
}

export function BootcampFechaCard({ fecha, location }: BootcampFechaCardProps) {
  const [showIncluye, setShowIncluye] = useState(false);
  const isVirtual = fecha.modalidad === "virtual";
  const precio = isVirtual
    ? CLAUDE_BOOTCAMP.precio.virtual
    : CLAUDE_BOOTCAMP.precio.presencial;
  const precioRegular = isVirtual
    ? CLAUDE_BOOTCAMP.precio.precioRegular.virtual
    : CLAUDE_BOOTCAMP.precio.precioRegular.presencial;
  const beneficios = CLAUDE_BOOTCAMP.incluye[fecha.modalidad];

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border p-5 sm:p-6 space-y-4",
        isVirtual ? "border-border/40 bg-card" : "border-primary/25 bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            {isVirtual ? (
              <Monitor className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            ) : (
              <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            )}
            {isVirtual ? "Virtual" : "Presencial"}
          </div>
          <h3 className="font-serif text-lg tracking-tight leading-tight">{fecha.fechaLabel}</h3>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {fecha.horario}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {fecha.ubicacion}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <Users className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {fecha.cuposDisponibles} cupos disponibles
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Inversión</p>
          <p className="font-serif text-xl font-semibold">{formatBootcampPrecio(precio)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            regular{" "}
            <span className="line-through">{formatBootcampPrecio(precioRegular)}</span>
          </p>
        </div>
      </div>

      <Button
        size="sm"
        className="w-full min-h-[44px] touch-manipulation"
        render={<Link href={buildCheckoutUrl(fecha.modalidad, fecha.id)} />}
      >
        Pre-reserva
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          className="w-full min-h-[40px] touch-manipulation"
          onClick={() => setShowIncluye((value) => !value)}
          aria-expanded={showIncluye}
        >
          Qué incluye
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full min-h-[40px] touch-manipulation"
          render={
            <a
              href={buildBootcampInfoUrl(fecha.modalidad)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                sendGAEvent("event", GA_EVENTS.clickWhatsapp, {
                  location: `${location}_info`,
                  programa: "Claude Bootcamp",
                  modalidad: fecha.modalidad,
                })
              }
            />
          }
        >
          <WhatsAppIcon />
          Más información
        </Button>
      </div>

      {showIncluye && (
        <ul className="space-y-2 pt-1 border-t border-border/40">
          {beneficios.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check
                className="h-4 w-4 text-primary mt-0.5 shrink-0"
                strokeWidth={2}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
