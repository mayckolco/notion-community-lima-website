import Image from "next/image";
import { Target, Users, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const VALUES = [
  {
    icon: <Target className="h-6 w-6 text-primary" />,
    titulo: "Builders que ejecutan",
    descripcion:
      "No teoría. Cada sesión es un caso real: qué se construyó, con qué herramientas y qué salió mal. Aprendizajes que se pueden aplicar el mismo día.",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    titulo: "Comunidad primero",
    descripcion:
      "La red que construyes con otros founders vale tanto como el contenido. Conectamos a personas que ya están usando IA para crecer, no a las que hablan de usarla.",
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    titulo: "IA como primer recurso",
    descripcion:
      "No como ayuda, como base. Todos los que participan aquí ya tomaron la decisión de construir diferente. Eso cambia el nivel de la conversación.",
  },
];

const FOUNDERS: { nombre: string; titulo: string; bio: string; foto?: string }[] = [
  {
    nombre: "Javier Flores",
    titulo: "Co-fundador · Claude Perú",
    bio: "",
    foto: "/founders/javier-flores.jpeg",
  },
  {
    nombre: "Mayckol Cruzado",
    titulo: "Co-fundador · Claude Perú",
    bio: "",
    foto: "/founders/mayckol-cruzado.jpeg",
  },
  {
    nombre: "Ignacio Velásquez",
    titulo: "Co-fundador · Claude Perú",
    bio: "",
    foto: "/founders/ignacio-velasquez.jpeg",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-20">

          {/* Hero */}
          <div className="space-y-6">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">Quiénes somos</p>
            <h1 className="text-5xl font-serif tracking-tight leading-tight">
              Claude<span className="ml-0.5 gradient-text">Perú</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Somos una comunidad de founders que construyen negocios usando inteligencia artificial
              como primer recurso. Cada semana, un builder comparte en vivo lo que está
              construyendo, qué herramientas usa y qué aprendió en el camino.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Creemos que la IA no es el futuro, es el presente. Nuestra misión es conectar a los
              founders que ya están construyendo con IA y ayudarlos a crecer más rápido compartiendo
              experiencias reales, errores incluidos.
            </p>
          </div>

          {/* Valores */}
          <div className="space-y-8">
            <div className="space-y-1">
              <p className="text-xs font-mono text-primary uppercase tracking-widest">Nuestros valores</p>
              <h2 className="text-2xl font-serif tracking-tight">
                Lo que nos <span className="gradient-text">define</span>
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.titulo} className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                    {v.icon}
                  </div>
                  <h3 className="font-serif text-lg">{v.titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

{/* Founders */}
          <div className="space-y-8">
            <div className="space-y-1">
              <p className="text-xs font-mono text-primary uppercase tracking-widest">Equipo fundador</p>
              <h2 className="text-2xl font-serif tracking-tight">
                Las personas detrás de <span className="gradient-text">la comunidad</span>
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

                    {/* Photo */}
                    <div className="mt-2 relative w-16 h-16 rounded-sm overflow-hidden bg-muted-foreground/10 border border-border/40 flex items-center justify-center flex-shrink-0">
                      {f.foto ? (
                        <Image
                          src={f.foto}
                          alt={f.nombre}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <span className="text-xl font-serif text-muted-foreground/30">
                          {f.nombre.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-serif">{f.nombre}</p>
                      <p className="text-xs text-primary font-mono mt-0.5">{f.titulo}</p>
                    </div>
                    {f.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.bio}</p>
                    )}
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
