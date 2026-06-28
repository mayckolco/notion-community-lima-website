import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSpeakerPortalById, fetchSlot } from "@/lib/notion/portal";
import { CoversGallery } from "@/components/CoversGallery";

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

  const slotBelongs = speaker.slots.some(
    (s) => s.id.replace(/-/g, "") === params.slotId.replace(/-/g, "")
  );
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
            className="text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 transition-colors"
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
            <h1 className="text-2xl font-black tracking-tight leading-tight">
              {slot.titulo ?? "Sin título aún"}
            </h1>
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

        {/* Estructura del evento — ANTES de accesos */}
        <div className="border border-border/50 bg-card p-6 space-y-4">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium border-b border-border/30 pb-3">
            Estructura del webinar
          </h2>
          <div className="space-y-0">
            {[
              { tiempo: "0–5 min",   actividad: "Apertura y bienvenida",         desc: "El equipo AIFF presenta al speaker y contextualiza el tema." },
              { tiempo: "5–10 min",  actividad: "Intro del speaker",             desc: "Presentación breve: quién eres, qué haces, por qué este tema." },
              { tiempo: "10–40 min", actividad: "Charla principal",              desc: "Tu contenido. Enfocado, con demos o casos reales si aplica." },
              { tiempo: "40–50 min", actividad: "Q&A en vivo",                  desc: "Preguntas del chat moderadas por el equipo." },
              { tiempo: "50–55 min", actividad: "Recursos y próximos pasos",    desc: "Links, herramientas, dónde seguirte y cómo contactarte." },
              { tiempo: "55–60 min", actividad: "Foto grupal y cierre",         desc: "Screenshot de pantalla y despedida del equipo AIFF." },
            ].map((e) => (
              <div key={e.tiempo} className="flex gap-4 py-3 border-b border-border/20 last:border-0">
                <span className="text-muted-foreground/50 font-mono text-xs flex-shrink-0 w-20 pt-0.5">{e.tiempo}</span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{e.actividad}</p>
                  <p className="text-xs text-muted-foreground/50 mt-0.5 leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos (antes: "Fecha y accesos") */}
        <div className="border border-border/50 bg-card p-6 space-y-4">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium border-b border-border/30 pb-3">
            Accesos
          </h2>

          {slot.fecha && (
            <div className="flex items-start gap-4">
              {speaker.foto && (
                <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden border border-border/40">
                  <Image src={speaker.foto} alt={speaker.nombre} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="space-y-0.5">
                <p className="font-medium capitalize text-sm">{formatFecha(slot.fecha)}</p>
                <p className="text-xs text-muted-foreground/60">Lima (PET, UTC-5)</p>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Luma */}
            {slot.lumaUrl ? (
              <a
                href={slot.lumaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border/30 p-4 transition-colors group hover:border-orange-500/50 hover:bg-orange-950/20 block"
              >
                <p className="text-xs uppercase tracking-wider mb-1 text-muted-foreground/40 group-hover:text-orange-500/70 transition-colors">Evento</p>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-orange-300 transition-colors">Ver en Luma</p>
                <p className="text-xs text-muted-foreground/30 mt-0.5 truncate group-hover:text-orange-400/50 transition-colors">{slot.lumaUrl}</p>
              </a>
            ) : (
              <div className="border border-border/30 p-4 text-muted-foreground/30">
                <p className="text-xs uppercase tracking-wider mb-1">Evento</p>
                <p className="text-sm">Enlace pendiente</p>
              </div>
            )}

            {/* Meet */}
            {slotConfirmed && slot.webinarUrl ? (
              <a
                href={slot.webinarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border/30 p-4 transition-colors group hover:border-orange-500/50 hover:bg-orange-950/20 block"
              >
                <p className="text-xs uppercase tracking-wider mb-1 text-muted-foreground/40 group-hover:text-orange-500/70 transition-colors">Meet</p>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-orange-300 transition-colors">Unirse al meet</p>
                <p className="text-xs text-muted-foreground/30 mt-0.5 truncate group-hover:text-orange-400/50 transition-colors">{slot.webinarUrl}</p>
              </a>
            ) : (
              <div className="border border-border/30 p-4 text-muted-foreground/30">
                <p className="text-xs uppercase tracking-wider mb-1">Meet</p>
                <p className="text-sm">Disponible al confirmar</p>
              </div>
            )}

            {/* Grabación */}
            {slot.grabacionUrl ? (
              <a
                href={slot.grabacionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border/30 p-4 transition-colors group hover:border-orange-500/50 hover:bg-orange-950/20 block"
              >
                <p className="text-xs uppercase tracking-wider mb-1 text-muted-foreground/40 group-hover:text-orange-500/70 transition-colors">Grabación</p>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-orange-300 transition-colors">Ver grabación</p>
                <p className="text-xs text-muted-foreground/30 mt-0.5 truncate group-hover:text-orange-400/50 transition-colors">{slot.grabacionUrl}</p>
              </a>
            ) : (
              <div className="border border-border/30 p-4 text-muted-foreground/30">
                <p className="text-xs uppercase tracking-wider mb-1">Grabación</p>
                <p className="text-sm">Disponible tras el evento</p>
              </div>
            )}
          </div>
        </div>

        {/* KIT (antes: "Kit de difusión — Covers") */}
        {slot.covers.length > 0 && (
          <div className="border border-border/50 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Kit
              </h2>
              <span className="text-xs text-muted-foreground/50">{slot.covers.length} covers</span>
            </div>
            <p className="text-xs text-muted-foreground/60">
              Usa estos covers para promocionar tu charla. Haz clic en Vista previa para verlos en grande o Descargar para guardarlos.
            </p>
            <CoversGallery covers={slot.covers} />
          </div>
        )}

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

        {/* Contenido del evento — solo estadísticas + campos futuros en Notion */}
        <div className="border border-border/50 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/30 pb-3">
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Estadísticas del evento
            </h2>
            <span className="text-xs text-muted-foreground/30 border border-dashed border-border/30 px-2 py-0.5">
              Post-evento
            </span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Registrados en Luma",     desc: "Total de personas que se registraron al evento",          notion: "Registrados" },
              { label: "Asistentes en vivo",       desc: "Pico de asistentes simultáneos durante la sesión",        notion: "Asistentes" },
              { label: "Tasa de asistencia",       desc: "% de registrados que asistieron en vivo",                 notion: "Tasa Asistencia" },
              { label: "Preguntas en Q&A",         desc: "Número de preguntas recibidas en el chat",                notion: "Preguntas QA" },
              { label: "Clip destacado",           desc: "Reel o fragmento corto del momento más relevante",        notion: "Clip URL" },
              { label: "Testimonio del speaker",   desc: "Feedback del speaker sobre la experiencia",               notion: "Testimonio" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-dashed border-border/30 px-4 py-3 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-muted-foreground/50">{item.label}</p>
                  <p className="text-xs text-muted-foreground/30 mt-0.5">{item.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground/25 font-mono flex-shrink-0 border border-dashed border-border/20 px-1.5 py-0.5">
                  {item.notion}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/30 border-t border-border/20 pt-3">
            Crear estas propiedades en la base de datos Speaker Slots de Notion para poblarlas tras cada evento.
          </p>
        </div>

      </div>
    </main>
  );
}
