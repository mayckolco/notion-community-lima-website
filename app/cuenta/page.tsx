import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, PlayCircle } from "lucide-react";
import { getCommunitySession } from "@/lib/auth/community-session";
import { getMemberById } from "@/lib/notion/comunidad";
import { listPastSlotsWithRecordings } from "@/lib/notion/slots";
import {
  isProyectosDbConfigured,
  listProyectosByMember,
} from "@/lib/notion/proyectos";
import { isCommunityAdminEmail } from "@/lib/config/community-roles";
import { MemberProfileForm } from "@/components/cuenta/MemberProfileForm";
import { MemberProjectsPanel } from "@/components/cuenta/MemberProjectsPanel";

export default async function CuentaPage() {
  const session = getCommunitySession();
  if (!session) redirect("/login");

  const member = await getMemberById(session.memberId);
  if (!member) redirect("/login?error=no_encontrado");

  const [sessions, proyectos] = await Promise.all([
    listPastSlotsWithRecordings(),
    listProyectosByMember(session.memberId),
  ]);

  const isAdmin = isCommunityAdminEmail(session.email) || member.tipo === "admin";

  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg tracking-tight">
            Claude<span className="text-muted-foreground">Perú</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/comunidad" className="text-xs text-muted-foreground hover:text-foreground">
              Mapa
            </Link>
            {isAdmin && (
              <Link href="/cuenta/admin" className="text-xs text-primary hover:underline">
                Admin
              </Link>
            )}
            <form action="/api/comunidad/auth/logout" method="POST">
              <button
                type="submit"
                className="text-xs border border-border px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-primary">Mi cuenta</p>
          <h1 className="font-serif text-2xl tracking-tight">Hola, {member.nombre.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">
            Rol: <span className="text-foreground capitalize">{member.tipo}</span>
            {member.estado && (
              <>
                {" "}
                · Estado: <span className="text-foreground">{member.estado}</span>
              </>
            )}
          </p>
        </header>

        <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-serif text-lg">Tu perfil</h2>
          <MemberProfileForm member={member} />
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-serif text-lg">Sesiones y grabaciones</h2>
          <p className="text-sm text-muted-foreground">
            Charlas pasadas de la comunidad. Haz clic para ver la grabación.
          </p>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay grabaciones publicadas.</p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((sessionItem) => (
                <li
                  key={sessionItem.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{sessionItem.titulo ?? "Charla de la comunidad"}</p>
                    <p className="text-xs text-muted-foreground">
                      {sessionItem.fecha?.slice(0, 10)}
                      {sessionItem.speaker?.nombre ? ` · ${sessionItem.speaker.nombre}` : ""}
                    </p>
                  </div>
                  <a
                    href={sessionItem.grabacionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Ver grabación
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <MemberProjectsPanel
            initialProyectos={proyectos}
            configured={isProyectosDbConfigured()}
          />
        </section>
      </div>
    </main>
  );
}
