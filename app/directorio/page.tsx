import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PastSpeakerCard } from "@/components/PastSpeakerCard";
import { listDirectorySpeakers } from "@/lib/notion/speakers";

export const revalidate = 0;

export default async function DirectorioPage() {
  const speakers = await listDirectorySpeakers();

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-10">

          <div className="space-y-2">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">Speakers</p>
            <h1 className="text-4xl font-black tracking-tight">
              Directorio de <span className="text-primary">speakers</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Todos los speakers que han compartido su experiencia construyendo con IA en nuestra comunidad.
            </p>
          </div>

          {speakers.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-card p-12 text-center space-y-3">
              <p className="text-lg font-semibold">Aún no hay speakers registrados</p>
              <p className="text-sm text-muted-foreground">
                Vuelve pronto — cada martes se suma un nuevo builder.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {speakers.map((speaker, i) => (
                <PastSpeakerCard key={speaker.id} speaker={speaker} index={i} />
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
