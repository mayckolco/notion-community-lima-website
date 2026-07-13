import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";
import { FooterCTA } from "@/components/FooterCTA";
import {
  PROGRAMAS_EMPRESAS_LABEL,
  PROGRAMAS_EMPRESAS_PUBLIC,
} from "@/lib/content/constants";

const SITE_LINKS = [
  { label: "Eventos", href: "/eventos" },
  { label: "Comunidad", href: "/comunidad" },
  { label: "Recursos", href: "/recursos" },
  { label: "Programas para profesionales", href: "/programas/profesionales" },
  {
    label: PROGRAMAS_EMPRESAS_PUBLIC
      ? "Programas para empresas"
      : PROGRAMAS_EMPRESAS_LABEL,
    href: "/programas/empresas",
    comingSoon: !PROGRAMAS_EMPRESAS_PUBLIC,
  },
  { label: "Sobre nosotros", href: "/nosotros" },
];

const COMMUNITY_LINKS = [
  { label: "Mapa de la comunidad", href: "/comunidad", external: false },
  { label: "Aplicar como speaker", href: "/aplicar", external: false },
  {
    label: "Comunidad de WhatsApp",
    href: "https://chat.whatsapp.com/CvBaizXWjtZCstUgXlJqi3",
    external: true,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <FooterCTA />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground shrink-0">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              <span className="font-serif text-sm tracking-tight whitespace-nowrap">
                Claude<span className="ml-0.5 text-muted-foreground">Perú</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              La comunidad peruana que aprende, construye y comparte con Claude.
              Eventos, formaciones y recursos en español.
            </p>
            <SocialLinks />
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60">
              Explora
            </p>
            <ul className="space-y-2">
              {SITE_LINKS.map(({ label, href, comingSoon }) => (
                <li key={label}>
                  {comingSoon ? (
                    <span className="text-sm text-muted-foreground/50 cursor-not-allowed select-none">
                      {label}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60">
              Comunidad
            </p>
            <ul className="space-y-2">
              {COMMUNITY_LINKS.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
            © {year} Claude Perú. Comunidad independiente · Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-muted-foreground/60 max-w-lg mx-auto">
            Claude Perú es una comunidad independiente organizada por entusiastas.
            No está afiliada oficialmente a Anthropic. Claude es una marca de Anthropic, PBC.
          </p>
        </div>
      </div>
    </footer>
  );
}
