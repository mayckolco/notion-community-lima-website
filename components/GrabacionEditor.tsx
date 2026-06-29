"use client";

import { useState } from "react";

interface Props {
  slotId: string;
  initialUrl: string | null;
}

export function GrabacionEditor({ slotId, initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/slots/${slotId}/grabacion`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url.trim() || null }),
    });
    setLoading(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const currentUrl = url.trim() || null;

  if (editing) {
    return (
      <div className="border border-orange-500/40 bg-orange-950/10 p-4 space-y-2">
        <p className="text-xs uppercase tracking-wider text-orange-500/70">Grabación</p>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/..."
          autoFocus
          className="w-full text-xs bg-background border border-border/50 px-2 py-1.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-orange-500/50"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 transition-colors disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={() => { setUrl(initialUrl ?? ""); setEditing(false); }}
            className="text-xs border border-border/50 px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border/30 p-4 space-y-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground/40">Grabación</p>
      {currentUrl ? (
        <>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-orange-300 transition-colors block"
          >
            Ver grabación
          </a>
          <p className="text-xs text-muted-foreground/30 truncate">{currentUrl}</p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground/30">Sin URL aún</p>
      )}
      <button
        onClick={() => setEditing(true)}
        className="text-xs border border-border/50 px-2 py-1 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
      >
        {saved ? "Guardado" : currentUrl ? "Editar URL" : "Agregar URL"}
      </button>
    </div>
  );
}
