import Link from "next/link";
import { ArrowRight, Brain, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listDirectorySpeakers } from "@/lib/notion/speakers";
import { SpeakerMarquee } from "@/components/SpeakerMarquee";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function LandingPage() {
  const allSpeakers = await listDirectorySpeakers();
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium">
            <Brain className="h-4 w-4" />
            Martes 7–8 pm · Comunidad AI First Founders
          </div>

          <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight text-balance">
            Comparte lo que{" "}
            <span className="gradient-text">construiste con IA</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Cada martes, un founder comparte su experiencia construyendo con inteligencia
            artificial. Elige tu fecha, postula y habla ante la comunidad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base font-bold" render={<Link href="/postular" />}>
              Postular como speaker
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 px-6 py-16">
        <div className="max-w-5xl mx-auto grid gap-8 sm:grid-cols-3">
          <FeatureCard
            icon={<Calendar className="h-6 w-6 text-primary" />}
            title="Elige tu martes"
            description="Ve los próximos 8 martes disponibles y reserva el que mejor te quede."
          />
          <FeatureCard
            icon={<Brain className="h-6 w-6 text-primary" />}
            title="Comparte tu historia"
            description="Cuéntanos qué construiste, qué herramientas usaste y qué aprendiste."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 text-primary" />}
            title="Conecta con founders"
            description="Habla frente a una comunidad de builders que entienden tu stack."
          />
        </div>
      </section>

      {allSpeakers.length > 0 && (
        <section className="border-t border-border/50 py-12">
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
    <div className="border border-border/50 bg-card p-6 space-y-3">
      <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
