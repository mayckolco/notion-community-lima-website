import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSlot } from "@/lib/notion/slots";
import { SpeakerForm } from "@/components/SpeakerForm";
import { formatSlotDate } from "@/lib/dates";
import { auth } from "@/auth";

interface PageProps {
  params: { slotId: string };
}

export default async function SlotFormPage({ params }: PageProps) {
  const [slot, session] = await Promise.all([
    getSlot(params.slotId),
    auth(),
  ]);

  if (!slot) notFound();
  if (slot.estado !== "Disponible") redirect("/postular");

  const slotLabel = formatSlotDate(slot.fecha);

  const linkedinPrefill = session?.user
    ? {
        nombre: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
        headline: (session.user as Record<string, unknown>).headline as string | null ?? null,
      }
    : null;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link
            href="/postular"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a las fechas
          </Link>

          <h1 className="text-3xl font-black tracking-tight">
            Postula como <span className="text-primary">speaker</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Completa el formulario y confirmaremos tu lugar automáticamente.
          </p>
        </div>

        <SpeakerForm
          slotId={params.slotId}
          slotLabel={slotLabel}
          linkedinPrefill={linkedinPrefill}
        />
      </div>
    </main>
  );
}
