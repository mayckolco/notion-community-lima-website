import Link from "next/link";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JoinCommunityButton } from "@/components/JoinCommunityButton";
import type { Slot } from "@/lib/schemas";

interface LandingHeroProps {
  nextEvent: Slot | null;
}

export function LandingHero({ nextEvent }: LandingHeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <p className="text-xs uppercase tracking-widest text-primary">
          La referencia en español sobre Claude en Perú
        </p>

        <h1 id="hero-heading" className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
          Aprende, construye y crece con{" "}
          <span className="gradient-text">Claude</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Comunidad de builders peruanos que comparten casos reales con Claude —
          desde tu primer prompt hasta productos con IA.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
          <JoinCommunityButton location="landing_hero" />
          <Button
            size="lg"
            variant="outline"
            className="min-h-[52px] touch-manipulation"
            render={<Link href="/eventos" />}
          >
            <Calendar className="h-5 w-5 mr-2" strokeWidth={1.75} />
            Ver eventos
          </Button>
        </div>

        {nextEvent && (
          <div className="pt-4">
            <Link
              href="/eventos"
              className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 rounded-xl border border-primary/30 bg-primary/[0.04] px-5 py-4 text-left hover:border-primary/50 hover:bg-primary/[0.07] transition-colors touch-manipulation"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                Próximo evento
              </span>
              <span className="text-sm font-medium">
                {nextEvent.titulo ?? "Webinar confirmado"}
              </span>
              {nextEvent.fecha && (
                <span className="text-xs text-muted-foreground">
                  {format(parseISO(nextEvent.fecha), "EEEE d MMM", { locale: es })}
                </span>
              )}
              <ArrowRight className="h-4 w-4 text-primary hidden sm:block" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
