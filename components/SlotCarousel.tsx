"use client";

import { useState } from "react";
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

  return (
    <div className="relative px-10">
      {slots.length > PAGE_SIZE && (
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={!hasPrev}
          aria-label="Página anterior"
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full border border-border/60 bg-card transition-all duration-200",
            hasPrev
              ? "hover:border-primary/50 hover:text-primary text-foreground"
              : "opacity-30 cursor-not-allowed text-muted-foreground"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
      </div>

      {slots.length > PAGE_SIZE && (
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNext}
          aria-label="Página siguiente"
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full border border-border/60 bg-card transition-all duration-200",
            hasNext
              ? "hover:border-primary/50 hover:text-primary text-foreground"
              : "opacity-30 cursor-not-allowed text-muted-foreground"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-200",
                i === page ? "bg-primary w-4" : "bg-border hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
