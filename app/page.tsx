import Link from "next/link";
import { ArrowRight, Users, Calendar, BookOpen, Network, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listDirectorySpeakers } from "@/lib/notion/speakers";
import { SpeakerMarquee } from "@/components/SpeakerMarquee";
import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Claude Community",
  alternateName: "Claude Perú",
  url: "https://claude.mayckolco.com",
  logo: "https://claude.mayckolco.com/og-image.png",
  description:
    "La comunidad peruana de builders que construyen con Claude. Webinars semanales, meetups en Lima y networking con founders de IA en Perú.",
  sameAs: [
    "https://instagram.com/claudeperucommunity",
    "https://chat.whatsapp.com/CvBaizXWjtZCstUgXlJqi3",
  ],
  location: {
    "@type": "Place",
    name: "Lima, Perú",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
  },
  event: {
    "@type": "EventSeries",
    name: "Webinars Claude Community",
    description: "Charlas semanales en vivo con builders peruanos que comparten casos reales construyendo con Claude.",
    organizer: { "@type": "Organization", name: "Claude Community" },
    location: { "@type": "VirtualLocation", url: "https://claude.mayckolco.com/eventos" },
    eventSchedule: {
      "@type": "Schedule",
      repeatFrequency: "P1W",
      byDay: "https://schema.org/Monday",
      startTime: "19:00",
      endTime: "20:00",
    },
  },
};

export default async function LandingPage() {
  const allSpeakers = (await listDirectorySpeakers()).filter((s) => s.foto);
  return (
    <main className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <p className="text-xs uppercase tracking-widest text-primary">
            Comunidad de IA en Perú
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
            La comunidad peruana de{" "}
            <span className="gradient-text">Claude</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Conectamos developers, diseñadores e innovadores peruanos que construyen con Claude.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button size="lg" className="min-h-[52px] touch-manipulation" render={<Link href="/aplicar" />}>
              Aplica tu charla
              <ArrowRight className="h-5 w-5 ml-2" strokeWidth={1.75} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-[52px] touch-manipulation"
              render={
                <a
                  href="https://chat.whatsapp.com/CvBaizXWjtZCstUgXlJqi3"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <Calendar className="h-5 w-5 mr-2" strokeWidth={1.75} />
              Únete a la comunidad
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-primary">
              ¿Qué es Claude Perú?
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight whitespace-nowrap">
              Una comunidad construida por builders, para builders
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-xl border border-border bg-card p-6 shadow-soft space-y-3 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-clay"
              >
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-110">
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" strokeWidth={1.75} />
                </div>
                <h3 className="font-serif text-lg transition-colors duration-300 group-hover:text-primary">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {allSpeakers.length > 0 && (
        <section className="border-t border-border/60 py-12">
          <SpeakerMarquee speakers={allSpeakers} />
        </section>
      )}

      <TestimonialsMarquee />

      <Footer />
    </main>
  );
}
