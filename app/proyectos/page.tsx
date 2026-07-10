import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ProyectosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary">Proyectos</p>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
            Lo que la comunidad está <span className="gradient-text">construyendo</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Próximamente: proyectos abiertos, demos y colaboraciones de builders peruanos con Claude.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
