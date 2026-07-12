"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import type { ComunidadProyecto } from "@/lib/notion/proyectos";

interface MemberProjectsPanelProps {
  initialProyectos: ComunidadProyecto[];
  publishedProyectos: ComunidadProyecto[];
  configured: boolean;
}

export function MemberProjectsPanel({
  initialProyectos,
  publishedProyectos,
  configured,
}: MemberProjectsPanelProps) {
  const [proyectos, setProyectos] = useState(initialProyectos);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [url, setUrl] = useState("");
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function resetForm() {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
    setStackInput("");
    setUrl("");
    setGithub("");
  }

  function startEdit(proyecto: ComunidadProyecto) {
    setEditingId(proyecto.id);
    setNombre(proyecto.nombre);
    setDescripcion(proyecto.descripcion);
    setStackInput(proyecto.stack.join(", "));
    setUrl(proyecto.url ?? "");
    setGithub(proyecto.github ?? "");
    setMessage(null);
    setError(null);
  }

  async function refreshMine() {
    const refresh = await fetch("/api/comunidad/proyectos");
    if (refresh.ok) {
      const data = (await refresh.json()) as { proyectos: ComunidadProyecto[] };
      setProyectos(data.proyectos);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    const stack = stackInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = { nombre, descripcion, stack, url, github };

    try {
      const res = editingId
        ? await fetch(`/api/comunidad/proyectos/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/comunidad/proyectos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (res.status === 503) {
        setError("La base de proyectos aún no está configurada.");
        return;
      }
      if (res.status === 403) {
        setError("No puedes editar este proyecto.");
        return;
      }
      if (!res.ok) {
        setError(editingId ? "No se pudo actualizar el proyecto." : "No se pudo enviar el proyecto.");
        return;
      }

      setMessage(
        editingId
          ? "Proyecto actualizado."
          : "Proyecto enviado. Un admin lo revisará para publicarlo."
      );
      resetForm();
      await refreshMine();
    } catch {
      setError("No se pudo conectar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-serif text-lg">Mis proyectos</h2>
        {proyectos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no has subido proyectos.</p>
        ) : (
          <ul className="space-y-3">
            {proyectos.map((proyecto) => (
              <li
                key={proyecto.id}
                className="rounded-lg border border-border p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <p className="font-medium">{proyecto.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Estado: {proyecto.estado ?? "Idea"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(proyecto)}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Editar
                  </button>
                </div>
                {proyecto.descripcion && (
                  <p className="text-sm text-muted-foreground">{proyecto.descripcion}</p>
                )}
                {proyecto.stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {proyecto.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-border bg-card p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium">
            {editingId ? "Editar proyecto" : "Publicar nuevo proyecto"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Cancelar
            </button>
          )}
        </div>
        {!configured && (
          <p className="text-sm text-amber-700">
            La base de proyectos en Notion aún no está conectada (DB_PROYECTOS_ID).
          </p>
        )}
        <input
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del proyecto"
          className="w-full rounded-md border border-border px-4 py-2.5 text-sm"
        />
        <textarea
          required
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="¿Qué construiste y con qué?"
          rows={4}
          className="w-full rounded-md border border-border px-4 py-2.5 text-sm"
        />
        <input
          required
          value={stackInput}
          onChange={(e) => setStackInput(e.target.value)}
          placeholder="Stack (separado por comas): Claude, Next.js, n8n"
          className="w-full rounded-md border border-border px-4 py-2.5 text-sm"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL del proyecto (opcional)"
          className="w-full rounded-md border border-border px-4 py-2.5 text-sm"
        />
        <input
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          placeholder="GitHub (opcional)"
          className="w-full rounded-md border border-border px-4 py-2.5 text-sm"
        />
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading || !configured}
          className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : editingId
              ? "Guardar cambios"
              : "Enviar proyecto"}
        </button>
      </form>

      <section className="space-y-4 pt-4 border-t border-border/60">
        <h2 className="font-serif text-lg">Proyectos de la comunidad</h2>
        <p className="text-sm text-muted-foreground">
          Todos los proyectos publicados por miembros de Claude Perú.
        </p>
        {publishedProyectos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay proyectos publicados.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {publishedProyectos.map((proyecto) => (
              <li
                key={proyecto.id}
                className="rounded-xl border border-border bg-card p-5 shadow-soft space-y-3"
              >
                <div className="space-y-1">
                  <p className="font-serif text-lg leading-snug">{proyecto.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    por {proyecto.autor || "Builder de la comunidad"}
                  </p>
                </div>
                {proyecto.descripcion && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {proyecto.descripcion}
                  </p>
                )}
                {proyecto.stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {proyecto.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-3 text-sm">
                  {proyecto.url && (
                    <a
                      href={proyecto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Ver proyecto
                    </a>
                  )}
                  {proyecto.github && (
                    <a
                      href={proyecto.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
