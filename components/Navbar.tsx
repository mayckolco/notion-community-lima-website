import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Nosotros",   href: "/nosotros",    external: false },
  { label: "Directorio", href: "/directorio",  external: false },
  { label: "Comunidad",  href: "https://www.skool.com/ai-first-founders-8064/about", external: true },
  { label: "Aprende",    href: "https://www.skool.com/ai-first-founders-8064/about", external: true },
  { label: "Servicios",  href: "https://nucleo.la/", external: true },
];

export function Navbar() {
  return (
    <nav className="border-b border-border/50 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-black text-lg tracking-tight hover:opacity-80 transition-opacity">
          AI First <span className="text-primary">Founders</span>
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

        <Button size="sm" render={<Link href="/postular" />}>
          Postular
        </Button>
      </div>
    </nav>
  );
}
