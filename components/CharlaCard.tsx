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

  return (
    <article className="group border border-border/40 bg-card flex flex-col transition-colors duration-200 hover:border-orange-500/60 hover:bg-orange-950/20">
      {/* Cover image */}
      {slot.fotos.length > 0 && (
        <div className="relative h-28 overflow-hidden border-b border-border/30 group-hover:border-orange-500/20 flex-shrink-0 transition-colors">
          <Image
            src={slot.fotos[0]}
            alt={slot.titulo ?? "Evento"}
            fill
            className="object-cover transition-all duration-200 group-hover:brightness-90"
            unoptimized
          />
        </div>
      )}

      <div className="p-4 space-y-3 flex flex-col flex-1">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            {total > 1 ? (
              <p className="text-xs font-mono text-muted-foreground/50">
                #{String(index + 1).padStart(2, "0")}
              </p>
            ) : <span />}
            <span className={`text-xs border px-1.5 py-0.5 flex-shrink-0 leading-none ${estadoColor}`}>
              {estadoLabel}
            </span>
          </div>
          {slot.titulo ? (
            <p className="font-bold text-xs leading-snug transition-colors group-hover:text-orange-300">
              {slot.titulo}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic">Sin título aún</p>
          )}
        </div>

        {/* Description — 2 lines */}
        {slot.descripcion && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 transition-colors group-hover:text-muted-foreground/80">
            {slot.descripcion}
          </p>
        )}

        {/* Tools */}
        {slot.herramientas.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {slot.herramientas.map((h) => (
              <span
                key={h}
                className="text-xs border border-border/50 bg-muted/30 px-1.5 py-0.5 text-muted-foreground leading-none transition-colors group-hover:border-orange-500/30 group-hover:text-orange-300/70"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        {slot.fecha && (
          <div className="border-t border-border/30 group-hover:border-orange-500/20 pt-3 flex items-start gap-2 transition-colors">
            {speakerFoto && (
              <div className="relative w-6 h-6 flex-shrink-0 overflow-hidden border border-border/40">
                <Image src={speakerFoto} alt="" fill className="object-cover" unoptimized />
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-0.5 leading-none">
                Fecha
              </p>
              <p className="text-xs font-medium capitalize transition-colors group-hover:text-orange-200/80">
                {formatFecha(slot.fecha)}
              </p>
              <p className="text-xs text-muted-foreground/50 mt-0.5">Lima (PET, UTC-5)</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-center border-t border-border/30 group-hover:border-orange-500/20 pt-3 mt-auto transition-colors">
          <Link
            href={`/portal/charla/${slot.id}`}
            className="text-xs border border-orange-500/50 bg-orange-950/20 text-orange-400 px-4 py-1.5 hover:bg-orange-950/50 hover:border-orange-500 transition-colors"
          >
            Ver más
          </Link>
        </div>
      </div>
    </article>
  );
}
