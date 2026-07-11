import { ArrowUpRight, Star } from "lucide-react";
import type { Proyecto } from "@/lib/content/proyectos";

interface ProyectoCardProps {
  proyecto: Proyecto;
  index: number;
}

export function ProyectoCard({ proyecto, index }: ProyectoCardProps) {
  const num = String(index + 1).padStart(2, "0");
  const primaryUrl = proyecto.url ?? proyecto.github;

  return (
    <article
      className={`relative rounded-xl border bg-card p-6 shadow-soft space-y-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 ${
        proyecto.destacado ? "border-primary/30" : "border-border"
      }`}
    >
      <span className="absolute top-3 left-3 text-[10px] text-muted-foreground/40 font-mono">
        {num}
      </span>

      {proyecto.destacado && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-primary font-mono uppercase tracking-wider">
          <Star className="h-3 w-3 fill-primary" />
          Destacado
        </span>
      )}

      <div className="pt-4 space-y-2">
        <h3 className="font-serif text-lg leading-snug">{proyecto.nombre}</h3>
        <p className="text-xs text-muted-foreground">por {proyecto.autor}</p>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {proyecto.descripcion}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {proyecto.stack.map((tech) => (
          <span
            key={tech}
            className="text-[10px] font-mono rounded-full border border-border px-2 py-0.5 text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-2">
        {proyecto.url && (
          <a
            href={proyecto.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline touch-manipulation"
          >
            Ver proyecto
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
        {proyecto.github && (
          <a
            href={proyecto.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        )}
        {!primaryUrl && (
          <span className="text-xs text-muted-foreground/60 italic">Próximamente</span>
        )}
      </div>
    </article>
  );
}
