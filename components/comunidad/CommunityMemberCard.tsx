import { Mail, MapPin, Briefcase, FolderGit2 } from "lucide-react";
import type { ComunidadMember } from "@/lib/notion/comunidad";

interface CommunityMemberCardProps {
  member: ComunidadMember;
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.777 13.019H3.555V9h3.559v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function formatLocation(member: ComunidadMember): string | null {
  const parts = [member.ciudad, member.pais].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export function CommunityMemberCard({ member }: CommunityMemberCardProps) {
  const location = formatLocation(member);

  return (
    <li className="rounded-xl border border-border bg-card p-5 shadow-soft space-y-4">
      <div className="space-y-1">
        <p className="font-serif text-lg leading-tight">{member.nombre}</p>
        {member.rol && (
          <p className="text-xs text-primary font-mono uppercase tracking-wide">{member.rol}</p>
        )}
      </div>

      <dl className="space-y-2 text-sm">
        {member.empresa && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            <dd>{member.empresa}</dd>
          </div>
        )}
        {location && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            <dd>{location}</dd>
          </div>
        )}
        <div className="flex items-start gap-2 text-muted-foreground">
          <FolderGit2 className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <dd>
            {member.proyectosPublicados === 0
              ? "Sin proyectos publicados"
              : `${member.proyectosPublicados} ${
                  member.proyectosPublicados === 1
                    ? "proyecto publicado"
                    : "proyectos publicados"
                }`}
          </dd>
        </div>
      </dl>

      <div className="flex items-center gap-2 pt-1">
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub de ${member.nombre}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <GitHubIcon />
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn de ${member.nombre}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <LinkedInIcon />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            aria-label={`Email de ${member.nombre}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} />
          </a>
        )}
        {!member.github && !member.linkedin && !member.email && (
          <span className="text-xs text-muted-foreground">Sin enlaces de contacto</span>
        )}
      </div>
    </li>
  );
}
