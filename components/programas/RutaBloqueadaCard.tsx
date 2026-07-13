import { Lock, MapPin, Monitor } from "lucide-react";
import type { RutaBloqueada } from "@/lib/content/bootcamp";
import { cn } from "@/lib/utils";

const ACCENT_STYLES = {
  green: {
    dot: "bg-emerald-500",
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/5",
  },
  orange: {
    dot: "bg-primary",
    border: "border-primary/25",
    bg: "bg-primary/5",
  },
  blue: {
    dot: "bg-blue-500",
    border: "border-blue-500/25",
    bg: "bg-blue-500/5",
  },
} as const;

interface RutaBloqueadaCardProps {
  ruta: RutaBloqueada;
}

export function RutaBloqueadaCard({ ruta }: RutaBloqueadaCardProps) {
  const accent = ACCENT_STYLES[ruta.accent];

  return (
    <article
      className={cn(
        "relative flex flex-col min-w-0 overflow-hidden rounded-2xl border p-6 sm:p-7 space-y-4 opacity-90",
        accent.border,
        accent.bg
      )}
    >
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        <Lock className="h-3 w-3" strokeWidth={1.75} />
        Próximamente
      </span>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span
            className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", accent.dot)}
            aria-hidden="true"
          />
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Ruta {ruta.numero}</p>
            <h3 className="font-serif text-lg sm:text-xl tracking-tight leading-tight">
              {ruta.nombre}{" "}
              <span className="text-muted-foreground font-sans text-sm font-normal">
                ({ruta.subtitulo})
              </span>
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{ruta.descripcion}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border/40 bg-background/60 px-3 py-2">
          <Monitor className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
          <span className="font-medium text-foreground">Virtual</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border/40 bg-background/60 px-3 py-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
          <span className="font-medium text-foreground">Presencial</span>
        </div>
      </div>
    </article>
  );
}
