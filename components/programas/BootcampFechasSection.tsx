import { BootcampFechaCard } from "@/components/programas/BootcampFechaCard";
import type { BootcampFecha } from "@/lib/content/bootcamp";

interface BootcampFechasSectionProps {
  fechas: BootcampFecha[];
}

export function BootcampFechasSection({ fechas }: BootcampFechasSectionProps) {
  if (fechas.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl tracking-tight">Fechas disponibles</h2>
        <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Próximamente publicaremos nuevas fechas. Escríbenos por WhatsApp si quieres ser
            avisado.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-serif text-xl sm:text-2xl tracking-tight">Fechas disponibles</h2>
        <p className="text-sm text-muted-foreground">
          Elige la sesión que prefieras y continúa directo al pago.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fechas.map((fecha) => (
          <BootcampFechaCard
            key={fecha.id}
            fecha={fecha}
            location={`bootcamp_${fecha.modalidad}`}
          />
        ))}
      </div>
    </section>
  );
}
