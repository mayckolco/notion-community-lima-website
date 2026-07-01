import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSpeakerPortalById } from "@/lib/notion/portal";
import { listAllSlotsAdmin } from "@/lib/notion/admin";
import { getSpeakerEtiqueta, ADMIN_SPEAKER_ID } from "@/lib/config/roles";
import type { AdminSlot, AdminSpeaker, SpeakerEtiqueta } from "@/lib/schemas";

const ESTADO_COLORS: Record<string, string> = {
  Disponible: "text-zinc-400 border-zinc-700 bg-zinc-900/50",
  Reservado: "text-yellow-400 border-yellow-900/50 bg-yellow-950/30",
  Confirmado: "text-green-400 border-green-900/50 bg-green-950/30",
  Bloqueado: "text-zinc-500 border-zinc-800 bg-zinc-950",
  Publicado: "text-blue-400 border-blue-900/50 bg-blue-950/30",
  "En promoción": "text-orange-400 border-orange-500/60 bg-orange-950/30",
};

const ETIQUETA_COLORS: Record<SpeakerEtiqueta, string> = {
  speaker: "text-blue-400 border-blue-900/50 bg-blue-950/30",
  admin: "text-orange-400 border-orange-500/60 bg-orange-950/30",
  colaborador: "text-purple-400 border-purple-900/50 bg-purple-950/30",
};

function formatFecha(fecha: string | null): string {
  if (!fecha) return "Sin fecha";
  const dateStr = fecha.split("T")[0];
  const [year, month, day] = dateStr.split("-");
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

const ADMIN_ESTADOS = ["Disponible", "Reservado", "Confirmado", "En promoción", "Publicado", "Bloqueado"] as const;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { estado?: string };
}) {
  const session = getSession();
  if (!session) redirect("/login");

  const etiqueta = getSpeakerEtiqueta(session.email);
  if (etiqueta !== "admin" && etiqueta !== "colaborador") redirect("/portal");

  const speaker =
    session.speakerId !== ADMIN_SPEAKER_ID
      ? await getSpeakerPortalById(session.speakerId)
      : null;
  const displayName = speaker?.nombre ?? session.email.split("@")[0];

  const isAdmin = etiqueta === "admin";
  const allSlots = await listAllSlotsAdmin(isAdmin ? undefined : "En promoción");

  const estadoFilter = searchParams.estado ?? "";
  const slots = estadoFilter
    ? allSlots.filter((s) => s.estado === estadoFilter)
    : allSlots;

  const total = allSlots.length;
  const publicados = allSlots.filter((s) => s.estado === "Publicado").length;
  const confirmados = allSlots.filter((s) =>
    ["Confirmado", "Cover lista", "Copys listos", "En promoción"].includes(s.estado)
  ).length;
  const enPromocion = allSlots.filter((s) => s.estado === "En promoción").length;
  const disponibles = allSlots.filter((s) => s.estado === "Disponible").length;

  return (
    <main className="min-h-screen bg-background">
      <AdminNav nombre={displayName} etiqueta={etiqueta} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              {isAdmin ? "Panel de administración" : "Webinars en promoción"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isAdmin
                ? "Vista general de todos los webinars"
                : "Webinars actualmente en etapa de promoción"}
            </p>
          </div>
          <Link
            href="/portal"
            className="text-xs border border-border/50 px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-border transition-colors flex-shrink-0"
          >
            ← Mi portal
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={total} />
          {isAdmin ? (
            <>
              <StatCard label="Publicados" value={publicados} accent="blue" />
              <StatCard label="Confirmados" value={confirmados} accent="green" />
              <StatCard label="Disponibles" value={disponibles} />
            </>
          ) : (
            <>
              <StatCard label="En promoción" value={enPromocion} accent="orange" />
              <StatCard label="Confirmados" value={confirmados} accent="green" />
              <StatCard label="Publicados" value={publicados} accent="blue" />
            </>
          )}
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/30 pb-3">
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              {estadoFilter ? `${estadoFilter} (${slots.length})` : `Todos los webinars (${total})`}
            </h2>
            {isAdmin && (
              <EstadoFilter current={estadoFilter} />
            )}
          </div>

          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No hay webinars con este estado.</p>
          ) : (
            <div className="space-y-2">
              {slots.map((slot) => (
                <Link key={slot.id} href={`/portal/charla/${slot.id}`} className="block group">
                  <WebinarRow slot={slot} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function EstadoFilter({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-end">
      <Link
        href="/portal/admin"
        className={`text-xs px-2.5 py-1 border transition-colors ${
          !current
            ? "border-orange-500/60 text-orange-400 bg-orange-950/30"
            : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
        }`}
      >
        Todos
      </Link>
      {ADMIN_ESTADOS.map((estado) => (
        <Link
          key={estado}
          href={`/portal/admin?estado=${encodeURIComponent(estado)}`}
          className={`text-xs px-2.5 py-1 border transition-colors ${
            current === estado
              ? `${ESTADO_COLORS[estado]} border-current`
              : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
          }`}
        >
          {estado}
        </Link>
      ))}
    </div>
  );
}

function AdminNav({ nombre, etiqueta }: { nombre: string; etiqueta: SpeakerEtiqueta }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-black text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            AI First <span className="gradient-text">Founders</span>
          </Link>
          <span className={`text-xs border px-2 py-0.5 ${ETIQUETA_COLORS[etiqueta]}`}>
            {etiqueta}
          </span>
        </div>
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

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "blue" | "green" | "orange" | "purple";
}) {
  const valueClass =
    accent === "blue"
      ? "text-blue-400"
      : accent === "green"
      ? "text-green-400"
      : accent === "orange"
      ? "text-orange-400"
      : "text-foreground";

  return (
    <div className="border border-border/50 bg-card p-4 space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-black ${valueClass}`}>{value}</p>
    </div>
  );
}

function WebinarRow({ slot }: { slot: AdminSlot }) {
  const estadoColor = ESTADO_COLORS[slot.estado] ?? ESTADO_COLORS.Disponible;
  const isPast = slot.fecha ? new Date(slot.fecha) < new Date() : false;

  return (
    <div
      className={`border border-border/50 bg-card px-4 py-3 flex items-center gap-4 group-hover:border-orange-500/40 group-hover:bg-orange-950/10 transition-colors ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <div className="w-28 flex-shrink-0">
        <p className="text-xs text-muted-foreground">{formatFecha(slot.fecha)}</p>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${!slot.titulo ? "text-muted-foreground italic" : ""}`}>
          {slot.titulo ?? "Sin título"}
        </p>
      </div>

      <div className="flex-shrink-0">
        <span className={`text-xs border px-2 py-0.5 ${estadoColor}`}>{slot.estado}</span>
      </div>

      <div className="w-48 flex-shrink-0">
        {slot.speaker ? (
          <SpeakerChip speaker={slot.speaker} />
        ) : (
          <p className="text-xs text-muted-foreground italic">Sin speaker</p>
        )}
      </div>

      <div className="w-24 flex-shrink-0 text-right">
        <p className="text-xs text-muted-foreground">
          {slot.registrados ?? 0} / {slot.asistentes ?? 0}
        </p>
        <p className="text-xs text-muted-foreground/60">
          {slot.registrados && slot.asistentes
            ? `${Math.round((slot.asistentes / slot.registrados) * 100)}%`
            : "0%"}
        </p>
      </div>
    </div>
  );
}

function SpeakerChip({ speaker }: { speaker: AdminSpeaker }) {
  const etiquetaColor = ETIQUETA_COLORS[speaker.etiqueta];

  return (
    <div className="flex items-center gap-2">
      {speaker.foto && (
        <div className="relative w-6 h-6 flex-shrink-0 overflow-hidden border border-border/50">
          <Image
            src={speaker.foto}
            alt={speaker.nombre}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{speaker.nombre}</p>
        <span className={`text-xs border px-1.5 py-0 ${etiquetaColor}`}>
          {speaker.etiqueta}
        </span>
      </div>
    </div>
  );
}
