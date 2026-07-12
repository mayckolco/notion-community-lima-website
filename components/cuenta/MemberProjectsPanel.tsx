"use client";

import { useState } from "react";
import type { ComunidadProyecto } from "@/lib/notion/proyectos";

interface MemberProjectsPanelProps {
  initialProyectos: ComunidadProyecto[];
  configured: boolean;
}

export function MemberProjectsPanel({
  initialProyectos,
  configured,
}: MemberProjectsPanelProps) {
  const [proyectos, setProyectos] = useState(initialProyectos);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [url, setUrl] = useState("");
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

    try {
      const res = await fetch("/api/comunidad/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, stack, url, github }),
      });

      if (res.status === 503) {
        setError("La base de proyectos aún no está configurada.");
        return;
      }
      if (!res.ok) {
        setError("No se pudo enviar el proyecto.");
        return;
      }

      setMessage("Proyecto enviado. Un admin lo revisará para publicarlo.");
      setNombre("");
      setDescripcion("");
      setStackInput("");
      setUrl("");
      setGithub("");

      const refresh = await fetch("/api/comunidad/proyectos");
      if (refresh.ok) {
        const data = (await refresh.json()) as { proyectos: ComunidadProyecto[] };
        setProyectos(data.proyectos);
      }
    } catch {
      setError("No se pudo conectar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-serif text-lg">Mis proyectos</h3>
        {proyectos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no has subido proyectos.
          </p>
        ) : (
          <ul className="space-y-3">
            {proyectos.map((proyecto) => (
              <li key={proyecto.id} className="rounded-lg border border-border p-4 space-y-1">
                <p className="font-medium">{proyecto.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  Estado: {proyecto.estado ?? "Idea"}
                </p>
                {proyecto.descripcion && (
                  <p className="text-sm text-muted-foreground">{proyecto.descripcion}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h4 className="font-medium">Subir nuevo proyecto</h4>
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
          {loading ? "Enviando..." : "Enviar proyecto"}
        </button>
      </form>
    </div>
  );
}
