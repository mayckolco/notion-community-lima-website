"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const BASE_NAV_ITEMS = [
  { href: "/cuenta/perfil", label: "Perfil" },
  { href: "/cuenta/sesiones", label: "Sesiones" },
  { href: "/cuenta/proyectos", label: "Proyectos" },
  { href: "/cuenta/comunidad", label: "Comunidad" },
  { href: "/cuenta/configuraciones", label: "Configuraciones" },
] as const;

interface CuentaNavProps {
  memberFirstName: string;
  isAdmin: boolean;
}

export function CuentaNav({ memberFirstName, isAdmin }: CuentaNavProps) {
  const pathname = usePathname();
  const navItems = isAdmin
    ? [...BASE_NAV_ITEMS, { href: "/cuenta/admin", label: "Admin" }]
    : BASE_NAV_ITEMS;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="font-serif text-lg tracking-tight shrink-0">
            Claude<span className="text-muted-foreground">Perú</span>
          </Link>
          <p className="hidden sm:block text-xs text-muted-foreground truncate">
            Hola, {memberFirstName}
          </p>
        </div>
      </nav>

      <div className="border-b border-border/60 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div
            className="flex gap-1 overflow-x-auto py-2 -mx-1 px-1 scrollbar-none"
            role="tablist"
            aria-label="Secciones de mi cuenta"
          >
            {navItems.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  role="tab"
                  aria-selected={active}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors touch-manipulation",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
