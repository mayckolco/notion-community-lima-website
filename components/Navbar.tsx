"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Eventos",   href: "/eventos" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Recursos",  href: "/recursos" },
];

const PROGRAMAS_LINKS = [
  { label: "Para profesionales", href: "/programas/profesionales" },
  { label: "Para empresas",      href: "/programas/empresas" },
];

const ABOUT_LINK = { label: "Sobre nosotros", href: "/nosotros" };

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [programasOpen, setProgramasOpen] = useState(false);
  const programasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!programasOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!programasRef.current?.contains(e.target as Node)) {
        setProgramasOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProgramasOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [programasOpen]);

  const closeAll = () => {
    setOpen(false);
    setProgramasOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          onClick={closeAll}
          className="flex items-center gap-2 font-serif text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground shrink-0">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="whitespace-nowrap">
            Claude<span className="ml-0.5 text-muted-foreground">Perú</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}

          <div ref={programasRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={programasOpen}
              onClick={() => setProgramasOpen((v) => !v)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Programas
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${programasOpen ? "rotate-180" : ""}`}
                strokeWidth={1.75}
              />
            </button>

            {programasOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-52 rounded-md border border-border/60 bg-background/95 backdrop-blur shadow-lg py-1"
              >
                {PROGRAMAS_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    role="menuitem"
                    href={href}
                    onClick={closeAll}
                    className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={ABOUT_LINK.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {ABOUT_LINK.label}
          </Link>
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
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={closeAll}
              className="block px-6 py-3.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors touch-manipulation"
            >
              {label}
            </Link>
          ))}

          <p className="px-6 pt-3.5 pb-1 text-xs uppercase tracking-widest text-muted-foreground/60">
            Programas
          </p>
          {PROGRAMAS_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={closeAll}
              className="block px-9 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors touch-manipulation"
            >
              {label}
            </Link>
          ))}

          <Link
            href={ABOUT_LINK.href}
            onClick={closeAll}
            className="block px-6 py-3.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors touch-manipulation"
          >
            {ABOUT_LINK.label}
          </Link>
        </div>
      )}
    </nav>
  );
}
