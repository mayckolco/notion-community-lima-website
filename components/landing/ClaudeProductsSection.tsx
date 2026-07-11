import { ArrowUpRight, Bot, Code2, Terminal } from "lucide-react";
import { CLAUDE_PRODUCTS } from "@/lib/content/claude-products";

const PRODUCT_ICONS = {
  "claude-app": Bot,
  "claude-code": Terminal,
  "claude-api": Code2,
} as const;

export function ClaudeProductsSection() {
  return (
    <section aria-labelledby="products-heading" className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-primary">Productos</p>
          <h2 id="products-heading" className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
            El ecosistema <span className="gradient-text">Claude</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Tres formas de usar Claude según tu perfil: conversar, programar o integrar en productos.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CLAUDE_PRODUCTS.map((product) => {
            const Icon = PRODUCT_ICONS[product.id as keyof typeof PRODUCT_ICONS] ?? Bot;
            return (
              <a
                key={product.id}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${product.nombre} — ${product.tagline} (abre en nueva pestaña)`}
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
