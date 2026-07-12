import Link from "next/link";
import { MapPin } from "lucide-react";
import { listComunidadMembersWithProyectos } from "@/lib/notion/comunidad";
import { CommunityMap } from "@/components/comunidad/CommunityMap";
import { CommunityMemberCard } from "@/components/comunidad/CommunityMemberCard";

export const revalidate = 0;

export default async function CuentaComunidadPage() {
  const members = await listComunidadMembersWithProyectos();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-primary">Mi cuenta</p>
        <h1 className="font-serif text-2xl tracking-tight">Comunidad</h1>
        <p className="text-sm text-muted-foreground">
          Explora el mapa y conoce a otros miembros de Claude Perú.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {members.length > 0
              ? `${members.length} ${members.length === 1 ? "miembro visible" : "miembros visibles"}`
              : "Aún no hay miembros publicados en el mapa"}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Perú y Latinoamérica
          </div>
        </div>
        <CommunityMap members={members} />
      </section>

      {members.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-serif text-lg">Miembros de la comunidad</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {members.map((member) => (
              <CommunityMemberCard key={member.id} member={member} />
            ))}
          </ul>
        </section>
      )}

      <p className="text-sm text-muted-foreground">
        ¿Quieres actualizar tu ubicación?{" "}
        <Link href="/cuenta/perfil" className="text-primary hover:underline">
          Edita tu perfil
        </Link>
      </p>
    </div>
  );
}
