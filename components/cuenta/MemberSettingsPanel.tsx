import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { ComunidadMemberRecord } from "@/lib/notion/comunidad";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/content/constants";

interface MemberSettingsPanelProps {
  member: ComunidadMemberRecord;
}

export function MemberSettingsPanel({ member }: MemberSettingsPanelProps) {
  const visibleOnMap = member.estado === "Publicado";

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-medium">Cuenta</h3>
        <dl className="grid gap-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 rounded-lg border border-border p-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{member.email}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 rounded-lg border border-border p-4">
            <dt className="text-muted-foreground">Rol en la comunidad</dt>
            <dd className="font-medium capitalize">{member.tipo}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 rounded-lg border border-border p-4">
            <dt className="text-muted-foreground">Visibilidad en el mapa</dt>
            <dd className="font-medium">
              {visibleOnMap ? "Visible para otros miembros" : "No publicado aún"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Comunidad</h3>
        <a
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 text-sm font-medium rounded-md border border-border hover:bg-muted/50 transition-colors"
        >
          <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
          Comunidad de WhatsApp
        </a>
      </section>

      <section className="space-y-3 pt-2 border-t border-border/60">
        <h3 className="text-sm font-medium">Sesión</h3>
        <p className="text-sm text-muted-foreground">
          Cierra sesión en este dispositivo. Podrás volver a ingresar con tu email.
        </p>
        <form action="/api/comunidad/auth/logout" method="POST">
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
        <p className="text-xs text-muted-foreground">
          ¿Necesitas actualizar tu perfil?{" "}
          <Link href="/cuenta/perfil" className="text-primary hover:underline">
            Ir a Perfil
          </Link>
        </p>
      </section>
    </div>
  );
}
