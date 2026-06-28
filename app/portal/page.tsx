import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSpeakerPortalById } from "@/lib/notion/portal";
import type { PortalSpeaker, PortalSlot } from "@/lib/notion/portal";
import { CharlaCard } from "@/components/CharlaCard";

const ESTADO_LABELS: Record<string, string> = {
  Aplicado: "En revisión",
  Confirmado: "Confirmado",
  Realizado: "Realizado",
  Bloqueado: "Inactivo",
};

const ESTADO_COLORS: Record<string, string> = {
  Aplicado: "text-yellow-400 border-yellow-900/50 bg-yellow-950/30",
  Confirmado: "text-green-400 border-green-900/50 bg-green-950/30",
  Realizado: "text-blue-400 border-blue-900/50 bg-blue-950/30",
  Bloqueado: "text-zinc-500 border-zinc-800 bg-zinc-950/30",
};

const isConfirmed = (estado: string) =>
  estado === "Confirmado" || estado === "Realizado";

export default async function PortalPage() {
  const session = getSession();
  if (!session) redirect("/login");

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
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-black text-lg tracking-tight hover:opacity-80 transition-opacity">
          AI First <span className="gradient-text">Founders</span>
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
    <section className="border border-border/50 bg-card p-6 space-y-5">
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
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-black tracking-tight">{speaker.nombre}</h1>
            <span className={`text-xs border px-2 py-0.5 ${estadoColor}`}>
              {estadoLabel}
            </span>
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
        <div className="border border-yellow-900/50 bg-yellow-950/20 px-4 py-3">
          <p className="text-sm text-yellow-300/90 leading-relaxed">
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
      <section className="border border-border/50 bg-card p-6 space-y-2">
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
