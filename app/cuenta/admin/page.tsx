import { redirect } from "next/navigation";
import { getCommunitySession } from "@/lib/auth/community-session";
import { isCommunityAdminEmail } from "@/lib/config/community-roles";
import { listAllComunidadMembers } from "@/lib/notion/comunidad";
import { listAllProyectos } from "@/lib/notion/proyectos";
import { listPastSlotsWithRecordings } from "@/lib/notion/slots";
import { CommunityAdminPanel } from "@/components/cuenta/CommunityAdminPanel";

export default async function CuentaAdminPage() {
  const session = getCommunitySession();
  if (!session) redirect("/login");
  if (!isCommunityAdminEmail(session.email)) redirect("/cuenta/perfil");

  const [members, proyectos, sessions] = await Promise.all([
    listAllComunidadMembers(),
    listAllProyectos(),
    listPastSlotsWithRecordings(),
  ]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-primary">Admin comunidad</p>
        <h1 className="font-serif text-2xl tracking-tight">Panel de administración</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona miembros, proyectos y revisa las sesiones publicadas.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
        <h2 className="font-serif text-lg">Sesiones ({sessions.length})</h2>
        <ul className="space-y-2">
          {sessions.map((sessionItem) => (
            <li key={sessionItem.id} className="text-sm flex justify-between gap-3">
              <span>{sessionItem.titulo ?? "Charla"}</span>
              <a
                href={sessionItem.grabacionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline shrink-0"
              >
                Grabación
              </a>
            </li>
          ))}
        </ul>
      </section>

      <CommunityAdminPanel initialMembers={members} initialProyectos={proyectos} />
    </div>
  );
}
