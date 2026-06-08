"use client";

import { format, getISOWeek, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Slot } from "@/lib/schemas";

const LIMA_TZONES = ["America/Lima", "America/Bogota"];

function useLocalSlotTime(fecha: string) {
  const [timeDisplay, setTimeDisplay] = useState("7:00 – 8:00 pm");
  const [localNote, setLocalNote] = useState<string | null>(null);

  useEffect(() => {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (LIMA_TZONES.includes(userTz)) return;

    const fmt = (d: Date) =>
      d.toLocaleTimeString("es", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: userTz,
      });

    const start = new Date(`${fecha}T19:00:00-05:00`);
    const end = new Date(`${fecha}T20:00:00-05:00`);

    setTimeDisplay(`${fmt(start)} – ${fmt(end)}`);
    setLocalNote("hora local · Lima: 7:00 – 8:00 pm");
  }, [fecha]);

  return { timeDisplay, localNote };
}

interface SlotCardProps {
  slot: Slot;
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
    label: "Ocupado",
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  },
} as const;

export function SlotCard({ slot }: SlotCardProps) {
  const date = parseISO(slot.fecha);
  const available = slot.estado === "Disponible";
  const config = ESTADO_CONFIG[slot.estado] ?? ESTADO_CONFIG.Bloqueado;

  const dayName = format(date, "EEEE", { locale: es });
  const dayNum = format(date, "d");
  const monthYear = format(date, "MMMM yyyy", { locale: es });
  const { timeDisplay, localNote } = useLocalSlotTime(slot.fecha);

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
              Semana {getISOWeek(date)}
            </p>
            <p className="text-lg font-bold capitalize leading-tight">{dayName}</p>
            <p className="text-3xl font-black text-primary leading-none">{dayNum}</p>
            <p className="text-sm text-muted-foreground capitalize">{monthYear}</p>
          </div>
          <Badge variant="outline" className={cn("text-xs shrink-0", config.className)}>
            {config.label}
          </Badge>
        </div>

        <div className="mt-4 space-y-0.5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{timeDisplay}</span>
          </div>
          {localNote && (
            <p className="text-[10px] text-muted-foreground/50 font-mono pl-5">{localNote}</p>
          )}
        </div>

      </CardContent>

      <CardFooter className="pt-0">
        {available ? (
          <Button
            className="w-full min-h-[44px] touch-manipulation"
            render={
              <Link
                href={`/aplicar/${slot.id}`}
                onClick={() => sendGAEvent("event", "select_slot", { slot_date: slot.fecha })}
              />
            }
          >
            <Calendar className="h-4 w-4 mr-2" />
            Aplicar aquí
          </Button>
        ) : slot.lumaUrl ? (
          <a
            href={slot.lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 text-sm font-medium border border-primary/40 text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors px-4 touch-manipulation"
          >
            <ExternalLink className="h-4 w-4" />
            Ver en Luma
          </a>
        ) : (
          <Button disabled className="w-full min-h-[44px]" variant="outline">
            No disponible
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
