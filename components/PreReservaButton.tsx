"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_DIRECT_URL } from "@/lib/content/constants";
import type { ProgramaModalidad } from "@/lib/content/programas";
import { GA_EVENTS } from "@/lib/seo/analytics";
import { cn } from "@/lib/utils";

export type PreReservaLayout = "card" | "detail" | "hero";

interface PreReservaButtonProps {
  programaNombre: string;
  modalidad: ProgramaModalidad;
  location: string;
  layout?: PreReservaLayout;
  variant?: "default" | "outline";
  className?: string;
}

function buildPreReservaUrl(nombre: string, modalidad: ProgramaModalidad): string {
  const modalidadLabel = modalidad === "virtual" ? "virtual" : "presencial";
  const text = `Hola! Quiero pre-reservar el programa "${nombre}" en modalidad ${modalidadLabel}. Me interesa conocer fechas, cupos y detalles. Gracias!`;
  return `${WHATSAPP_DIRECT_URL}?text=${encodeURIComponent(text)}`;
}

function getLabel(modalidad: ProgramaModalidad, layout: PreReservaLayout): string {
  if (layout === "hero") {
    return modalidad === "virtual" ? "Pre-reserva virtual" : "Pre-reserva presencial";
  }
  return modalidad === "virtual" ? "Reservar virtual" : "Reservar presencial";
}

export function PreReservaButton({
  programaNombre,
  modalidad,
  location,
  layout = "detail",
  variant = "default",
  className,
}: PreReservaButtonProps) {
  const label = getLabel(modalidad, layout);
  const isCard = layout === "card";
  const isHero = layout === "hero";

  return (
    <Button
      size={isHero ? "default" : "sm"}
      variant={variant}
      className={cn(
        isCard && "w-full",
        isHero && "min-h-[44px]",
        !isCard && !isHero && "w-auto shrink-0",
        "touch-manipulation",
        className
      )}
      render={
        <a
          href={buildPreReservaUrl(programaNombre, modalidad)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            sendGAEvent("event", GA_EVENTS.preReservaPrograma, {
              location,
              programa: programaNombre,
              modalidad,
            })
          }
        />
      }
    >
      <MessageCircle
        className={cn("shrink-0", isCard ? "h-3.5 w-3.5 mr-1.5" : "h-4 w-4 mr-1.5")}
        strokeWidth={1.75}
      />
      <span className={cn(isCard && "text-xs")}>{label}</span>
    </Button>
  );
}

export function PreReservaDualButtons({
  programaNombre,
  location,
  className,
  layout = "detail",
}: {
  programaNombre: string;
  location: string;
  className?: string;
  layout?: PreReservaLayout;
}) {
  const isCard = layout === "card";

  return (
    <div
      className={cn(
        "flex gap-2 min-w-0",
        isCard ? "flex-col" : "flex-row flex-wrap items-center",
        className
      )}
    >
      <PreReservaButton
        programaNombre={programaNombre}
        modalidad="virtual"
        location={location}
        layout={layout}
      />
      <PreReservaButton
        programaNombre={programaNombre}
        modalidad="presencial"
        location={location}
        layout={layout}
        variant="outline"
      />
    </div>
  );
}
