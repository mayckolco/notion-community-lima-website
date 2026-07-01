import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSpeakerPortalById, fetchSlot } from "@/lib/notion/portal";
import { getSpeakerEtiqueta, ADMIN_SPEAKER_ID } from "@/lib/config/roles";
import { CoversGallery } from "@/components/CoversGallery";
import { CopyButton } from "@/components/CopyButton";
import { GrabacionEditor } from "@/components/GrabacionEditor";

function formatFecha(fecha: string): string {
  // Notion date-only strings (YYYY-MM-DD) are parsed as UTC midnight, which shifts
  // the day back 1 when converted to Lima (UTC-5). Treat them as Lima midnight instead.
  const d = fecha.includes("T") ? new Date(fecha) : new Date(fecha + "T00:00:00-05:00");
  return d.toLocaleString("es-PE", {
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
  Publicado: "Publicado",
  Bloqueado: "Inactivo",
};

const ESTADO_COLORS: Record<string, string> = {
  Aplicado: "text-yellow-400 border-yellow-900/50 bg-yellow-950/30",
  Confirmado: "text-green-400 border-green-900/50 bg-green-950/30",
  Publicado: "text-blue-400 border-blue-900/50 bg-blue-950/30",
  Bloqueado: "text-zinc-500 border-zinc-800 bg-zinc-950/30",
};

const isConfirmed = (estado: string) =>
  estado === "Confirmado" || estado === "Publicado";

export default async function CharlaDetailPage({
  params,
}: {
  params: { slotId: string };
}) {
  const session = getSession();
  if (!session) redirect("/login");

  const etiqueta = getSpeakerEtiqueta(session.email);
  const isPrivileged = etiqueta === "admin" || etiqueta === "colaborador";

  const speaker =
    session.speakerId !== ADMIN_SPEAKER_ID
      ? await getSpeakerPortalById(session.speakerId)
      : null;

  if (!isPrivileged && !speaker) redirect("/login?error=no_encontrado");

  if (!isPrivileged) {
    const slotBelongs = speaker!.slots.some(
      (s) => s.id.replace(/-/g, "") === params.slotId.replace(/-/g, "")
    );
    if (!slotBelongs) notFound();
  }

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
            href={isPrivileged ? "/portal/admin" : "/portal"}
            className="text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 transition-colors"
          >
            {isPrivileged ? "Volver al panel" : "Volver al portal"}
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
              {(slot.speakerFoto ?? speaker?.foto) && (
                <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden border border-border/40">
                  <Image
                    src={(slot.speakerFoto ?? speaker?.foto)!}
                    alt={slot.speakerNombre ?? speaker?.nombre ?? "Speaker"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="space-y-0.5">
                <p className="font-medium capitalize text-sm">{formatFecha(slot.fecha)}</p>
                <p className="text-xs text-muted-foreground/60">Lima (PET, UTC-5)</p>
              </div>
            </div>
          )}

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {/* Luma */}
            {isPrivileged ? (
              <GrabacionEditor slotId={slot.id} initialUrl={slot.lumaUrl} label="Evento (Luma)" endpoint="luma" />
            ) : (
              <div className="border border-border/30 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground/40">Evento (Luma)</p>
                {slot.lumaUrl ? (
                  <a href={slot.lumaUrl} target="_blank" rel="noopener noreferrer"
                     className="inline-block text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 transition-colors">
                    Abrir
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground/30">Enlace pendiente</p>
                )}
              </div>
            )}

            {/* Meet */}
            {isPrivileged ? (
              <GrabacionEditor slotId={slot.id} initialUrl={slot.webinarUrl} label="Meet" endpoint="meet" />
            ) : (
              <div className="border border-border/30 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground/40">Meet</p>
                {slotConfirmed && slot.webinarUrl ? (
                  <a href={slot.webinarUrl} target="_blank" rel="noopener noreferrer"
                     className="inline-block text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 transition-colors">
                    Abrir
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground/30">Disponible al confirmar</p>
                )}
              </div>
            )}

            {/* Grabación */}
            {isPrivileged ? (
              <GrabacionEditor slotId={slot.id} initialUrl={slot.grabacionUrl} label="Grabación" endpoint="grabacion" />
            ) : (
              <div className="border border-border/30 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground/40">Grabación</p>
                {slot.grabacionUrl ? (
                  <a href={slot.grabacionUrl} target="_blank" rel="noopener noreferrer"
                     className="inline-block text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 transition-colors">
                    Abrir
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground/30">Disponible tras el evento</p>
                )}
              </div>
            )}

            {/* LinkedIn */}
            {isPrivileged ? (
              <GrabacionEditor slotId={slot.id} initialUrl={slot.linkedinUrl} label="LinkedIn" endpoint="linkedin" />
            ) : (
              <div className="border border-border/30 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground/40">LinkedIn</p>
                {slot.linkedinUrl ? (
                  <a href={slot.linkedinUrl} target="_blank" rel="noopener noreferrer"
                     className="inline-block text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 transition-colors">
                    Abrir
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground/30">Sin URL aún</p>
                )}
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

        {/* Copy de LinkedIn */}
        {slot.linkedinCopy && (
          <div className="border border-border/50 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                LinkedIn
              </h2>
              <CopyButton text={slot.linkedinCopy} />
            </div>
            <p className="text-xs text-muted-foreground/50 italic">
              (úsalo como referencia y no olvides etiquetarnos)
            </p>
            <pre className="text-xs text-muted-foreground/70 whitespace-pre-wrap leading-relaxed font-sans bg-muted/20 border border-border/30 p-4">
              {slot.linkedinCopy}
            </pre>
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

        {/* Estadísticas del evento */}
        <div className="border border-border/50 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/30 pb-3">
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Estadísticas del evento
            </h2>
            <span className="text-xs text-muted-foreground/30 border border-dashed border-border/30 px-2 py-0.5">
              Post-evento
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Registrados */}
            <div className="border border-border/30 p-4 space-y-1">
              <p className="text-xs text-muted-foreground/50 uppercase tracking-wider">Registrados</p>
              {slot.registrados !== null ? (
                <p className="text-2xl font-black">{slot.registrados}</p>
              ) : (
                <p className="text-lg font-black text-muted-foreground/20">—</p>
              )}
              <p className="text-xs text-muted-foreground/30">en Luma</p>
            </div>

            {/* Asistentes */}
            <div className="border border-border/30 p-4 space-y-1">
              <p className="text-xs text-muted-foreground/50 uppercase tracking-wider">Asistentes</p>
              {slot.asistentes !== null ? (
                <p className="text-2xl font-black">{slot.asistentes}</p>
              ) : (
                <p className="text-lg font-black text-muted-foreground/20">—</p>
              )}
              <p className="text-xs text-muted-foreground/30">en vivo</p>
            </div>

            {/* Tasa de asistencia */}
            <div className="border border-border/30 p-4 space-y-1">
              <p className="text-xs text-muted-foreground/50 uppercase tracking-wider">Tasa</p>
              {slot.tasaAsistencia !== null ? (
                <p className="text-2xl font-black text-orange-400">
                  {Math.round(slot.tasaAsistencia * 100)}%
                </p>
              ) : (
                <p className="text-lg font-black text-muted-foreground/20">—</p>
              )}
              <p className="text-xs text-muted-foreground/30">de asistencia</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
