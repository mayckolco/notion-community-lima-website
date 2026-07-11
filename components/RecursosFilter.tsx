"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUpRight, ExternalLink, Play, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  RECURSO_CATEGORIAS,
  type Recurso,
  type RecursoCategoria,
} from "@/lib/content/recursos";

const ALL_CATEGORY = "todos" as const;
type FilterValue = typeof ALL_CATEGORY | RecursoCategoria;

interface RecursosFilterProps {
  recursos: Recurso[];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesQuery(recurso: Recurso, query: string): boolean {
  if (!query) return true;
  const haystack = normalize(
    [
      recurso.titulo,
      recurso.descripcion,
      recurso.speaker ?? "",
      RECURSO_CATEGORIAS[recurso.categoria],
    ].join(" ")
  );
  return haystack.includes(normalize(query));
}

export function RecursosFilter({ recursos }: RecursosFilterProps) {
  const [active, setActive] = useState<FilterValue>(ALL_CATEGORY);
  const [query, setQuery] = useState("");

  const filters: { value: FilterValue; label: string }[] = [
    { value: ALL_CATEGORY, label: "Todos" },
    ...Object.entries(RECURSO_CATEGORIAS).map(([value, label]) => ({
      value: value as RecursoCategoria,
      label,
    })),
  ];

  const filtered = useMemo(() => {
    return recursos.filter((r) => {
      const categoryMatch = active === ALL_CATEGORY || r.categoria === active;
      return categoryMatch && matchesQuery(r, query.trim());
    });
  }, [recursos, active, query]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Buscar recursos, charlas, herramientas…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 min-h-[44px] touch-manipulation"
          aria-label="Buscar recursos"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActive(value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors touch-manipulation ${
              active === value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {query && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {query
            ? "No encontramos recursos con ese término. Prueba otra búsqueda o cambia la categoría."
            : "No hay recursos en esta categoría aún."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((recurso) => (
            <RecursoCard key={recurso.id} recurso={recurso} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecursoCard({ recurso }: { recurso: Recurso }) {
  const isExternal = recurso.externo ?? recurso.url.startsWith("http");
  const Icon = recurso.tipo === "grabacion" || recurso.tipo === "video" ? Play : ExternalLink;

  return (
    <a
      href={recurso.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group rounded-xl border border-border bg-card p-5 shadow-soft space-y-3 hover:border-primary/40 hover:-translate-y-0.5 transition-all touch-manipulation"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] font-mono uppercase tracking-widest rounded-full border border-border px-2 py-0.5 text-muted-foreground">
          {RECURSO_CATEGORIAS[recurso.categoria]}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>

      <h3 className="font-serif text-base group-hover:text-primary transition-colors">
        {recurso.titulo}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{recurso.descripcion}</p>

      {(recurso.speaker || recurso.fecha) && (
        <p className="text-xs text-muted-foreground/70 pt-1">
          {recurso.speaker && <span>{recurso.speaker}</span>}
          {recurso.speaker && recurso.fecha && <span> · </span>}
          {recurso.fecha && (
            <time dateTime={recurso.fecha}>
              {format(parseISO(recurso.fecha), "d MMM yyyy", { locale: es })}
            </time>
          )}
        </p>
      )}

      <span className="inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        {recurso.tipo === "grabacion" ? "Ver grabación" : "Abrir recurso"}
        <ArrowUpRight className="h-3 w-3" />
      </span>
    </a>
  );
}
