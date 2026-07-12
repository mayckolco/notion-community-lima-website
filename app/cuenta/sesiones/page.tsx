import { listPastSlotsWithRecordings } from "@/lib/notion/slots";
import { MemberSessionsList } from "@/components/cuenta/MemberSessionsList";

export const revalidate = 0;

export default async function CuentaSesionesPage() {
  const sessions = await listPastSlotsWithRecordings().catch(() => []);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-primary">Mi cuenta</p>
        <h1 className="font-serif text-2xl tracking-tight">Sesiones</h1>
        <p className="text-sm text-muted-foreground">
          Grabaciones de charlas pasadas de la comunidad. Revive los webinars con casos reales.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
        <h2 className="font-serif text-lg">Grabaciones disponibles</h2>
        <MemberSessionsList sessions={sessions} />
      </section>
    </div>
  );
}
