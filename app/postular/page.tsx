import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SlotCard } from "@/components/SlotCard";
import { listSlots } from "@/lib/notion/slots";
import type { Slot } from "@/lib/schemas";

export const revalidate = 60;

async function getSlots(): Promise<Slot[]> {
  try {
    return await listSlots();
  } catch (err) {
    console.error("[/postular] listSlots failed:", err);
    return [];
  }
}

export default async function PostularPage() {
  const slots = await getSlots();

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <h1 className="text-4xl font-black tracking-tight">
            Elige tu <span className="text-primary">martes</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Estos son los próximos 8 martes disponibles. Selecciona el que mejor te quede
            para dar tu charla de 7–8 pm.
          </p>
        </div>

        {slots.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card p-12 text-center space-y-3">
            <p className="text-lg font-semibold">No hay slots disponibles en este momento</p>
            <p className="text-sm text-muted-foreground">
              Vuelve pronto o escríbenos para más información.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {slots.map((slot, index) => (
              <SlotCard key={slot.id} slot={slot} weekNumber={index + 1} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
