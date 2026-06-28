import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSpeakerPortalById, fetchSlot } from "@/lib/notion/portal";
import type { PortalSlot, PortalSpeaker } from "@/lib/notion/portal";

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

export default async function CharlaDetailPage({
  params,
}: {
  params: { slotId: string };
}) {
  const session = getSession();
  if (!session) redirect("/login");

  const speaker = await getSpeakerPortalById(session.speakerId);
  if (!speaker) redirect("/login?error=no_encontrado");

  // Verify the slot belongs to this speaker
  const slotBelongs = speaker.slots.some((s) => s.id.replace(/-/g, "") === params.slotId.replace(/-/g, ""));
  if (!slotBelongs) notFound();

  const slot = await fetchSlot(params.slotId);
  if (!slot) notFound();

  const estadoLabel = ESTADO_LABELS[slot.estado] ?? slot.estado;
  const estadoColor = ESTADO_COLORS[slot.estado] ?? ESTADO_COLORS.Aplicado;
  const slotConfirmed = isConfirmed(slot.estado);

  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link
            href="/portal"
            className="text-xs text-muted-foreground border border-border/50 px-3 py-1.5 hover:text-foreground hover:border-border transition-colors"
          >
            Volver al portal
          </Link>
          <span className="text-muted-foreground/30 text-xs">/</span>
          <span className="text-xs text-muted-foreground truncate">
            {slot.titulo ?? "Charla"}
          </span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Cover image */}
        {slot.fotos.length > 0 && (
          <div className="relative h-56 sm:h-72 overflow-hidden border border-border/50">
            <Image
              src={slot.fotos[0]}
              alt={slot.titulo ?? "Evento"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Header */}
        <div className="border border-border/50 bg-card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <h1 className="text-2xl font-black tracking-tight leading-tight">
                {slot.titulo ?? "Sin título aún"}
              </h1>
            </div>
            <span className={`text-xs border px-2 py-0.5 flex-shrink-0 ${estadoColor}`}>
              {estadoLabel}
            </span>
          </div>

          {slot.descripcion && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {slot.descripcion}
            </p>
          )}

          {slot.herramientas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {slot.herramientas.map((h) => (
                <span
                  key={h}
                  className="text-xs border border-border/50 bg-muted/30 px-2 py-0.5 text-muted-foreground"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Fecha y accesos */}
        <div className="border border-border/50 bg-card p-6 space-y-4">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium border-b border-border/30 pb-3">
            Fecha y accesos
          </h2>

          <div className="flex items-start gap-4">
            {speaker.foto && (
              <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden border border-border/40">
                <Image src={speaker.foto} alt={speaker.nombre} fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="space-y-0.5">
              <p className="font-medium capitalize text-sm">
                {slot.fecha ? formatFecha(slot.fecha) : "Fecha por confirmar"}
              </p>
              {slot.fecha && (
                <p className="text-xs text-muted-foreground/60">Lima (PET, UTC-5)</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {slot.lumaUrl ? (
              <a
                href={slot.lumaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-primary/40 bg-primary/10 text-primary p-4 hover:bg-primary/20 transition-colors group block"
              >
                <p className="text-xs uppercase tracking-wider mb-1 text-primary/70">Evento</p>
                <p className="text-sm font-medium">Ver en Luma</p>
                <p className="text-xs text-primary/60 mt-0.5 truncate">{slot.lumaUrl}</p>
              </a>
            ) : (
              <div className="border border-border/30 p-4 text-muted-foreground/40">
                <p className="text-xs uppercase tracking-wider mb-1">Evento</p>
                <p className="text-sm">Enlace pendiente</p>
              </div>
            )}

            {slotConfirmed && slot.webinarUrl ? (
              <a
                href={slot.webinarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border/50 p-4 hover:border-border transition-colors group block"
              >
                <p className="text-xs uppercase tracking-wider mb-1 text-muted-foreground/60">Meet / Webinar</p>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Unirse al meet</p>
                <p className="text-xs text-muted-foreground/50 mt-0.5 truncate">{slot.webinarUrl}</p>
              </a>
            ) : !slotConfirmed ? (
              <div className="border border-border/30 p-4 text-muted-foreground/40">
                <p className="text-xs uppercase tracking-wider mb-1">Meet / Webinar</p>
                <p className="text-sm">Disponible al confirmar</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Fotos adicionales */}
        {slot.fotos.length > 1 && (
          <div className="border border-border/50 bg-card p-6 space-y-4">
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium border-b border-border/30 pb-3">
              Fotos del evento
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {slot.fotos.map((foto, i) => (
                <div key={i} className="relative aspect-square overflow-hidden border border-border/30">
                  <Image src={foto} alt="" fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Próximo contenido */}
        <div className="border border-border/50 bg-card p-6 space-y-4">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium border-b border-border/30 pb-3">
            Contenido del evento
          </h2>
          <div className="space-y-2">
            {[
              { label: "Grabación de la charla", desc: "Video completo disponible después del evento" },
              { label: "Slides y materiales", desc: "Presentación y recursos compartidos" },
              { label: "Notas del organizador", desc: "Feedback y observaciones del equipo AIFF" },
              { label: "Estadísticas de asistencia", desc: "Número de participantes y engagement" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-dashed border-border/30 px-4 py-3 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-muted-foreground/50">{item.label}</p>
                  <p className="text-xs text-muted-foreground/30 mt-0.5">{item.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground/30 flex-shrink-0">Próximamente</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estructura del evento */}
        <div className="border border-border/50 bg-card p-6 space-y-4">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium border-b border-border/30 pb-3">
            Estructura del evento
          </h2>
          <div className="space-y-2">
            {[
              { tiempo: "0–5 min", actividad: "Apertura y bienvenida por el equipo AIFF" },
              { tiempo: "5–40 min", actividad: "Tu charla" },
              { tiempo: "40–55 min", actividad: "Q&A con los asistentes" },
              { tiempo: "55–60 min", actividad: "Foto grupal y cierre" },
            ].map((e) => (
              <div key={e.tiempo} className="flex gap-4 text-sm">
                <span className="text-muted-foreground/60 font-mono flex-shrink-0 w-20">{e.tiempo}</span>
                <span className="text-muted-foreground">{e.actividad}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
