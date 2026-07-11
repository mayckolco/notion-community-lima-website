import Link from "next/link";
import { Users, Video, BookOpen, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JoinCommunityButton } from "@/components/JoinCommunityButton";

const PILLARS = [
  {
    icon: Video,
    title: "Webinars semanales",
    description:
      "Charlas en vivo cada lunes con builders peruanos que comparten casos reales, demos y aprendizajes construyendo con Claude.",
  },
  {
    icon: Users,
    title: "Meetups mensuales",
    description:
      "Nos reunimos presencialmente en Lima para compartir demos, proyectos y descubrimientos sobre Claude.",
  },
  {
    icon: BookOpen,
    title: "Aprendizaje colectivo",
    description:
      "Desde prompt engineering avanzado hasta implementación de agentes. El conocimiento se comparte y multiplica.",
  },
  {
    icon: Network,
    title: "Networking de calidad",
    description:
      "Conoce a los builders más inquietos de Perú. Encuentra co-founders, talento o inspiración para tu próximo proyecto.",
  },
] as const;

export function CommunityPillarsSection() {
  return (
    <section aria-labelledby="pillars-heading" className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-primary">Comunidad</p>
          <h2 id="pillars-heading" className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
            Claude Perú: builders, para builders
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-6 shadow-soft space-y-3 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-clay"
            >
              <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-110">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-serif text-lg transition-colors duration-300 group-hover:text-primary">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="border-t border-border/60 px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-balance">
          Empieza hoy con la comunidad{" "}
          <span className="gradient-text">Claude Perú</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Únete gratis, asiste a los webinars, aprende de casos reales y conecta
          con builders que ya construyen con IA en Perú.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <JoinCommunityButton location="landing_final_cta" />
          <Button
            size="lg"
            variant="outline"
            className="min-h-[52px] touch-manipulation"
            render={<Link href="/aplicar" />}
          >
            Aplica como speaker
          </Button>
        </div>
      </div>
    </section>
  );
}
