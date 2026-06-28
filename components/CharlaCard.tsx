"use client";

import Image from "next/image";
import Link from "next/link";
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

        {/* Description — 2 lines */}
        {slot.descripcion && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
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

        {/* Footer: quick actions + Ver más */}
        <div className="flex items-center gap-2 border-t border-border/30 pt-3 mt-auto flex-wrap">
          {slot.lumaUrl && (
            <a
              href={slot.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs border border-primary/40 bg-primary/10 text-primary px-2.5 py-1 hover:bg-primary/20 transition-colors"
            >
              Luma
            </a>
          )}
          {slotConfirmed && slot.webinarUrl && (
            <a
              href={slot.webinarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs border border-border/50 px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              Meet
            </a>
          )}
          <Link
            href={`/portal/charla/${slot.id}`}
            className="ml-auto text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Ver más
          </Link>
        </div>
      </div>
    </article>
  );
}
