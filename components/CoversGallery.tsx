"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

const DEFAULT_LABELS = ["Instagram", "Storie", "LinkedIn", "Cover 3", "Cover 2", "Cover 1"];

function slug(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function downloadUrl(url: string, label: string) {
  return `/api/download?url=${encodeURIComponent(url)}&filename=${slug(label)}.png`;
}

export function CoversGallery({
  covers,
  labels = DEFAULT_LABELS,
}: {
  covers: string[];
  labels?: string[];
}) {
  const [preview, setPreview] = useState<number | null>(null);

  const close = useCallback(() => setPreview(null), []);
  const prev = useCallback(
    () => setPreview((i) => (i !== null ? (i - 1 + covers.length) % covers.length : null)),
    [covers.length]
  );
  const next = useCallback(
    () => setPreview((i) => (i !== null ? (i + 1) % covers.length : null)),
    [covers.length]
  );

  useEffect(() => {
    if (preview === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [preview, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {covers.map((cover, i) => {
          const label = labels[i] ?? `Cover ${i + 1}`;
          return (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <Image
                src={cover}
                alt={label}
                fill
                className="object-cover"
                unoptimized
              />

              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-colors flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => setPreview(i)}
                  className="text-paper text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity rounded-md border border-paper/60 px-3 py-1.5 hover:bg-paper/20"
                >
                  Vista previa
                </button>
                <a
                  href={downloadUrl(cover, label)}
                  className="text-primary-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-primary px-3 py-1.5 hover:opacity-90 shadow-clay"
                  onClick={(e) => e.stopPropagation()}
                >
                  Descargar
                </a>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-ink/60 px-2 py-1.5">
                <span className="text-xs text-paper/80 font-medium">{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {preview !== null && (
        <div
          className="fixed inset-0 z-50 bg-ink/92 flex items-center justify-center"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 text-paper/70 hover:text-paper text-2xl leading-none w-9 h-9 flex items-center justify-center rounded-md border border-paper/20 hover:border-paper/50 transition-colors"
          >
            ×
          </button>

          <div className="absolute top-4 left-4 flex items-center gap-3">
            <span className="text-xs text-paper/50">{preview + 1} / {covers.length}</span>
            <span className="text-xs font-medium text-paper/80 rounded-md border border-paper/20 px-2 py-0.5">
              {labels[preview] ?? `Cover ${preview + 1}`}
            </span>
          </div>

          <a
            href={downloadUrl(covers[preview], labels[preview] ?? `cover-${preview + 1}`)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium rounded-md bg-primary text-primary-foreground px-6 py-2.5 shadow-clay hover:opacity-90 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            Descargar {labels[preview] ?? `Cover ${preview + 1}`}
          </a>

          {covers.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-paper/60 hover:text-paper text-3xl w-10 h-10 flex items-center justify-center rounded-md border border-paper/20 hover:border-paper/50 transition-colors"
            >
              ‹
            </button>
          )}

          <div
            className="relative max-w-2xl w-full mx-16 aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={covers[preview]}
              alt={labels[preview] ?? `Cover ${preview + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {covers.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-paper/60 hover:text-paper text-3xl w-10 h-10 flex items-center justify-center rounded-md border border-paper/20 hover:border-paper/50 transition-colors"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
