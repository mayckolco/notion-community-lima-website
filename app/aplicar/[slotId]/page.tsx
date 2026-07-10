import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSlot } from "@/lib/notion/slots";
import { SpeakerForm } from "@/components/SpeakerForm";
import { formatSlotDate } from "@/lib/dates";

interface PageProps {
  params: { slotId: string };
}

export default async function SlotFormPage({ params }: PageProps) {
  const slot = await getSlot(params.slotId);

  if (!slot) notFound();
  if (slot.estado !== "Disponible") redirect("/aplicar");

  const slotLabel = formatSlotDate(slot.fecha);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link
            href="/aplicar"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a las fechas
          </Link>

          <h1 className="text-3xl font-serif tracking-tight">
            Aplica como <span className="gradient-text">speaker</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Confirma tu disponibilidad como Speaker. Este formulario toma menos de 2 minutos.
          </p>
        </div>

        <SpeakerForm slotId={params.slotId} slotLabel={slotLabel} />
      </div>
    </main>
  );
}
