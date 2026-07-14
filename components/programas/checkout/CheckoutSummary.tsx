import {
  NOTION_BOOTCAMP,
  formatBootcampPrecio,
} from "@/lib/content/bootcamp";
import type { BootcampFecha } from "@/lib/content/bootcamp";

interface CheckoutSummaryProps {
  precio: number;
  fecha: BootcampFecha | null;
  referencia?: string;
}

export function CheckoutSummary({ precio, fecha, referencia }: CheckoutSummaryProps) {
  return (
    <aside className="rounded-2xl border border-border/50 bg-muted/30 p-5 space-y-4 h-fit lg:sticky lg:top-24">
      <h2 className="font-serif text-lg tracking-tight">Resumen</h2>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Curso</p>
          <p className="font-medium">{NOTION_BOOTCAMP.nombre}</p>
        </div>

        {fecha && (
          <div>
            <p className="text-muted-foreground text-xs">Fecha</p>
            <p className="font-medium">{fecha.fechaLabel}</p>
            <p className="text-xs text-muted-foreground">{fecha.horario}</p>
          </div>
        )}

        <div className="border-t border-border/40 pt-3 flex items-end justify-between">
          <p className="text-muted-foreground text-xs">Inversión</p>
          <p className="font-serif text-2xl font-semibold tracking-tight">
            {formatBootcampPrecio(precio)}
          </p>
        </div>

        {referencia && (
          <div>
            <p className="text-muted-foreground text-xs">Referencia</p>
            <p className="font-mono text-sm font-semibold">{referencia}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
