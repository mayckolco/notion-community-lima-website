import { Lock } from "lucide-react";
import { CommunityAccountLink } from "@/components/CommunityAccountLink";
import { CommunityMemberCard } from "@/components/comunidad/CommunityMemberCard";
import type { ComunidadMember } from "@/lib/notion/comunidad";

const PLACEHOLDER_COUNT = 6;

function LockedMemberPlaceholder({ index }: { index: number }) {
  return (
    <li
      aria-hidden="true"
      className="rounded-xl border border-border bg-card p-5 shadow-soft space-y-4 select-none pointer-events-none"
    >
      <div className="space-y-2">
        <div className="h-6 w-3/4 rounded bg-muted/80" />
        <div className="h-3 w-1/2 rounded bg-primary/20" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-2/3 rounded bg-muted/60" />
        <div className="h-4 w-1/2 rounded bg-muted/60" />
        <div className="h-4 w-3/5 rounded bg-muted/60" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="h-9 w-9 rounded-md bg-muted/50" />
        <div className="h-9 w-9 rounded-md bg-muted/50" />
        <span className="sr-only">Tarjeta de miembro {index + 1} bloqueada</span>
      </div>
    </li>
  );
}

interface CommunityMembersSectionProps {
  members: ComunidadMember[];
  isLoggedIn: boolean;
}

export function CommunityMembersSection({
  members,
  isLoggedIn,
}: CommunityMembersSectionProps) {
  if (members.length === 0) return null;

  if (isLoggedIn) {
    return (
      <section className="space-y-4" aria-labelledby="lista-comunidad">
        <h2 id="lista-comunidad" className="font-serif text-xl tracking-tight">
          Miembros de la comunidad
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <CommunityMemberCard key={member.id} member={member} />
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-labelledby="lista-comunidad">
      <h2 id="lista-comunidad" className="font-serif text-xl tracking-tight">
        Miembros de la comunidad
      </h2>

      <div className="relative rounded-xl overflow-hidden">
        <ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 blur-sm opacity-60"
          aria-hidden="true"
        >
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
            <LockedMemberPlaceholder key={index} index={index} />
          ))}
        </ul>

        <div className="absolute inset-0 flex items-center justify-center bg-background/55 backdrop-blur-[2px] p-6">
          <div className="max-w-md w-full rounded-xl border border-border bg-card/95 p-6 sm:p-8 shadow-soft text-center space-y-4">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg tracking-tight">
                Directorio exclusivo para miembros
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Inicia sesión o regístrate para ver los perfiles, roles y enlaces de contacto de
                las personas que forman parte de Claude Perú.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <CommunityAccountLink
                href="/login"
                loggedInHref="/cuenta/comunidad"
                className="inline-flex items-center justify-center min-h-[44px] px-5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors touch-manipulation"
              >
                Ingresar a mi cuenta
              </CommunityAccountLink>
              <CommunityAccountLink
                href="/login"
                loggedInHref="/cuenta/comunidad"
                className="inline-flex items-center justify-center min-h-[44px] px-5 text-sm font-medium rounded-md border border-border hover:bg-muted/50 transition-colors touch-manipulation"
              >
                Registrarme
              </CommunityAccountLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
