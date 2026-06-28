"use client";

import { useState } from "react";
import Image from "next/image";
import type { PortalSlot } from "@/lib/notion/portal";

const ESTADO_LABELS: Record<string, string> = {
  Aplicado: "En revisión",
  Confirmado: "Confirmado",
  Realizado: "Realizado",
  Bloqueado: "Inactivo",
};

const ESTADO_COLORS: Record<string, string> = {
  Aplicado: "text-yellow-400 border-yellow-900/50 bg-yellow-950/30",
  Confirmado: "text-green-400 border-green-900/50 bg-green-950/30",
  Realizado: "text-blue-400 border-blue-900/50 bg-blue-950/30",
  Bloqueado: "text-zinc-500 border-zinc-800 bg-zinc-950/30",
};

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const isConfirmed = (estado: string) =>
  estado === "Confirmado" || estado === "Realizado";

export function CharlaCard({
  slot,
  index,
  speakerFoto,
  total,
}: {
  slot: PortalSlot;
  index: number;
  speakerFoto: string | null;
  total: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const estadoLabel = ESTADO_LABELS[slot.estado] ?? slot.estado;
  const estadoColor = ESTADO_COLORS[slot.estado] ?? ESTADO_COLORS.Aplicado;
  const slotConfirmed = isConfirmed(slot.estado);

  return (
    <article className="border border-border/50 bg-card flex flex-col">
      {/* Cover image */}
      {slot.fotos.length > 0 && (
        <div className="relative h-28 overflow-hidden border-b border-border/30 flex-shrink-0">
          <Image
            src={slot.fotos[0]}
            alt={slot.titulo ?? "Evento"}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="p-4 space-y-3 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            {total > 1 && (
              <p className="text-xs font-mono text-muted-foreground/50">
                #{String(index + 1).padStart(2, "0")}
              </p>
            )}
            {slot.titulo ? (
              <p className="font-bold text-xs leading-snug">{slot.titulo}</p>
            ) : (
              <p className="text-xs text-muted-foreground/60 italic">Sin título aún</p>
            )}
          </div>
          <span className={`text-xs border px-1.5 py-0.5 flex-shrink-0 leading-none ${estadoColor}`}>
            {estadoLabel}
          </span>
        </div>

        {/* Description — collapsed: 2 lines, expanded: full */}
        {slot.descripcion && (
          <p
            className={`text-xs text-muted-foreground leading-relaxed ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {slot.descripcion}
          </p>
        )}

        {/* Tools */}
        {slot.herramientas.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {slot.herramientas.map((h) => (
              <span
                key={h}
                className="text-xs border border-border/50 bg-muted/30 px-1.5 py-0.5 text-muted-foreground leading-none"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        {slot.fecha && (
          <div className="border-t border-border/30 pt-3 flex items-start gap-2">
            {speakerFoto && (
              <div className="relative w-6 h-6 flex-shrink-0 overflow-hidden border border-border/40">
                <Image src={speakerFoto} alt="" fill className="object-cover" unoptimized />
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-0.5 leading-none">
                Fecha
              </p>
              <p className="text-xs font-medium capitalize">{formatFecha(slot.fecha)}</p>
              <p className="text-xs text-muted-foreground/50 mt-0.5">Lima (PET, UTC-5)</p>
            </div>
          </div>
        )}

        {/* Expanded content */}
        {expanded && (
          <div className="border-t border-border/30 pt-3 space-y-3">
            {/* URLs */}
            <div className="space-y-2">
              {slot.lumaUrl && (
                <div>
                  <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-1">
                    Evento
                  </p>
                  <a
                    href={slot.lumaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline underline-offset-4 break-all"
                  >
                    {slot.lumaUrl}
                  </a>
                </div>
              )}
              {slotConfirmed && slot.webinarUrl && (
                <div>
                  <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-1">
                    Meet / Webinar
                  </p>
                  <a
                    href={slot.webinarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline underline-offset-4 break-all"
                  >
                    {slot.webinarUrl}
                  </a>
                </div>
              )}
            </div>

            {/* Placeholder sections for future content */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                Próximamente
              </p>
              {[
                "Grabación del evento",
                "Materiales y slides",
                "Notas del organizador",
              ].map((item) => (
                <div
                  key={item}
                  className="border border-dashed border-border/30 px-3 py-2 text-xs text-muted-foreground/40"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* All event photos */}
            {slot.fotos.length > 1 && (
              <div>
                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-2">
                  Fotos del evento
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {slot.fotos.slice(1).map((foto, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden border border-border/30"
                    >
                      <Image src={foto} alt="" fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer: action buttons + Ver más */}
        <div className="flex items-center gap-2 border-t border-border/30 pt-3 mt-auto flex-wrap">
          {slot.lumaUrl && !expanded && (
            <a
              href={slot.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs border border-primary/40 bg-primary/10 text-primary px-2.5 py-1 hover:bg-primary/20 transition-colors"
            >
              Luma
            </a>
          )}
          {slotConfirmed && slot.webinarUrl && !expanded && (
            <a
              href={slot.webinarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs border border-border/50 px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              Meet
            </a>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-auto text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
        </div>
      </div>
    </article>
  );
}
