"use client";

import { useState } from "react";

interface Props {
  slotId: string;
  initialUrl: string | null;
  label: string;
  endpoint: string;
}

export function GrabacionEditor({ slotId, initialUrl, label, endpoint }: Props) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/slots/${slotId}/${endpoint}`, {
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
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
        <p className="text-xs uppercase tracking-widest text-primary">{label}</p>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          autoFocus
          className="w-full text-xs rounded-md bg-background border border-border px-2 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-xs rounded-md bg-primary text-primary-foreground px-3 py-1 shadow-clay hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={() => { setUrl(initialUrl ?? ""); setEditing(false); }}
            className="text-xs rounded-md border border-border px-3 py-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 space-y-2">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      {currentUrl ? (
        <p className="text-xs text-muted-foreground truncate">{currentUrl}</p>
      ) : (
        <p className="text-sm text-muted-foreground">Sin URL aún</p>
      )}
      <div className="flex gap-2">
        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs rounded-md bg-primary text-primary-foreground px-2 py-1 shadow-clay hover:opacity-90 transition-opacity"
          >
            Abrir
          </a>
        )}
        <button
          onClick={() => setEditing(true)}
          className="text-xs rounded-md border border-border px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {saved ? "Guardado" : currentUrl ? "Editar" : "Agregar URL"}
        </button>
      </div>
    </div>
  );
}
