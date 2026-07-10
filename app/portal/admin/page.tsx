import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSpeakerPortalById } from "@/lib/notion/portal";
import { listAllSlotsAdmin } from "@/lib/notion/admin";
import { getSpeakerEtiqueta, ADMIN_SPEAKER_ID } from "@/lib/config/roles";
import type { AdminSlot, AdminSpeaker, SpeakerEtiqueta } from "@/lib/schemas";

const ESTADO_COLORS: Record<string, string> = {
  Disponible: "text-muted-foreground border-border bg-muted",
  Reservado: "text-amber-700 border-amber-200 bg-amber-50",
  Confirmado: "text-emerald-700 border-emerald-200 bg-emerald-50",
  Bloqueado: "text-muted-foreground border-border bg-muted",
  Publicado: "text-sky-700 border-sky-200 bg-sky-50",
  "En promoción": "text-primary border-primary/20 bg-primary/10",
};

const ETIQUETA_COLORS: Record<SpeakerEtiqueta, string> = {
  speaker: "text-sky-700 border-sky-200 bg-sky-50",
  admin: "text-primary border-primary/20 bg-primary/10",
  colaborador: "text-violet-700 border-violet-200 bg-violet-50",
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
            <h1 className="font-serif text-2xl tracking-tight">
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
            className="text-xs rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0"
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
              <StatCard label="En promoción" value={enPromocion} accent="primary" />
              <StatCard label="Confirmados" value={confirmados} accent="green" />
              <StatCard label="Publicados" value={publicados} accent="blue" />
            </>
          )}
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
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
        className={`text-xs rounded-md px-2.5 py-1 border transition-colors ${
          !current
            ? "border-primary/40 text-primary bg-primary/10"
            : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        Todos
      </Link>
      {ADMIN_ESTADOS.map((estado) => (
        <Link
          key={estado}
          href={`/portal/admin?estado=${encodeURIComponent(estado)}`}
          className={`text-xs rounded-md px-2.5 py-1 border transition-colors ${
            current === estado
              ? `${ESTADO_COLORS[estado]} border-current`
              : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
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
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-serif text-lg tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            Claude<span className="ml-0.5 text-muted-foreground">Perú</span>
          </Link>
          <span className={`text-xs border rounded-full px-2 py-0.5 ${ETIQUETA_COLORS[etiqueta]}`}>
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
              className="text-xs rounded-md text-muted-foreground border border-border px-3 py-1.5 hover:text-foreground hover:bg-accent transition-colors"
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
  accent?: "blue" | "green" | "primary" | "purple";
}) {
  const valueClass =
    accent === "blue"
      ? "text-sky-700"
      : accent === "green"
      ? "text-emerald-700"
      : accent === "primary"
      ? "text-primary"
      : "text-foreground";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className={`font-serif text-2xl ${valueClass}`}>{value}</p>
    </div>
  );
}

function WebinarRow({ slot }: { slot: AdminSlot }) {
  const estadoColor = ESTADO_COLORS[slot.estado] ?? ESTADO_COLORS.Disponible;
  const isPast = slot.fecha ? new Date(slot.fecha) < new Date() : false;

  return (
    <div
      className={`rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-4 group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors ${
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
        <span className={`text-xs border rounded-full px-2 py-0.5 ${estadoColor}`}>{slot.estado}</span>
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
          {slot.asistentes ?? 0} / {slot.registrados ?? 0}
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
        <div className="relative w-6 h-6 flex-shrink-0 overflow-hidden rounded-full border border-border">
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
        <span className={`text-xs border rounded-full px-1.5 py-0 ${etiquetaColor}`}>
          {speaker.etiqueta}
        </span>
      </div>
    </div>
  );
}
