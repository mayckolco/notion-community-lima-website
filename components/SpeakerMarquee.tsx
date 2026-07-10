import Image from "next/image";
import type { PastSpeaker } from "@/lib/notion/speakers";

function PhotoCard({ speaker }: { speaker: PastSpeaker }) {
  return (
    <div className="relative flex-shrink-0 w-36 h-48 rounded-xl overflow-hidden border border-border shadow-soft">
      {speaker.foto ? (
        <Image
          src={speaker.foto}
          alt={speaker.nombre}
          fill
          className="object-cover"
          sizes="144px"
        />
      ) : (
        <div className="w-full h-full bg-muted-foreground/10 flex items-center justify-center">
          <span className="text-3xl font-serif text-muted-foreground/30">
            {speaker.nombre.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

export function SpeakerMarquee({ speakers }: { speakers: PastSpeaker[] }) {
  if (speakers.length === 0) return null;

  // 4 copies → animate -50% = seamlessly loops through 2 copies
  const items = [...speakers, ...speakers, ...speakers, ...speakers];

  return (
    <div className="space-y-6">
      <h2 className="text-center font-serif text-2xl text-foreground px-4">
        Voces que están construyendo con IA
      </h2>
      <div
        className="overflow-hidden space-y-3 py-2"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        {/* Row 1: right → left */}
        <div
          className="flex gap-3 w-max"
          style={{ animation: "marquee-left 80s linear infinite" }}
        >
          {items.map((speaker, i) => (
            <PhotoCard key={`r1-${speaker.id}-${i}`} speaker={speaker} />
          ))}
        </div>

        {/* Row 2: left → right */}
        <div
          className="flex gap-3 w-max"
          style={{ animation: "marquee-right 98s linear infinite" }}
        >
          {items.map((speaker, i) => (
            <PhotoCard key={`r2-${speaker.id}-${i}`} speaker={speaker} />
          ))}
        </div>
      </div>
    </div>
  );
}
