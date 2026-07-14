import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Globe, Mail, PlayCircle } from "lucide-react";
import { getSpeakerBySlug, getWebinarsBySpeakerId } from "@/lib/notion/speakers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/seo/json-ld";

export const revalidate = 0;

interface PageProps {
  params: { slug: string };
}

const SLUG_RE = /^[a-z0-9-]{2,100}$/;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!SLUG_RE.test(params.slug)) return {};

  const speaker = await getSpeakerBySlug(params.slug);
  if (!speaker) return {};

  const description =
    speaker.biografia ??
    `Speaker de Notion Lima${speaker.rol ? ` · ${speaker.rol}` : ""}${speaker.empresa ? ` en ${speaker.empresa}` : ""}.`;

  return createPageMetadata({
    title: speaker.nombre,
    description,
    path: `/directorio/${speaker.slug}`,
  });
}

export default async function SpeakerDetailPage({ params }: PageProps) {
  if (!SLUG_RE.test(params.slug)) notFound();

  const speaker = await getSpeakerBySlug(params.slug);
  if (!speaker) notFound();
  const webinars = await getWebinarsBySpeakerId(speaker.id);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Directorio", path: "/directorio" },
            { name: speaker.nombre, path: `/directorio/${speaker.slug}` },
          ]),
          personJsonLd(speaker),
        ]}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">

          {/* Back */}
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al directorio
          </Link>

          {/* Hero */}
          <div className="relative rounded-xl border border-border bg-card p-5 sm:p-8 shadow-soft flex flex-col sm:flex-row gap-6 sm:gap-8">
            <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-muted-foreground/20" />
            <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-muted-foreground/20" />

            {/* Photo */}
            <div className="group/photo relative w-28 h-28 sm:w-36 sm:h-36 rounded-lg overflow-hidden flex-shrink-0 bg-muted self-center sm:self-start border border-border transition-all duration-300 hover:border-primary/40 hover:shadow-clay">
              {speaker.foto ? (
                <>
                  <Image
                    src={speaker.foto}
                    alt={speaker.nombre}
                    fill
                    className="object-cover transition-all duration-300 grayscale group-hover/photo:grayscale-0 group-hover/photo:scale-105"
                    sizes="144px"
                    priority
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover/photo:bg-primary/10 transition-colors duration-300 pointer-events-none" />
                </>
              ) : (
                <div className="w-full h-full bg-muted-foreground/10 flex items-center justify-center">
                  <span className="text-4xl font-serif text-muted-foreground/30">
                    {speaker.nombre.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 min-w-0 gap-4">
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-serif tracking-tight">{speaker.nombre}</h1>
                  {(speaker.rol || speaker.empresa) && (
                    <p className="text-sm text-primary font-mono mt-1">
                      {[speaker.rol, speaker.empresa].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>

                {(speaker.linkedin || speaker.web || speaker.email) && (
                  <div className="flex flex-wrap items-center gap-3">
                    {speaker.linkedin && (
                      <a
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {speaker.web && (
                      <a
                        href={speaker.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Sitio web"
                        className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                      >
                        <Globe className="h-4 w-4" strokeWidth={1.75} />
                      </a>
                    )}
                    {speaker.email && (
                      <a
                        href={`mailto:${speaker.email}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                        {speaker.email}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {speaker.descripcion && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {speaker.descripcion}
                </p>
              )}
            </div>
          </div>

          {/* Webinars */}
          {webinars.length > 0 && (
            <div className="space-y-6">
              <p className="text-[10px] font-mono text-primary uppercase tracking-widest">
                Webinars
              </p>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {webinars.map((w, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  return (
                    <div
                      key={w.id}
                      className="relative rounded-xl border border-border bg-card p-5 shadow-soft flex flex-col gap-3 group transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-clay"
                    >
                      <span className="absolute top-2 left-2 text-[10px] text-muted-foreground/40 font-mono">
                        {num}
                      </span>
                      <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-muted-foreground/20 group-hover:border-primary/50 transition-colors duration-300" />
                      <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-muted-foreground/20 group-hover:border-primary/50 transition-colors duration-300" />

                      <div className="pt-3">
                        <p className="font-serif text-sm leading-tight group-hover:text-primary transition-colors duration-300">{w.titulo}</p>
                      </div>

                      {w.herramientas.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {w.herramientas.map((tool) => (
                            <span
                              key={tool}
                              className="text-[10px] font-mono border border-border/60 px-2 py-0.5 text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-all duration-300"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      {w.grabacionUrl && (
                        <div className="mt-auto pt-2 border-t border-border group-hover:border-primary/20 transition-colors duration-300">
                          <a
                            href={w.grabacionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 shadow-clay hover:opacity-90 transition-opacity"
                          >
                            <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
                            Ver grabación
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
