import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSpeakerPortalById } from "@/lib/notion/portal";
import { listAllSlotsAdmin, listAllSpeakersAdmin } from "@/lib/notion/admin";
import { getSpeakerEtiqueta, ADMIN_SPEAKER_ID } from "@/lib/config/roles";
import { AdminPanel } from "@/components/admin/AdminPanel";
import type { SpeakerEtiqueta } from "@/lib/schemas";

const ADMIN_ESTADOS = ["Disponible", "Reservado", "Confirmado", "En promoción", "Publicado", "Bloqueado"] as const;

const ESTADO_COLORS: Record<string, string> = {
  Disponible: "text-muted-foreground border-border bg-muted",
  Reservado: "text-amber-700 border-amber-200 bg-amber-50",
  Confirmado: "text-emerald-700 border-emerald-200 bg-emerald-50",
  Bloqueado: "text-muted-foreground border-border bg-muted",
  Publicado: "text-sky-700 border-sky-200 bg-sky-50",
  "En promoción": "text-primary border-primary/20 bg-primary/10",
};

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
  const [allSlots, allSpeakers] = await Promise.all([
    listAllSlotsAdmin(isAdmin ? undefined : "En promoción"),
    isAdmin ? listAllSpeakersAdmin() : Promise.resolve([]),
  ]);

  const estadoFilter = searchParams.estado ?? "";
  const slots = estadoFilter
    ? allSlots.filter((s) => s.estado === estadoFilter)
    : allSlots;

  const total = allSlots.length;
  const publicados = allSlots.filter((s) => s.estado === "Publicado").length;
  const confirmados = allSlots.filter((s) =>
    ["Confirmado", "Cover lista", "Copys listos", "En promocion", "En promoción"].includes(s.estado)
  ).length;
  const enPromocion = allSlots.filter((s) =>
    s.estado === "En promocion" || s.estado === "En promoción"
  ).length;
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
                ? "Vista general de webinars, speakers y accesos rápidos"
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

        {isAdmin && <EstadoFilter current={estadoFilter} />}

        <AdminPanel
          slots={slots}
          speakers={allSpeakers}
          isAdmin={isAdmin}
          estadoFilter={estadoFilter}
        />
      </div>
    </main>
  );
}

function EstadoFilter({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
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
  const etiquetaColors: Record<SpeakerEtiqueta, string> = {
    speaker: "text-sky-700 border-sky-200 bg-sky-50",
    admin: "text-primary border-primary/20 bg-primary/10",
    colaborador: "text-violet-700 border-violet-200 bg-violet-50",
  };

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
          <span className={`text-xs border rounded-full px-2 py-0.5 ${etiquetaColors[etiqueta]}`}>
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
      ? "text-sky-700 dark:text-sky-300"
      : accent === "green"
      ? "text-emerald-700 dark:text-emerald-300"
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
