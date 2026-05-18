import Link from "next/link";
import { AlertCircle, Clock, CalendarX, ServerCrash } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: { error?: string };
}

const ERRORS: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  cta: string;
  href: string;
}> = {
  link_expirado: {
    icon: Clock,
    title: "Link expirado",
    body: "El link de verificación venció (tiene validez de 24 horas). Vuelve a postularte para recibir uno nuevo.",
    cta: "Postularme de nuevo",
    href: "/postular",
  },
  token_invalido: {
    icon: AlertCircle,
    title: "Link inválido",
    body: "El link de verificación no es válido o fue modificado. Intenta postularte de nuevo.",
    cta: "Volver al inicio",
    href: "/",
  },
  fecha_tomada: {
    icon: CalendarX,
    title: "Fecha ya reservada",
    body: "Alguien más confirmó esta fecha antes que tú. Elige otro martes disponible e intenta de nuevo.",
    cta: "Ver fechas disponibles",
    href: "/postular",
  },
  error_interno: {
    icon: ServerCrash,
    title: "Error interno",
    body: "Ocurrió un error al procesar tu postulación. Si el problema persiste, escríbenos directamente.",
    cta: "Volver al inicio",
    href: "/",
  },
};

const FALLBACK = ERRORS.token_invalido;

export default function VerificandoPage({ searchParams }: Props) {
  const entry = ERRORS[searchParams.error ?? ""] ?? FALLBACK;
  const Icon = entry.icon;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-8">

          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <Icon className="h-10 w-10 text-destructive" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight">{entry.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{entry.body}</p>
          </div>

          <Button render={<Link href={entry.href} />} size="lg">
            {entry.cta}
          </Button>

        </div>
      </main>
      <Footer />
    </>
  );
}
