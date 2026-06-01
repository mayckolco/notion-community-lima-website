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
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium">
            <Brain className="h-4 w-4" />
            Comunidad AI First Founders
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-balance">
            Comparte tu experiencia{" "}<br />
            <span className="gradient-text">construyendo con IA</span>
          </h1>

          <div className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed space-y-4 text-center sm:text-left px-2 sm:px-0">
            <p>Buscamos founders, builders y makers que compartan aprendizajes, experiencias y casos reales que ayuden a otros emprendedores a crecer más rápido.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button size="lg" className="text-base font-bold min-h-[52px] touch-manipulation" render={<Link href="/aplicar" />}>
              Aplica tu charla
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-base font-bold min-h-[52px] touch-manipulation" render={<Link href="/calendario" />}>
              <Calendar className="h-5 w-5 mr-2" />
              Calendario
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto grid gap-4 sm:gap-8 sm:grid-cols-3">
          <FeatureCard
            icon={<Calendar className="h-6 w-6 text-primary" />}
            title="Elige tu sesión"
            description="Selecciona la fecha que mejor se adapte a tu agenda y reserva tu lugar para participar."
          />
          <FeatureCard
            icon={<Brain className="h-6 w-6 text-primary" />}
            title="Comparte tu experiencia"
            description="Cuéntanos qué estás construyendo con IA, qué herramientas utilizas y cuáles han sido los aprendizajes más valiosos en el camino."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 text-primary" />}
            title="Conecta con otros builders"
            description="Comparte tus ideas frente a una comunidad de builders, emprendedores y creadores que están construyendo el futuro con IA."
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
