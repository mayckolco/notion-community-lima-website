"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Nosotros",   href: "/nosotros",    external: false },
  { label: "Directorio", href: "/directorio",  external: false },
  { label: "Calendario", href: "/calendario",  external: false },
  { label: "Comunidad",  href: "https://chat.whatsapp.com/CmU70iqgxWKBlFjKp37XLe", external: true },
  { label: "Aprende",    href: "https://www.skool.com/ai-first-founders-8064/about", external: true },
  { label: "Servicios",  href: "https://nucleo.la/", external: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 font-serif text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          </span>
          Claude <span className="text-muted-foreground">Perú</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" render={<Link href="/login" />}>
            Ingresar
          </Button>

          <button
            className="flex md:hidden items-center justify-center w-11 h-11 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-manipulation"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur">
          {NAV_LINKS.map(({ label, href, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center px-6 py-4 text-base text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-b border-border/60 last:border-0"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center px-6 py-4 text-base text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-b border-border/60 last:border-0"
              >
                {label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
