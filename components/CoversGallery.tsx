"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

function downloadUrl(url: string, index: number) {
  return `/api/download?url=${encodeURIComponent(url)}&filename=cover-${index + 1}.png`;
}

export function CoversGallery({ covers }: { covers: string[] }) {
  const [preview, setPreview] = useState<number | null>(null);

  const close = useCallback(() => setPreview(null), []);
  const prev = useCallback(() =>
    setPreview((i) => (i !== null ? (i - 1 + covers.length) % covers.length : null)),
    [covers.length]
  );
  const next = useCallback(() =>
    setPreview((i) => (i !== null ? (i + 1) % covers.length : null)),
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
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {covers.map((cover, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden border border-border/40 hover:border-orange-500/60 transition-colors"
          >
            <Image
              src={cover}
              alt={`Cover ${i + 1}`}
              fill
              className="object-cover"
              unoptimized
            />

            {/* Overlay con dos acciones */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center gap-2">
              <button
                onClick={() => setPreview(i)}
                className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity border border-white/60 px-3 py-1.5 hover:bg-white/20"
              >
                Vista previa
              </button>
              <a
                href={downloadUrl(cover, i)}
                className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity border border-orange-400/80 bg-orange-500/80 px-3 py-1.5 hover:bg-orange-500"
                onClick={(e) => e.stopPropagation()}
              >
                Descargar
              </a>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
              <span className="text-xs text-white/70">Cover {i + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {preview !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none w-9 h-9 flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors"
          >
            ×
          </button>

          {/* Counter */}
          <span className="absolute top-4 left-4 text-xs text-white/50">
            {preview + 1} / {covers.length}
          </span>

          {/* Download in lightbox */}
          <a
            href={downloadUrl(covers[preview], preview)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Descargar cover {preview + 1}
          </a>

          {/* Prev arrow */}
          {covers.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white/60 hover:text-white text-3xl w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-2xl w-full mx-16 aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={covers[preview]}
              alt={`Cover ${preview + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Next arrow */}
          {covers.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white/60 hover:text-white text-3xl w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
