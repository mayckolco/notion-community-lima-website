"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlotCard } from "@/components/SlotCard";
import { cn } from "@/lib/utils";
import type { Slot } from "@/lib/schemas";

const PAGE_SIZE = 8;

export function SlotCarousel({ slots }: { slots: Slot[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(slots.length / PAGE_SIZE);
  const visible = slots.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  const touchStartX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) setPage((p) => p + 1);
      if (diff < 0 && hasPrev) setPage((p) => p - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {visible.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPrev}
            aria-label="Página anterior"
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-full border border-border/60 bg-card transition-all duration-200",
              hasPrev
                ? "hover:border-primary/50 hover:text-primary text-foreground active:scale-95"
                : "opacity-30 cursor-not-allowed text-muted-foreground"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Página ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-200 touch-manipulation",
                  i === page
                    ? "bg-primary w-6 h-2"
                    : "bg-border hover:bg-muted-foreground w-2 h-2"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext}
            aria-label="Página siguiente"
            className={cn(
              "flex items-center justify-center w-11 h-11 rounded-full border border-border/60 bg-card transition-all duration-200",
              hasNext
                ? "hover:border-primary/50 hover:text-primary text-foreground active:scale-95"
                : "opacity-30 cursor-not-allowed text-muted-foreground"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
