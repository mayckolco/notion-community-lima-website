import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CommunityAccountLink } from "@/components/CommunityAccountLink";
import { SpeakerPortalLink } from "@/components/SpeakerPortalLink";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ProyectoCard } from "@/components/ProyectoCard";
import { PROYECTOS_COMUNIDAD, type Proyecto } from "@/lib/content/proyectos";
import { listPublishedProyectos } from "@/lib/notion/proyectos";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = createPageMetadata({
  title: "Proyectos",
  description:
    "Proyectos y demos construidos por la comunidad Claude Perú con Claude, Claude Code y la API.",
  path: "/proyectos",
});

function notionToProyecto(
  proyecto: Awaited<ReturnType<typeof listPublishedProyectos>>[number]
): Proyecto {
  return {
    id: proyecto.id,
    nombre: proyecto.nombre,
    descripcion: proyecto.descripcion,
    stack: proyecto.stack,
    url: proyecto.url ?? undefined,
    github: proyecto.github ?? undefined,
    autor: proyecto.autor || "Builder de la comunidad",
  };
}

export default async function ProyectosPage() {
  const notionProyectos = await listPublishedProyectos().catch(() => []);
  const merged = [
    ...notionProyectos.map(notionToProyecto),
    ...PROYECTOS_COMUNIDAD.filter(
      (staticProyecto) => !notionProyectos.some((p) => p.nombre === staticProyecto.nombre)
    ),
  ];

  const destacados = merged.filter((p) => p.destacado);
  const resto = merged.filter((p) => !p.destacado);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Proyectos", path: "/proyectos" },
        ])}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-primary">Proyectos</p>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
              Lo que la comunidad está{" "}
              <span className="gradient-text">construyendo</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Demos, herramientas y productos reales creados por builders peruanos
              con Claude. Inspírate y comparte el tuyo.
            </p>
          </div>

          {destacados.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-xl tracking-tight">Destacados</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {destacados.map((proyecto, i) => (
                  <ProyectoCard key={proyecto.id} proyecto={proyecto} index={i} />
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6">
            <h2 className="font-serif text-xl tracking-tight">Todos los proyectos</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {resto.map((proyecto, i) => (
                <ProyectoCard
                  key={proyecto.id}
                  proyecto={proyecto}
                  index={destacados.length + i}
                />
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-primary/25 bg-card p-8 sm:p-10 text-center space-y-5">
            <h2 className="font-serif text-2xl tracking-tight">
              ¿Tienes un proyecto con Claude?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Compártelo en la comunidad de WhatsApp o postula para mostrarlo en un webinar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <CommunityAccountLink
                loggedInHref="/cuenta/proyectos"
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity touch-manipulation"
              >
                Subir mi proyecto
              </CommunityAccountLink>
              <SpeakerPortalLink
                href="/aplicar"
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 text-sm font-semibold border border-border rounded-md hover:bg-muted/30 transition-colors touch-manipulation"
              >
                Aplicar como speaker
                <ArrowRight className="h-4 w-4" />
              </SpeakerPortalLink>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
