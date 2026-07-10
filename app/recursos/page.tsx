import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function RecursosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary">Recursos</p>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
            Guías, links y <span className="gradient-text">herramientas</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Estamos preparando una biblioteca de recursos para la comunidad. Vuelve pronto.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
