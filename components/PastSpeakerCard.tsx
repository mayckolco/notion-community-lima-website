import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PastSpeaker } from "@/lib/notion/speakers";

interface PastSpeakerCardProps {
  speaker: PastSpeaker;
  index: number;
}

export function PastSpeakerCard({ speaker, index }: PastSpeakerCardProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/directorio/${speaker.slug}`}
      className="relative border border-border/60 bg-card p-4 sm:p-5 flex flex-col gap-4 group touch-manipulation
        hover:border-primary/60 hover:bg-card/80 hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.25)]
        hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out"
    >
      {/* corner brackets */}
      <span className="absolute top-2 left-2 text-[10px] text-muted-foreground/40 font-mono">{num}</span>
      <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-muted-foreground/20 group-hover:border-primary/50 transition-colors duration-300" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-muted-foreground/20 group-hover:border-primary/50 transition-colors duration-300" />

      {/* header */}
      <div className="flex items-center gap-3 pt-3">
        <div className="relative w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 bg-muted ring-0 group-hover:ring-2 group-hover:ring-primary/40 transition-all duration-300">
          {speaker.foto ? (
            <Image
              src={speaker.foto}
              alt={speaker.nombre}
              fill
              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full bg-muted-foreground/20" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-black text-sm leading-tight group-hover:text-primary transition-colors duration-300">{speaker.nombre}</p>
          {(speaker.rol || speaker.empresa) && (
            <p className="text-xs text-primary/80 font-mono leading-tight mt-0.5 break-words">
              {[speaker.rol, speaker.empresa].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {/* tools */}
      {speaker.herramientas.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {speaker.herramientas.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="text-[10px] font-mono border border-border/60 px-2 py-0.5 text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-all duration-300"
            >
              {tool}
            </span>
          ))}
        </div>
      )}

      {/* footer */}
      <div className="mt-auto pt-2 border-t border-border/30 group-hover:border-primary/20 flex justify-end transition-colors duration-300">
        <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground group-hover:text-primary group-hover:gap-2 transition-all duration-300 uppercase tracking-wider">
          Ver más
          <ArrowRight className="h-2.5 w-2.5" />
        </span>
      </div>
    </Link>
  );
}
