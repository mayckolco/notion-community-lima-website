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
}: PreReservaButtonProps) {
  const label = modalidad === "virtual" ? "Pre-reserva virtual" : "Pre-reserva presencial";

  return (
    <Button
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      variant={variant}
      className={cn(
        size !== "sm" && "min-h-[48px]",
        fullWidth && "w-full",
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
      <MessageCircle className="h-4 w-4 mr-2 shrink-0" strokeWidth={1.75} />
      {label}
    </Button>
  );
}

export function PreReservaDualButtons({
  programaNombre,
  location,
  className,
}: {
  programaNombre: string;
  location: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      <PreReservaButton
        programaNombre={programaNombre}
        modalidad="virtual"
        location={location}
        fullWidth
      />
      <PreReservaButton
        programaNombre={programaNombre}
        modalidad="presencial"
        location={location}
        variant="outline"
        fullWidth
      />
    </div>
  );
}
