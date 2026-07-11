"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ExternalLink, Users, Calendar, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AdminSlot, AdminSpeaker } from "@/lib/schemas";

interface AdminPanelProps {
  slots: AdminSlot[];
  speakers: AdminSpeaker[];
  isAdmin: boolean;
  estadoFilter: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatFecha(fecha: string | null): string {
  if (!fecha) return "Sin fecha";
  const dateStr = fecha.split("T")[0];
  const [year, month, day] = dateStr.split("-");
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

const ESTADO_COLORS: Record<string, string> = {
  Disponible: "text-muted-foreground border-border bg-muted",
  Reservado: "text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-300 dark:border-amber-800 dark:bg-amber-950/40",
  Confirmado: "text-emerald-700 border-emerald-200 bg-emerald-50 dark:text-emerald-300 dark:border-emerald-800 dark:bg-emerald-950/40",
  Bloqueado: "text-muted-foreground border-border bg-muted",
  Publicado: "text-sky-700 border-sky-200 bg-sky-50 dark:text-sky-300 dark:border-sky-800 dark:bg-sky-950/40",
  "En promoción": "text-primary border-primary/20 bg-primary/10",
};

const QUICK_LINKS = [
  { label: "Eventos públicos", href: "/eventos", icon: Calendar },
  { label: "Directorio", href: "/directorio", icon: Users },
  { label: "Aplicar speaker", href: "/aplicar", icon: Mic },
] as const;

export function AdminPanel({ slots, speakers, isAdmin, estadoFilter }: AdminPanelProps) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"webinars" | "speakers">("webinars");

  const filteredSlots = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return slots;
    return slots.filter((slot) => {
      const haystack = normalize(
        [slot.titulo ?? "", slot.speaker?.nombre ?? "", slot.estado, formatFecha(slot.fecha)].join(" ")
      );
      return haystack.includes(q);
    });
  }, [slots, query]);

  const filteredSpeakers = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return speakers;
    return speakers.filter((s) => {
      const haystack = normalize([s.nombre, s.email, s.rol ?? "", s.empresa ?? "", s.etiqueta].join(" "));
      return haystack.includes(q);
    });
  }, [speakers, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            <ExternalLink className="h-3 w-3 opacity-40" />
          </Link>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder={tab === "webinars" ? "Buscar webinars…" : "Buscar speakers…"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Buscar en panel admin"
        />
      </div>

      {isAdmin && (
        <div className="flex gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setTab("webinars")}
            className={`text-xs rounded-md px-3 py-1.5 border transition-colors ${
              tab === "webinars"
                ? "border-primary/40 text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            Webinars ({slots.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("speakers")}
            className={`text-xs rounded-md px-3 py-1.5 border transition-colors ${
              tab === "speakers"
                ? "border-primary/40 text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            Speakers ({speakers.length})
          </button>
        </div>
      )}

      {tab === "webinars" || !isAdmin ? (
        <section className="space-y-4">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            {estadoFilter
              ? `${estadoFilter} (${filteredSlots.length})`
              : `Webinars (${filteredSlots.length})`}
          </h2>

          {filteredSlots.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              {query ? "Sin resultados para esa búsqueda." : "No hay webinars con este estado."}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredSlots.map((slot) => (
                <Link key={slot.id} href={`/portal/charla/${slot.id}`} className="block group">
                  <WebinarRow slot={slot} />
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Speakers ({filteredSpeakers.length})
          </h2>

          {filteredSpeakers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Sin resultados.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {filteredSpeakers.map((speaker) => (
                <SpeakerRow key={speaker.email} speaker={speaker} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function WebinarRow({ slot }: { slot: AdminSlot }) {
  const estadoColor = ESTADO_COLORS[slot.estado] ?? ESTADO_COLORS.Disponible;
  const isPast = slot.fecha ? new Date(slot.fecha) < new Date() : false;

  return (
    <div
      className={`rounded-xl border border-border bg-card px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <div className="w-full sm:w-28 flex-shrink-0">
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

      <div className="sm:w-48 flex-shrink-0">
        {slot.speaker ? (
          <p className="text-xs font-medium truncate">{slot.speaker.nombre}</p>
        ) : (
          <p className="text-xs text-muted-foreground italic">Sin speaker</p>
        )}
      </div>

      <div className="sm:w-24 flex-shrink-0 sm:text-right">
        <p className="text-xs text-muted-foreground">
          {slot.asistentes ?? 0} / {slot.registrados ?? 0}
        </p>
      </div>
    </div>
  );
}

function SpeakerRow({ speaker }: { speaker: AdminSpeaker }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3">
      {speaker.foto ? (
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
          <Image src={speaker.foto} alt={speaker.nombre} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {speaker.nombre.charAt(0)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{speaker.nombre}</p>
        <p className="text-xs text-muted-foreground truncate">{speaker.email}</p>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
        {speaker.etiqueta}
      </span>
    </div>
  );
}
