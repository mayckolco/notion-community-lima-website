import { ArrowUpRight, Bot, Calendar, Database, Layout } from "lucide-react";

const NOTION_PRODUCTS = [
  {
    id: "notion-workspace",
    nombre: "Notion",
    tagline: "Tu workspace todo en uno",
    descripcion:
      "Docs, bases de datos, wikis y proyectos en un solo lugar. Ideal para organizar notas, procesos y conocimiento de tu equipo con total flexibilidad.",
    paraQuien: "Profesionales, equipos y founders que quieren un sistema propio sin depender de múltiples apps.",
    url: "https://notion.so",
    destacado: true,
    Icon: Layout,
  },
  {
    id: "notion-ai",
    nombre: "Notion AI",
    tagline: "IA dentro de tu workspace",
    descripcion:
      "Redacta, resume, traduce y organiza con IA directamente en tus páginas. Accede a búsqueda inteligente en todo tu workspace y genera contenido con contexto.",
    paraQuien: "Usuarios que quieren aprovechar la IA sin salir de su sistema de trabajo.",
    url: "https://notion.so/product/ai",
    Icon: Bot,
  },
  {
    id: "notion-calendar",
    nombre: "Notion Calendar",
    tagline: "Gestiona tu tiempo con contexto",
    descripcion:
      "Calendario integrado con tu workspace. Ve tus eventos junto a tus proyectos y tareas. Conecta con Google Calendar y mantén todo en un solo flujo.",
    paraQuien: "Personas que quieren unificar agenda y trabajo en Notion.",
    url: "https://notion.so/product/calendar",
    Icon: Calendar,
  },
  {
    id: "notion-api",
    nombre: "Notion API",
    tagline: "Integra Notion en tus productos",
    descripcion:
      "Conecta Notion con otras herramientas vía API. Automatiza flujos, sincroniza datos y construye integraciones con Make, Zapier o código propio.",
    paraQuien: "Builders que quieren usar Notion como base de datos o backend de sus automatizaciones.",
    url: "https://developers.notion.com",
    Icon: Database,
  },
] as const;

export function ClaudeProductsSection() {
  return (
    <section aria-labelledby="products-heading" className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-primary">Productos</p>
          <h2 id="products-heading" className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
            El ecosistema <span className="gradient-text">Notion</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Cuatro formas de usar Notion según tu perfil: organizar, automatizar, integrar o escalar.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {NOTION_PRODUCTS.map((product) => {
            const Icon = product.Icon;
            return (
              <a
                key={product.id}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${product.nombre}: ${product.tagline} (abre en nueva pestaña)`}
                className={`group rounded-xl border bg-card p-6 shadow-soft space-y-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-clay touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${
                  product.destacado ? "border-primary/30" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-110">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg group-hover:text-primary transition-colors">
                    {product.nombre}
                  </h3>
                  <p className="text-xs font-medium text-primary">{product.tagline}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.descripcion}
                  </p>
                  <p className="text-xs text-muted-foreground/80 pt-1">
                    <span className="font-medium text-foreground/70">Para:</span>{" "}
                    {product.paraQuien}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
