import Link from "next/link";
import { Brain } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3 sm:col-span-1">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="font-black text-sm tracking-tight">
                AI First <span className="text-primary">Founders</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Comunidad de founders que construyen con inteligencia artificial.
              Cada martes, un builder comparte su experiencia.
            </p>
            <p className="text-xs font-mono text-primary/70 uppercase tracking-widest">
              Martes · 7:00 – 8:00 pm
            </p>
          </div>

          {/* Links */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
                Plataforma
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/postular"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Postular como speaker
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
                Comunidad
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.linkedin.com/company/ai-first-founders"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60 font-mono">
            © {year} AI First Founders. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
              Próximo martes disponible
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
