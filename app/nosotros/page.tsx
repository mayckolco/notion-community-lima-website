import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Handshake, Mic, Target, Users, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { JoinCommunityButton } from "@/components/JoinCommunityButton";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

const VALUES = [
  {
    icon: Target,
    titulo: "Builders que ejecutan",
    descripcion:
      "No teoría. Cada sesión es un caso real: qué se construyó, con qué herramientas y qué salió mal. Aprendizajes que se pueden aplicar el mismo día.",
  },
  {
    icon: Users,
    titulo: "Comunidad primero",
    descripcion:
      "La red que construyes con otros founders vale tanto como el contenido. Conectamos a personas que ya están usando IA para crecer, no a las que hablan de usarla.",
  },
  {
    icon: Zap,
    titulo: "IA como primer recurso",
    descripcion:
      "No como ayuda, como base. Todos los que participan aquí ya tomaron la decisión de construir diferente. Eso cambia el nivel de la conversación.",
  },
] as const;

const PARTICIPAR = [
  {
    icon: Calendar,
    titulo: "Asistir a eventos",
    descripcion:
      "Únete a los webinars semanales y meetups en Lima. Regístrate en Luma y aprende de casos reales.",
    href: "/eventos",
    cta: "Ver eventos",
    externo: false,
  },
  {
    icon: Mic,
    titulo: "Ser speaker",
    descripcion:
      "Comparte lo que estás construyendo con Claude en un webinar en vivo. Aplica con tu charla y fecha.",
    href: "/aplicar",
    cta: "Aplicar ahora",
    externo: false,
  },
  {
    icon: Handshake,
    titulo: "Colaborar",
    descripcion:
      "Ayuda a organizar eventos, crear contenido o conectar a la comunidad. Escríbenos y conversemos.",
    href: "https://wa.me/51946542990",
    cta: "Escribir por WhatsApp",
    externo: true,
  },
] as const;

const FOUNDERS = [
  {
    nombre: "Gianmarco Guerrero",
    titulo: "Community Leader · Claude Perú",
    foto: "/founders/gianmarco-guerrero.jpg",
  },
  {
    nombre: "Mayckol Cruzado",
    titulo: "Co-founder · IA Labs",
    foto: "/founders/mayckol-cruzado.jpeg",
  },
  {
    nombre: "Jhon Miranda",
    titulo: "Co-founder · IA Labs",
    foto: "/founders/jhon-miranda.jpeg",
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Sobre nosotros",
  description:
    "Claude Perú es la comunidad independiente para aprender, experimentar y construir con Claude e inteligencia artificial en Perú, impulsada por IA Labs.",
  path: "/nosotros",
});

export default function NosotrosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Sobre nosotros", path: "/nosotros" },
        ])}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-20">

          {/* Hero */}
          <header className="space-y-6">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">Quiénes somos</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight leading-tight">
              Sobre nosotros
            </h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Claude Perú es la comunidad independiente para aprender, experimentar y construir con
                Claude e inteligencia artificial en Perú, impulsada por IA Labs. Reunimos a personas
                con ganas de crear, compartir y aplicar la IA en su trabajo, negocio o proyectos, a
                través de eventos, workshops, cursos y sesiones prácticas basadas en casos reales.
              </p>
              <p>
                Creemos que la mejor forma de aprender es construyendo. Por eso fomentamos una
                comunidad abierta y colaborativa donde los miembros comparten herramientas, flujos de
                trabajo, experimentos y aprendizajes para que más personas puedan aprovechar el
                potencial de Claude y la IA. Claude Perú no está afiliada a Anthropic; somos una
                iniciativa de la comunidad impulsada por IA Labs con el objetivo de convertirnos en
                el principal punto de encuentro para los builders de IA en Perú.
              </p>
            </div>
          </header>

          {/* Valores */}
          <div className="space-y-8">
            <div className="space-y-1">
              <p className="text-xs font-mono text-primary uppercase tracking-widest">Nuestros valores</p>
              <h2 className="text-2xl font-serif tracking-tight">
                Lo que nos <span className="gradient-text">define</span>
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {VALUES.map(({ icon: Icon, titulo, descripcion }) => (
                <div key={titulo} className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-3 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-lg">{titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Equipo */}
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif tracking-tight">
                Quién está detrás de{" "}
                <span className="gradient-text">esta comunidad</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {FOUNDERS.map((f, i) => {
                const num = String(i + 1).padStart(2, "0");
                return (
                  <div
                    key={f.nombre}
                    className="relative rounded-xl border border-border bg-card p-6 shadow-soft space-y-4 group hover:border-primary/40 transition-colors"
                  >
                    <span className="absolute top-2 left-2 text-[10px] text-muted-foreground/40 font-mono">
                      {num}
                    </span>
                    <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-muted-foreground/20" />
                    <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-muted-foreground/20" />

                    <div className="mt-2 relative w-16 h-16 rounded-sm overflow-hidden bg-muted-foreground/10 border border-border/40 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={f.foto}
                        alt={f.nombre}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div>
                      <p className="font-serif">{f.nombre}</p>
                      <p className="text-xs text-primary font-mono mt-0.5">{f.titulo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cómo participar */}
          <div className="space-y-8">
            <div className="space-y-1">
              <p className="text-xs font-mono text-primary uppercase tracking-widest">Participa</p>
              <h2 className="text-2xl font-serif tracking-tight">
                Cómo formar parte de{" "}
                <span className="gradient-text">la comunidad</span>
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {PARTICIPAR.map(({ icon: Icon, titulo, descripcion, href, cta, externo }) => (
                <div
                  key={titulo}
                  className="group rounded-xl border border-border bg-card p-6 shadow-soft space-y-4 flex flex-col hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary/15 group-hover:scale-105">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-lg group-hover:text-primary transition-colors">{titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {descripcion}
                  </p>
                  {externo ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 min-h-[44px] text-sm font-medium text-primary hover:underline touch-manipulation"
                    >
                      {cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 min-h-[44px] text-sm font-medium text-primary hover:underline touch-manipulation"
                    >
                      {cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <JoinCommunityButton location="nosotros_cta" />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
