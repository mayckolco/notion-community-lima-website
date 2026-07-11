import { Sparkles } from "lucide-react";

export function WhatIsClaudeSection() {
  return (
    <section aria-labelledby="what-is-claude-heading" className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary">¿Qué es Claude?</p>
          <h2 id="what-is-claude-heading" className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
            El asistente de IA de{" "}
            <span className="gradient-text">Anthropic</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Claude es un modelo de lenguaje diseñado para ser útil, honesto y seguro.
            Puede redactar textos, analizar documentos, escribir código, razonar sobre
            problemas complejos y actuar como agente en flujos de trabajo reales.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            A diferencia de un buscador, Claude mantiene conversaciones, entiende contexto
            y puede trabajar con archivos, herramientas y APIs — ideal para profesionales
            y builders en Perú que quieren resultados concretos, no solo respuestas genéricas.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="font-serif text-lg">¿Por qué importa en Perú?</p>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              Acceso en español para tareas de trabajo, estudio y emprendimiento.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              Comunidad local que comparte casos reales — no tutoriales traducidos.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              Eventos semanales con builders peruanos que ya usan Claude en producción.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
