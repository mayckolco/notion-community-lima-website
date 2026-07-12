import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ExternalLink, PlayCircle } from "lucide-react";
import type { PastSlotRecord } from "@/lib/notion/slots";

interface MemberSessionsListProps {
  sessions: PastSlotRecord[];
}

export function MemberSessionsList({ sessions }: MemberSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay grabaciones publicadas.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {sessions.map((sessionItem) => {
        const dateLabel = sessionItem.fecha
          ? format(parseISO(sessionItem.fecha), "EEEE d MMM yyyy", { locale: es })
          : null;

        return (
          <li
            key={sessionItem.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-border p-4"
          >
            <div className="space-y-1">
              <p className="font-medium">
                {sessionItem.titulo ?? "Charla de la comunidad"}
              </p>
              <p className="text-xs text-muted-foreground">
                {dateLabel}
                {sessionItem.speaker?.nombre ? ` · ${sessionItem.speaker.nombre}` : ""}
              </p>
            </div>
            <a
              href={sessionItem.grabacionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline shrink-0"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Ver grabación
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
