"use client";

import Image from "next/image";
import Link from "next/link";
import type { PortalSlot } from "@/lib/notion/portal";

const ESTADO_LABELS: Record<string, string> = {
  Aplicado: "En revisión",
  Confirmado: "Confirmado",
  Publicado: "Publicado",
  Bloqueado: "Inactivo",
};

const ESTADO_COLORS: Record<string, string> = {
  Aplicado: "text-amber-700 border-amber-200 bg-amber-50",
  Confirmado: "text-emerald-700 border-emerald-200 bg-emerald-50",
  Publicado: "text-sky-700 border-sky-200 bg-sky-50",
  Bloqueado: "text-muted-foreground border-border bg-muted",
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
    <article className="group rounded-xl border border-border bg-card flex flex-col shadow-soft transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5">
      {slot.fotos.length > 0 && (
        <div className="relative h-28 overflow-hidden rounded-t-xl border-b border-border flex-shrink-0 transition-colors">
          <Image
            src={slot.fotos[0]}
            alt={slot.titulo ?? "Evento"}
            fill
            className="object-cover transition-all duration-200 group-hover:brightness-95"
            unoptimized
          />
        </div>
      )}

      <div className="p-4 space-y-3 flex flex-col flex-1">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            {total > 1 ? (
              <p className="text-xs font-mono text-muted-foreground/50">
                #{String(index + 1).padStart(2, "0")}
              </p>
            ) : <span />}
            <span className={`text-xs border rounded-full px-2 py-0.5 flex-shrink-0 leading-none ${estadoColor}`}>
              {estadoLabel}
            </span>
          </div>
          {slot.titulo ? (
            <p className="font-serif text-sm leading-snug transition-colors group-hover:text-primary">
              {slot.titulo}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground italic">Sin título aún</p>
          )}
        </div>

        {slot.descripcion && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {slot.descripcion}
          </p>
        )}

        {slot.herramientas.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {slot.herramientas.map((h) => (
              <span
                key={h}
                className="text-xs rounded-full border border-border bg-background px-2 py-0.5 text-muted-foreground leading-none"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {slot.fecha && (
          <div className="border-t border-border pt-3 flex items-start gap-2">
            {speakerFoto && (
              <div className="relative w-6 h-6 flex-shrink-0 overflow-hidden rounded-full border border-border">
                <Image src={speakerFoto} alt="" fill className="object-cover" unoptimized />
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5 leading-none">
                Fecha
              </p>
              <p className="text-xs font-medium capitalize">
                {formatFecha(slot.fecha)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Lima (PET, UTC-5)</p>
            </div>
          </div>
        )}

        <div className="flex justify-center border-t border-border pt-3 mt-auto">
          <Link
            href={`/portal/charla/${slot.id}`}
            className="text-xs rounded-md border border-primary/40 bg-primary/10 text-primary px-4 py-1.5 hover:bg-primary/15 hover:border-primary/60 transition-colors"
          >
            Ver más
          </Link>
        </div>
      </div>
    </article>
  );
}
