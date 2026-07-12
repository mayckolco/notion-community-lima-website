import { redirect } from "next/navigation";
import { getCommunitySession } from "@/lib/auth/community-session";
import { getMemberById } from "@/lib/notion/comunidad";
import { MemberSettingsPanel } from "@/components/cuenta/MemberSettingsPanel";

export default async function CuentaConfiguracionesPage() {
  const session = getCommunitySession();
  if (!session) redirect("/login");

  const member = await getMemberById(session.memberId);
  if (!member) redirect("/login?error=no_encontrado");

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-primary">Mi cuenta</p>
        <h1 className="font-serif text-2xl tracking-tight">Configuraciones</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tu cuenta, visibilidad en el mapa y accesos de la comunidad.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <MemberSettingsPanel member={member} />
      </section>
    </div>
  );
}
