import { redirect } from "next/navigation";
import { getCommunitySession } from "@/lib/auth/community-session";
import {
  isProyectosDbConfigured,
  listProyectosByMember,
  listPublishedProyectos,
} from "@/lib/notion/proyectos";
import { MemberProjectsPanel } from "@/components/cuenta/MemberProjectsPanel";

export const revalidate = 0;

export default async function CuentaProyectosPage() {
  const session = getCommunitySession();
  if (!session) redirect("/login");

  const [proyectos, publishedProyectos] = await Promise.all([
    listProyectosByMember(session.memberId),
    listPublishedProyectos().catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-primary">Mi cuenta</p>
        <h1 className="font-serif text-2xl tracking-tight">Proyectos</h1>
        <p className="text-sm text-muted-foreground">
          Publica tus builds, edítalos y explora lo que otros miembros han compartido.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <MemberProjectsPanel
          initialProyectos={proyectos}
          publishedProyectos={publishedProyectos}
          configured={isProyectosDbConfigured()}
        />
      </section>
    </div>
  );
}
