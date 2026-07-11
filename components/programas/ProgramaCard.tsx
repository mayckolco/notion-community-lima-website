import Link from "next/link";
import { ArrowRight, Clock, MapPin, Monitor, Users } from "lucide-react";
import { PreReservaDualButtons } from "@/components/PreReservaButton";
import type { ProgramaBase } from "@/lib/content/programas";
import { formatPrecio, NIVEL_LABELS, PRODUCTO_LABELS } from "@/lib/content/programas";
import { cn } from "@/lib/utils";

interface ProgramaCardProps {
  programa: ProgramaBase;
  href: string;
  location: string;
  showPreReserva?: boolean;
  className?: string;
}

const TIPO_BADGE: Record<ProgramaBase["tipo"], string> = {
  curso: "Curso",
  programa: "Programa",
  ruta: "Ruta",
};

export function ProgramaCard({
  programa,
  href,
  location,
  showPreReserva = true,
  className,
}: ProgramaCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col border border-border/40 bg-card rounded-2xl p-6 sm:p-8 space-y-5 hover:border-primary/30 transition-colors",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-primary/40 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary">
          {TIPO_BADGE[programa.tipo]}
        </span>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {PRODUCTO_LABELS[programa.producto]}
        </span>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Nivel {programa.nivel} · {NIVEL_LABELS[programa.nivel]}
        </span>
      </div>

      <div className="space-y-2 flex-1">
        <h3 className="font-serif text-xl sm:text-2xl tracking-tight">{programa.nombre}</h3>
        <p className="text-sm text-primary font-medium">{programa.tagline}</p>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {programa.descripcion}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
          {programa.duracion}
        </li>
        <li className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
          {programa.cupos} cupos/cohorte
        </li>
        <li className="flex items-center gap-1.5">
          <Monitor className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
          Virtual {formatPrecio(programa.precio.virtual)}
        </li>
        <li className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
          Presencial {formatPrecio(programa.precio.presencial)}
        </li>
      </ul>

      <div className="space-y-3 pt-1">
        {showPreReserva && (
          <PreReservaDualButtons programaNombre={programa.nombre} location={location} />
        )}
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Ver detalle completo
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
    </article>
  );
}

interface RutaStepsProps {
  pasos: { orden: number; cursoSlug: string; titulo: string }[];
}

export function RutaSteps({ pasos }: RutaStepsProps) {
  return (
    <ol className="space-y-3">
      {pasos.map((paso) => (
        <li
          key={paso.orden}
          className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/30 px-4 py-3"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
            {paso.orden}
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="text-sm font-medium text-foreground">{paso.titulo}</p>
            <Link
              href={`/programas/profesionales/${paso.cursoSlug}`}
              className="text-xs text-primary hover:underline"
            >
              Ver curso
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
