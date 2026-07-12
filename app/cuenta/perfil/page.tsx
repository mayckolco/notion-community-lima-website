import { redirect } from "next/navigation";
import { getCommunitySession } from "@/lib/auth/community-session";
import { getMemberById } from "@/lib/notion/comunidad";
import { MemberProfileForm } from "@/components/cuenta/MemberProfileForm";

export default async function CuentaPerfilPage() {
  const session = getCommunitySession();
  if (!session) redirect("/login");

  const member = await getMemberById(session.memberId);
  if (!member) redirect("/login?error=no_encontrado");

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-primary">Mi cuenta</p>
        <h1 className="font-serif text-2xl tracking-tight">Tu perfil</h1>
        <p className="text-sm text-muted-foreground">
          Actualiza cómo te ven otros miembros en el mapa y en la comunidad.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
        <h2 className="font-serif text-lg">Datos personales</h2>
        <MemberProfileForm member={member} />
      </section>
    </div>
  );
}
