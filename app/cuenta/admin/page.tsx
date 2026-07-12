import { redirect } from "next/navigation";
import Link from "next/link";
import { getCommunitySession } from "@/lib/auth/community-session";
import { isCommunityAdminEmail } from "@/lib/config/community-roles";
import { listAllComunidadMembers } from "@/lib/notion/comunidad";
import { listAllProyectos } from "@/lib/notion/proyectos";
import { listPastSlotsWithRecordings } from "@/lib/notion/slots";
import { CommunityAdminPanel } from "@/components/cuenta/CommunityAdminPanel";

export default async function CuentaAdminPage() {
  const session = getCommunitySession();
  if (!session) redirect("/login");
  if (!isCommunityAdminEmail(session.email)) redirect("/cuenta");

  const [members, proyectos, sessions] = await Promise.all([
    listAllComunidadMembers(),
    listAllProyectos(),
    listPastSlotsWithRecordings(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg tracking-tight">
            Claude<span className="text-muted-foreground">Perú</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/cuenta" className="text-xs text-muted-foreground hover:text-foreground">
              Mi cuenta
            </Link>
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
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
    </main>
  );
}
