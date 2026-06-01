import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PastSpeaker } from "@/lib/notion/speakers";

interface DirectorioHeroProps {
  speakers: PastSpeaker[];
}

function SpeakerCard({ speaker }: { speaker: PastSpeaker }) {
  return (
    <div className="relative flex-shrink-0 w-52 h-72 overflow-hidden bg-muted">
      {speaker.foto ? (
        <Image
          src={speaker.foto}
          alt={speaker.nombre}
          fill
          className="object-cover grayscale"
          sizes="208px"
        />
      ) : (
        <div className="w-full h-full bg-muted-foreground/20 flex items-center justify-center">
          <span className="text-4xl font-black text-muted-foreground/30">
            {speaker.nombre.charAt(0)}
          </span>
        </div>
      )}

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* role / empresa */}
      {(speaker.rol || speaker.empresa) && (
        <div className="absolute top-3 left-3 right-3">
          <span className="text-[10px] font-mono text-white/55 uppercase tracking-wider leading-tight line-clamp-1">
            {[speaker.rol, speaker.empresa].filter(Boolean).join(" · ")}
          </span>
        </div>
      )}

      {/* name */}
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-sm font-black text-white leading-tight">
          {speaker.nombre}
        </p>
      </div>
    </div>
  );
}

export function DirectorioHero({ speakers }: DirectorioHeroProps) {
  const withPhoto = speakers.filter((s) => s.foto);

  const fill = (arr: PastSpeaker[], min: number) => {
    if (arr.length === 0) return arr;
    const copies: PastSpeaker[] = [];
    while (copies.length < min) copies.push(...arr);
    return copies;
  };

  const row1 = fill(withPhoto, 8);
  const row2 = fill([...withPhoto].reverse(), 8);

  const hasMarquee = withPhoto.length > 0;

  return (
    <section className="relative w-full overflow-hidden bg-background min-h-[calc(100vh-64px)] flex items-center">
      {/* subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)]">

        {/* ─── LEFT: text content ─── */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-0">
          <div className="space-y-7 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium w-fit">
              Solo builders con experiencia real
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight text-balance">
              Los que construyen con{" "}
              <span className="gradient-text">IA en LATAM</span>{" "}
              comparten su camino
            </h1>

            <p className="text-base sm:text-lg text-primary/80 leading-relaxed">
              Fundadores, makers y builders que presentaron en AI First Founders.
              Sin teoría. Solo experiencia real.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/aplicar"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 text-sm hover:bg-primary/90 transition-colors"
              >
                Postula tu charla
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#speakers"
                className="inline-flex items-center gap-2 border border-border/80 text-foreground font-semibold px-6 py-3 text-sm hover:border-primary/60 hover:text-primary transition-colors"
              >
                Explorar speakers
              </a>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: scrolling speaker rows ─── */}
        {hasMarquee && (
          <div className="relative flex flex-col justify-center gap-4 py-12 lg:py-0 overflow-hidden">
            {/* top fade */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-background to-transparent" />
            {/* bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-background to-transparent" />
            {/* left fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
            {/* right fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

            {/* Row 1: right → left */}
            <div
              className="flex gap-4 w-max"
              style={{ animation: "marquee-left 75s linear infinite" }}
            >
              {[...row1, ...row1].map((speaker, i) => (
                <SpeakerCard key={`r1-${speaker.id}-${i}`} speaker={speaker} />
              ))}
            </div>

            {/* Row 2: left → right */}
            <div
              className="flex gap-4 w-max"
              style={{ animation: "marquee-right 95s linear infinite" }}
            >
              {[...row2, ...row2].map((speaker, i) => (
                <SpeakerCard key={`r2-${speaker.id}-${i}`} speaker={speaker} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
