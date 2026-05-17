import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, PlayCircle } from "lucide-react";
import { getSpeakerById, getWebinarsBySpeakerId } from "@/lib/notion/speakers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function SpeakerDetailPage({ params }: PageProps) {
  const [speaker, webinars] = await Promise.all([
    getSpeakerById(params.id),
    getWebinarsBySpeakerId(params.id),
  ]);
  if (!speaker) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Back */}
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al directorio
          </Link>

          {/* Hero */}
          <div className="relative border border-border/60 bg-card p-8 flex flex-col sm:flex-row gap-8">
            <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-muted-foreground/20" />
            <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-muted-foreground/20" />

            {/* Photo */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-sm overflow-hidden flex-shrink-0 bg-muted self-center sm:self-start">
              {speaker.foto ? (
                <Image
                  src={speaker.foto}
                  alt={speaker.nombre}
                  fill
                  className="object-cover"
                  sizes="144px"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted-foreground/10 flex items-center justify-center">
                  <span className="text-4xl font-black text-muted-foreground/30">
                    {speaker.nombre.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4 flex-1 min-w-0">
              <div>
                <h1 className="text-3xl font-black tracking-tight">{speaker.nombre}</h1>
                {(speaker.rol || speaker.empresa) && (
                  <p className="text-sm text-primary font-mono mt-1">
                    {[speaker.rol, speaker.empresa].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              {speaker.herramientas.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {speaker.herramientas.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-mono border border-border/60 px-2 py-0.5 text-muted-foreground"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                {speaker.linkedin && (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border/60 px-3 py-1.5 transition-colors"
                  >
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {speaker.webinarUrl && (
                  <a
                    href={speaker.webinarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary/80 border border-primary/40 px-3 py-1.5 transition-colors"
                  >
                    Ver webinar
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {speaker.biografia && (
            <div className="border border-border/60 bg-card p-8 space-y-4">
              <p className="text-[10px] font-mono text-primary uppercase tracking-widest">
                Sobre {speaker.nombre.split(" ")[0]}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {speaker.biografia}
              </p>
            </div>
          )}

          {/* Webinars */}
          {webinars.length > 0 && (
            <div className="space-y-6">
              <p className="text-[10px] font-mono text-primary uppercase tracking-widest">
                Webinars
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {webinars.map((w, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  return (
                    <div
                      key={w.id}
                      className="relative border border-border/60 bg-card p-5 flex flex-col gap-3 group"
                    >
                      <span className="absolute top-2 left-2 text-[10px] text-muted-foreground/40 font-mono">
                        {num}
                      </span>
                      <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-muted-foreground/20" />
                      <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-muted-foreground/20" />

                      <div className="pt-3">
                        <p className="font-black text-sm leading-tight">{w.titulo}</p>
                      </div>

                      {w.herramientas.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {w.herramientas.map((tool) => (
                            <span
                              key={tool}
                              className="text-[10px] font-mono border border-border/60 px-2 py-0.5 text-muted-foreground"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      {w.webinarUrl && (
                        <div className="mt-auto pt-2 border-t border-border/30">
                          <a
                            href={w.webinarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                          >
                            <PlayCircle className="h-3 w-3" />
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
