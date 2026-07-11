import { Clock, Lock, MapPin, Monitor } from "lucide-react";
import type { RutaBloqueada } from "@/lib/content/bootcamp";
import { formatBootcampPrecio } from "@/lib/content/bootcamp";

interface RutaBloqueadaCardProps {
  ruta: RutaBloqueada;
}

export function RutaBloqueadaCard({ ruta }: RutaBloqueadaCardProps) {
  return (
    <article className="relative flex flex-col min-w-0 overflow-hidden rounded-2xl border border-border/40 bg-card p-6 sm:p-8 space-y-4 opacity-70">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        <Lock className="h-3 w-3" strokeWidth={1.75} />
        Próximamente
      </span>

      <div className="space-y-2">
        <h3 className="font-serif text-xl sm:text-2xl tracking-tight">{ruta.nombre}</h3>
        <p className="text-sm text-primary font-medium">{ruta.tagline}</p>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {ruta.descripcion}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
          {ruta.duracion}
        </li>
        <li className="flex items-center gap-1.5">
          <Monitor className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
          Virtual {formatBootcampPrecio(ruta.precioReferencial.virtual)}
        </li>
        <li className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
          Presencial {formatBootcampPrecio(ruta.precioReferencial.presencial)}
        </li>
      </ul>

      <ol className="space-y-1 text-xs text-muted-foreground">
        {ruta.pasos.map((paso, i) => (
          <li key={paso}>
            {i + 1}. {paso}
          </li>
        ))}
      </ol>

      <p className="text-[11px] text-muted-foreground/80 italic">
        Precios referenciales — disponible pronto.
      </p>
    </article>
  );
}
