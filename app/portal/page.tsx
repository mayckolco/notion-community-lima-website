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

  const confirmedSlots = speaker.slots.filter((s) => isConfirmed(s.estado));
  const hasConfirmed = confirmedSlots.length > 0 || isConfirmed(speaker.estado);
  const nextConfirmedSlot = confirmedSlots[0] ?? null;

  return (
    <main className="min-h-screen bg-background">
      <PortalNav nombre={speaker.nombre} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <SpeakerHeader speaker={speaker} />
        <CharlaCards slots={speaker.slots} speaker={speaker} />
        <ChecklistSection confirmed={hasConfirmed} />
        {hasConfirmed && <KitSection slots={confirmedSlots} />}
        <RecursosSection />
        {nextConfirmedSlot && <DiaEventoSection slot={nextConfirmedSlot} />}
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


function ChecklistSection({ confirmed }: { confirmed: boolean }) {
  const items = [
    { text: "Confirmar tu bio y foto de perfil", done: true },
    { text: "Tener el tema de tu charla listo", done: true },
    { text: "Probar audio y video antes del evento", done: false },
    ...(confirmed
      ? [
          { text: "Compartir el kit de difusión en tus redes", done: false },
          { text: "Unirte 10 min antes para prueba técnica", done: false },
        ]
      : []),
  ];

  return (
    <section className="border border-border/50 bg-card p-6 space-y-4">
      <SectionTitle>Checklist de preparación</SectionTitle>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span
              className={`mt-0.5 flex-shrink-0 w-4 h-4 border flex items-center justify-center text-xs ${
                item.done
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 text-muted-foreground"
              }`}
            >
              {item.done ? "✓" : "·"}
            </span>
            <span className={item.done ? "text-muted-foreground line-through" : "text-muted-foreground"}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function KitSection({ slots }: { slots: PortalSlot[] }) {
  const slot = slots[0] ?? null;
  const tema = slot?.titulo ?? "[tema]";
  const lumaLink = slot?.lumaUrl ?? "[link Luma]";

  const copys = [
    {
      label: "Post para LinkedIn / redes",
      text: `El martes que viene daré una charla en la comunidad AI First Founders sobre ${tema}. Si quieres aprender cómo uso IA para lograrlo, únete: ${lumaLink}`,
    },
    {
      label: "Story corta",
      text: `Hablo el martes en @AIFirstFounders sobre ${tema}. Link en bio.`,
    },
  ];

  return (
    <section className="border border-border/50 bg-card p-6 space-y-5">
      <SectionTitle>Kit de difusión</SectionTitle>
      <p className="text-sm text-muted-foreground">
        Comparte tu charla antes del evento para llegar a más personas.
      </p>
      <div className="space-y-4">
        {copys.map((c) => (
          <div key={c.label} className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
            <div className="border border-border/40 bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground leading-relaxed italic">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground border-t border-border/30 pt-4">
        Los covers descargables serán compartidos por el equipo AIFF al confirmar tu slot.
      </p>
    </section>
  );
}

function RecursosSection() {
  const links = [
    { label: "Comunidad WhatsApp", href: "https://chat.whatsapp.com/CmU70iqgxWKBlFjKp37XLe", desc: "Grupo principal AIFF" },
    { label: "Skool — Aprende", href: "https://www.skool.com/ai-first-founders-8064/about", desc: "Recursos y comunidad" },
    { label: "Calendario de eventos", href: "/calendario", desc: "Próximos slots disponibles", internal: true },
    { label: "Aplicar a otra charla", href: "/aplicar", desc: "Postula a un nuevo slot", internal: true },
  ];

  return (
    <section className="border border-border/50 bg-card p-6 space-y-4">
      <SectionTitle>Recursos AIFF</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((l) =>
          l.internal ? (
            <Link
              key={l.label}
              href={l.href}
              className="border border-border/40 p-4 hover:border-border transition-colors group"
            >
              <p className="text-sm font-medium group-hover:text-foreground text-muted-foreground">{l.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">{l.desc}</p>
            </Link>
          ) : (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border/40 p-4 hover:border-border transition-colors group"
            >
              <p className="text-sm font-medium group-hover:text-foreground text-muted-foreground">{l.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">{l.desc}</p>
            </a>
          )
        )}
      </div>
    </section>
  );
}

function DiaEventoSection({ slot }: { slot: PortalSlot }) {
  const estructura = [
    { tiempo: "0–5 min", actividad: "Apertura y bienvenida por el equipo AIFF" },
    { tiempo: "5–40 min", actividad: "Tu charla" },
    { tiempo: "40–55 min", actividad: "Q&A con los asistentes" },
    { tiempo: "55–60 min", actividad: "Foto grupal y cierre" },
  ];

  return (
    <section className="border border-border/50 bg-card p-6 space-y-5">
      <SectionTitle>Día del evento</SectionTitle>
      <div className="space-y-2">
        {estructura.map((e) => (
          <div key={e.tiempo} className="flex gap-4 text-sm">
            <span className="text-muted-foreground/60 font-mono flex-shrink-0 w-20">{e.tiempo}</span>
            <span className="text-muted-foreground">{e.actividad}</span>
          </div>
        ))}
      </div>
      {slot.webinarUrl && (
        <div className="border-t border-border/30 pt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Link de acceso</p>
          <a
            href={slot.webinarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline underline-offset-4 break-all"
          >
            {slot.webinarUrl}
          </a>
        </div>
      )}
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
