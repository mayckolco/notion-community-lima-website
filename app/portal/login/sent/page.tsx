import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function PortalLoginSentPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center">
              <span className="text-primary text-xl">✉</span>
            </div>
            <h1 className="text-2xl font-serif tracking-tight">Revisa tu correo</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si tu email está registrado como speaker, te enviamos un link de acceso.
              Expira en <strong className="text-foreground">15 minutos</strong>.
            </p>
          </div>

          <div className="border border-border/50 bg-card p-5 text-left space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Qué hacer si no llega
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Revisa la carpeta de spam o promociones</li>
              <li>Asegúrate de usar el email con el que aplicaste</li>
              <li>Espera hasta 2 minutos antes de reintentar</li>
            </ul>
          </div>

          <Button variant="outline" render={<Link href="/portal/login" />} className="w-full">
            Volver e intentar de nuevo
          </Button>
        </div>
      </section>
    </main>
  );
}
