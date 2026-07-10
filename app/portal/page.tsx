import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSpeakerPortalById } from "@/lib/notion/portal";
import { ADMIN_SPEAKER_ID } from "@/lib/config/roles";
import type { PortalSpeaker, PortalSlot } from "@/lib/notion/portal";
import { CharlaCard } from "@/components/CharlaCard";

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

const isConfirmed = (estado: string) =>
  estado === "Confirmado" || estado === "Publicado";

export default async function PortalPage() {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.speakerId === ADMIN_SPEAKER_ID) redirect("/portal/admin");

  const speaker = await getSpeakerPortalById(session.speakerId);
  if (!speaker) redirect("/login?error=no_encontrado");

  return (
    <main className="min-h-screen bg-background">
      <PortalNav nombre={speaker.nombre} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <SpeakerHeader speaker={speaker} />
        <CharlaCards slots={speaker.slots} speaker={speaker} />
      </div>
    </main>
  );
}

function PortalNav({ nombre }: { nombre: string }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap">
          Claude<span className="ml-0.5 text-muted-foreground">Perú</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-muted-foreground">
            {nombre.split(" ")[0]}
          </span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-xs text-muted-foreground border border-border/50 px-3 py-1.5 hover:text-foreground hover:border-border transition-colors"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

function SpeakerHeader({ speaker }: { speaker: PortalSpeaker }) {
  const estadoLabel = ESTADO_LABELS[speaker.estado] ?? speaker.estado;
  const estadoColor = ESTADO_COLORS[speaker.estado] ?? ESTADO_COLORS.Aplicado;
  const primerNombre = speaker.nombre.split(" ")[0];

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-5">
      <div className="flex items-start gap-4">
        {speaker.foto && (
          <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden border border-border/50">
            <Image
              src={speaker.foto}
              alt={speaker.nombre}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-xl tracking-tight">{speaker.nombre}</h1>
              <span className={`text-xs border rounded-full px-2 py-0.5 ${estadoColor}`}>
                {estadoLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/aplicar"
                className="text-xs font-medium rounded-md border border-primary/40 text-primary hover:bg-primary/10 px-3 py-1.5 transition-colors"
              >
                Propón un tema
              </Link>
              <a
                href="https://calendar.notion.so/meet/mayckolco/speakers-aiff"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium rounded-md bg-primary text-primary-foreground px-3 py-1.5 shadow-clay hover:opacity-90 transition-opacity"
              >
                Agendar llamada
              </a>
            </div>
          </div>
          {(speaker.rol || speaker.empresa) && (
            <p className="text-sm text-muted-foreground">
              {[speaker.rol, speaker.empresa].filter(Boolean).join(" · ")}
            </p>
          )}
          {speaker.linkedin && (
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline underline-offset-4"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {speaker.biografia && (
        <div className="border-t border-border/30 pt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sobre ti</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{speaker.biografia}</p>
        </div>
      )}

      {!isConfirmed(speaker.estado) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800 leading-relaxed">
            Hola {primerNombre}, tu aplicación está en revisión. Te avisaremos cuando tu charla sea confirmada y tendrás acceso completo al kit de speaker.
          </p>
        </div>
      )}
    </section>
  );
}

function CharlaCards({ slots, speaker }: { slots: PortalSlot[]; speaker: PortalSpeaker }) {
  if (slots.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-2">
        <SectionTitle>Tu charla</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Aún no tienes un slot asignado. Te notificaremos cuando tu charla sea programada.
        </p>
      </section>
    );
  }

  const titulo = slots.length === 1 ? "Tu charla" : `Tus charlas (${slots.length})`;

  return (
    <section className="space-y-4">
      <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium border-b border-border/30 pb-3">
        {titulo}
      </h2>
      <div className={slots.length >= 2 ? "grid gap-4 grid-cols-2 lg:grid-cols-3" : ""}>
        {slots.map((slot, i) => (
          <CharlaCard key={slot.id} slot={slot} index={i} speakerFoto={speaker.foto} total={slots.length} />
        ))}
      </div>
    </section>
  );
}



function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium border-b border-border/30 pb-3">
      {children}
    </h2>
  );
}
