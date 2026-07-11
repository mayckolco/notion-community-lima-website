"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_DIRECT_URL } from "@/lib/content/constants";
import type { ProgramaModalidad } from "@/lib/content/programas";
import { GA_EVENTS } from "@/lib/seo/analytics";
import { cn } from "@/lib/utils";

interface PreReservaButtonProps {
  programaNombre: string;
  modalidad: ProgramaModalidad;
  location: string;
  size?: "default" | "lg" | "sm";
  variant?: "default" | "outline";
  className?: string;
  fullWidth?: boolean;
  compact?: boolean;
}

function buildPreReservaUrl(nombre: string, modalidad: ProgramaModalidad): string {
  const modalidadLabel = modalidad === "virtual" ? "virtual" : "presencial";
  const text = `Hola! Quiero pre-reservar el programa "${nombre}" en modalidad ${modalidadLabel}. Me interesa conocer fechas, cupos y detalles. Gracias!`;
  return `${WHATSAPP_DIRECT_URL}?text=${encodeURIComponent(text)}`;
}

export function PreReservaButton({
  programaNombre,
  modalidad,
  location,
  size = "lg",
  variant = "default",
  className,
  fullWidth = false,
  compact = false,
}: PreReservaButtonProps) {
  const label = compact
    ? modalidad === "virtual"
      ? "Reserva virtual"
      : "Reserva presencial"
    : modalidad === "virtual"
      ? "Pre-reserva virtual"
      : "Pre-reserva presencial";

  const buttonSize = compact ? "sm" : size === "sm" ? "sm" : size === "lg" ? "lg" : "default";

  return (
    <Button
      size={buttonSize}
      variant={variant}
      className={cn(
        !compact && size !== "sm" && "min-h-[48px]",
        (fullWidth || compact) && "w-full max-w-full",
        compact && "text-xs",
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
      <MessageCircle className={cn("shrink-0", compact ? "h-3.5 w-3.5 mr-1.5" : "h-4 w-4 mr-2")} strokeWidth={1.75} />
      <span className="truncate">{label}</span>
    </Button>
  );
}

export function PreReservaDualButtons({
  programaNombre,
  location,
  className,
  compact = false,
}: {
  programaNombre: string;
  location: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 min-w-0",
        compact ? "flex-col" : "flex-col sm:flex-row sm:gap-3",
        className
      )}
    >
      <PreReservaButton
        programaNombre={programaNombre}
        modalidad="virtual"
        location={location}
        fullWidth
        compact={compact}
      />
      <PreReservaButton
        programaNombre={programaNombre}
        modalidad="presencial"
        location={location}
        variant="outline"
        fullWidth
        compact={compact}
      />
    </div>
  );
}
