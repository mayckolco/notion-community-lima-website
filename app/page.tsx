import Link from "next/link";
import { ArrowRight, Brain, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listDirectorySpeakers } from "@/lib/notion/speakers";
import { SpeakerMarquee } from "@/components/SpeakerMarquee";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function LandingPage() {
  const allSpeakers = (await listDirectorySpeakers()).filter((s) => s.foto);
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <p className="text-xs uppercase tracking-widest text-primary">
            Comunidad · Lima
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
            Comparte tu experiencia{" "}
            <span className="gradient-text">construyendo con IA</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Buscamos founders, builders y makers que compartan aprendizajes, experiencias y casos reales que ayuden a otros emprendedores a crecer más rápido.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button size="lg" className="min-h-[52px] touch-manipulation" render={<Link href="/aplicar" />}>
              Aplica tu charla
              <ArrowRight className="h-5 w-5 ml-2" strokeWidth={1.75} />
            </Button>
            <Button size="lg" variant="outline" className="min-h-[52px] touch-manipulation" render={<Link href="/calendario" />}>
              <Calendar className="h-5 w-5 mr-2" strokeWidth={1.75} />
              Calendario
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto grid gap-4 sm:gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={<Calendar className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            title="Elige tu sesión"
            description="Selecciona la fecha que mejor se adapte a tu agenda y reserva tu lugar para participar."
          />
          <FeatureCard
            icon={<Brain className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            title="Comparte tu experiencia"
            description="Cuéntanos qué estás construyendo con IA, qué herramientas utilizas y cuáles han sido los aprendizajes más valiosos en el camino."
          />
          <FeatureCard
            icon={<Users className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            title="Conecta con otros builders"
            description="Comparte tus ideas frente a una comunidad de builders, emprendedores y creadores que están construyendo el futuro con IA."
          />
        </div>
      </section>

      {allSpeakers.length > 0 && (
        <section className="border-t border-border/60 py-12">
          <SpeakerMarquee speakers={allSpeakers} />
        </section>
      )}

      <Footer />
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-3">
      <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-serif text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
