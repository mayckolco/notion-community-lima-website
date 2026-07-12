import { redirect } from "next/navigation";
import { getCommunitySession } from "@/lib/auth/community-session";
import { getMemberById } from "@/lib/notion/comunidad";
import { isCommunityAdminEmail } from "@/lib/config/community-roles";
import { CuentaNav } from "@/components/cuenta/CuentaNav";

export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getCommunitySession();
  if (!session) redirect("/login");

  const member = await getMemberById(session.memberId);
  if (!member) redirect("/login?error=no_encontrado");

  const isAdmin = isCommunityAdminEmail(session.email) || member.tipo === "admin";
  const firstName = member.nombre.split(" ")[0] ?? member.nombre;

  return (
    <main className="min-h-screen bg-background">
      <CuentaNav memberFirstName={firstName} isAdmin={isAdmin} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</div>
    </main>
  );
}
