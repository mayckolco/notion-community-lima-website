import { BookOpen } from "lucide-react";

export function WhatIsClaudeSection() {
  return (
    <section aria-labelledby="what-is-notion-heading" className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary">¿Qué es Notion?</p>
          <h2 id="what-is-notion-heading" className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
            Tu workspace todo en uno con{" "}
            <span className="gradient-text">IA integrada</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Notion es una plataforma que combina notas, bases de datos, proyectos y wikis
            en un solo lugar. Con Notion AI puedes redactar, resumir, traducir y organizar
            información de forma inteligente sin salir de tu workspace.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            A diferencia de otras herramientas, Notion se adapta a tu forma de trabajar:
            desde listas de tareas personales hasta sistemas operativos completos para
            equipos y empresas. Cada vez más profesionales en Lima lo usan como base
            para organizar su trabajo, proyectos y conocimiento.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="font-serif text-lg">¿Por qué Notion en Lima?</p>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              Comunidad local que comparte sistemas reales, no templates genéricos.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              Aprende de casos concretos: equipos, freelancers y founders que ya operan en Notion.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              Eventos mensuales en Lima para ver demos en vivo y conectar con otros usuarios.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
