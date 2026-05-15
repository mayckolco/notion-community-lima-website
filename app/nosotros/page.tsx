import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const FOUNDERS = [
  {
    nombre: "Fundador 1",
    titulo: "Co-fundador · AI First Founders",
    bio: "Agrega aquí la bio del fundador, su experiencia y qué lo llevó a crear AI First Founders.",
  },
  {
    nombre: "Fundador 2",
    titulo: "Co-fundador · AI First Founders",
    bio: "Agrega aquí la bio del fundador, su experiencia y qué lo llevó a crear AI First Founders.",
  },
  {
    nombre: "Fundador 3",
    titulo: "Co-fundador · AI First Founders",
    bio: "Agrega aquí la bio del fundador, su experiencia y qué lo llevó a crear AI First Founders.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-20">

          {/* Hero */}
          <div className="space-y-6 max-w-2xl">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">Quiénes somos</p>
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              AI First <span className="text-primary">Founders</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Somos una comunidad de founders que construyen negocios usando inteligencia artificial
              como primer recurso. Cada martes de 7 a 8 pm, un builder comparte en vivo lo que está
              construyendo, qué herramientas usa y qué aprendió en el camino.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Creemos que la IA no es el futuro — es el presente. Nuestra misión es conectar a los
              founders que ya están construyendo con IA y ayudarlos a crecer más rápido compartiendo
              experiencias reales, errores incluidos.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-px border border-border/50 sm:grid-cols-3 bg-border/50">
            {[
              { value: "7–8 pm", label: "Cada martes" },
              { value: "100%", label: "Builders con IA" },
              { value: "0", label: "Teoría, solo práctica" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-card px-8 py-8 space-y-1">
                <p className="text-3xl font-black text-primary">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Founders */}
          <div className="space-y-8">
            <div className="space-y-1">
              <p className="text-xs font-mono text-primary uppercase tracking-widest">Equipo fundador</p>
              <h2 className="text-2xl font-black tracking-tight">
                Las personas detrás de <span className="text-primary">la comunidad</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {FOUNDERS.map((f, i) => {
                const num = String(i + 1).padStart(2, "0");
                return (
                  <div
                    key={f.nombre}
                    className="relative border border-border/60 bg-card p-6 space-y-4 group hover:border-primary/40 transition-colors"
                  >
                    <span className="absolute top-2 left-2 text-[10px] text-muted-foreground/40 font-mono">
                      {num}
                    </span>
                    <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-muted-foreground/20" />
                    <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-muted-foreground/20" />

                    {/* Photo placeholder */}
                    <div className="mt-2 w-16 h-16 rounded-sm bg-muted-foreground/10 border border-border/40 flex items-center justify-center">
                      <span className="text-xl font-black text-muted-foreground/30">
                        {f.nombre.charAt(0)}
                      </span>
                    </div>

                    <div>
                      <p className="font-black">{f.nombre}</p>
                      <p className="text-xs text-primary font-mono mt-0.5">{f.titulo}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.bio}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
