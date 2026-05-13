"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Slot } from "@/lib/schemas";

interface SlotCardProps {
  slot: Slot;
  weekNumber: number;
}

const ESTADO_CONFIG = {
  Disponible: {
    label: "Disponible",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  Reservado: {
    label: "Reservado",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  },
  Confirmado: {
    label: "Confirmado",
    className: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  },
  Bloqueado: {
    label: "No disponible",
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  },
  Realizado: {
    label: "Realizado",
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  },
} as const;

export function SlotCard({ slot, weekNumber }: SlotCardProps) {
  const date = parseISO(slot.fecha);
  const available = slot.estado === "Disponible";
  const config = ESTADO_CONFIG[slot.estado] ?? ESTADO_CONFIG.Bloqueado;

  const dayName = format(date, "EEEE", { locale: es });
  const dayNum = format(date, "d");
  const monthYear = format(date, "MMMM yyyy", { locale: es });

  return (
    <Card
      className={cn(
        "border transition-all duration-200",
        available
          ? "border-primary/30 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(255,107,43,0.1)]"
          : "border-border/50 opacity-60"
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Semana {weekNumber}
            </p>
            <p className="text-lg font-bold capitalize leading-tight">{dayName}</p>
            <p className="text-3xl font-black text-primary leading-none">{dayNum}</p>
            <p className="text-sm text-muted-foreground capitalize">{monthYear}</p>
          </div>
          <Badge variant="outline" className={cn("text-xs shrink-0", config.className)}>
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 mt-4 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>7:00 – 8:00 pm</span>
        </div>

        {slot.lumaUrl && (
          <a
            href={slot.lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 mt-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Ver en Luma
          </a>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {available ? (
          <Button
            className="w-full"
            size="sm"
            render={<Link href={`/postular/${slot.id}`} />}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Postular para este martes
          </Button>
        ) : (
          <Button disabled className="w-full" size="sm" variant="outline">
            No disponible
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
