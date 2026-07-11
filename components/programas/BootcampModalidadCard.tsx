"use client";

import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { Clock, Info, MapPin, Monitor, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BOOTCAMP_CUPOS,
  BOOTCAMP_DURACION,
  CLAUDE_BOOTCAMP,
  buildBootcampInfoUrl,
  buildCheckoutUrl,
  formatBootcampPrecio,
} from "@/lib/content/bootcamp";
import type { ProgramaModalidad } from "@/lib/content/programas";
import { GA_EVENTS } from "@/lib/seo/analytics";
import { cn } from "@/lib/utils";

interface BootcampModalidadCardProps {
  modalidad: ProgramaModalidad;
  location: string;
}

export function BootcampModalidadCard({ modalidad, location }: BootcampModalidadCardProps) {
  const isVirtual = modalidad === "virtual";
  const precio = isVirtual
    ? CLAUDE_BOOTCAMP.precio.virtual
    : CLAUDE_BOOTCAMP.precio.presencial;

  return (
    <article
      className={cn(
        "flex flex-col min-w-0 rounded-2xl border p-6 sm:p-8 space-y-5",
        isVirtual
          ? "border-border/40 bg-card"
          : "border-primary/25 bg-primary/5"
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        {isVirtual ? (
          <Monitor className="h-4 w-4 text-primary shrink-0" strokeWidth={1.75} />
        ) : (
          <MapPin className="h-4 w-4 text-primary shrink-0" strokeWidth={1.75} />
        )}
        {isVirtual ? "Modalidad virtual" : "Modalidad presencial"}
      </div>

      <div className="space-y-1">
        <p className="font-serif text-3xl sm:text-4xl tracking-tight">
          {formatBootcampPrecio(precio)}
        </p>
        <p className="text-xs text-muted-foreground">
          {BOOTCAMP_DURACION}
          {isVirtual ? " · En vivo por videollamada" : " · Lima, Perú"}
        </p>
      </div>

      <ul className="space-y-1.5 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.75} />
          {BOOTCAMP_CUPOS} cupos por cohorte
        </li>
        <li className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.75} />
          {BOOTCAMP_DURACION}
        </li>
      </ul>

      <div className="flex flex-col gap-2 pt-1">
        <Button
          size="sm"
          className="w-full min-h-[40px] touch-manipulation"
          render={<Link href={buildCheckoutUrl(modalidad)} />}
        >
          Pre-reserva
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full min-h-[40px] touch-manipulation"
          render={
            <a
              href={buildBootcampInfoUrl(modalidad)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                sendGAEvent("event", GA_EVENTS.clickWhatsapp, {
                  location: `${location}_info`,
                  programa: "Claude Bootcamp",
                  modalidad,
                })
              }
            />
          }
        >
          <Info className="h-3.5 w-3.5 mr-1.5 shrink-0" strokeWidth={1.75} />
          Más información
        </Button>
      </div>
    </article>
  );
}
