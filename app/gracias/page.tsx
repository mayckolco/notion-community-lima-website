import Link from "next/link";
import {
  Calendar,
  Mail,
  Mic,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JoinCommunityButton } from "@/components/JoinCommunityButton";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "¡Gracias!",
  description: "Tu acción en Claude Perú fue registrada correctamente.",
  path: "/gracias",
  noIndex: true,
});

type GraciasTipo = "speaker" | "newsletter";

interface Props {
  searchParams: { tipo?: string };
}

const CONTENT: Record<
  GraciasTipo,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: React.ReactNode;
    subtitle: string;
    steps: string[];
    primaryCta: { label: string; href: string; external?: boolean };
  }
> = {
  speaker: {
    icon: Mic,
    title: (
      <>
        ¡Postulación <span className="gradient-text">confirmada!</span>
      </>
    ),
    subtitle: "Tu lugar está reservado. Te contactaremos pronto con los detalles.",
    steps: [
      "Recibirás un email de confirmación con todos los detalles de tu charla.",
      "El equipo de Claude Perú coordinará contigo la logística del evento.",
      "Te compartiremos el link de Luma para que puedas invitar a tu red.",
    ],
    primaryCta: { label: "Ver eventos", href: "/eventos" },
  },
  newsletter: {
    icon: Mail,
    title: (
      <>
        ¡Suscripción <span className="gradient-text">confirmada!</span>
      </>
    ),
    subtitle: "Revisa tu correo — te enviamos un mensaje de bienvenida.",
    steps: [
      "Te avisaremos sobre próximos webinars y eventos de la comunidad.",
      "Recibirás novedades de Claude y recursos curados en español.",
      "Mientras tanto, únete al grupo de WhatsApp para no perderte nada en vivo.",
    ],
    primaryCta: {
      label: "Unirme a la comunidad",
      href: "https://chat.whatsapp.com/CvBaizXWjtZCstUgXlJqi3",
      external: true,
    },
  },
};

function resolveTipo(raw?: string): GraciasTipo {
  if (raw === "newsletter") return "newsletter";
  return "speaker";
}

export default function GraciasPage({ searchParams }: Props) {
  const tipo = resolveTipo(searchParams.tipo);
  const content = CONTENT[tipo];
  const Icon = content.icon;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
              <Icon className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight">
              {content.title}
            </h1>
            <p className="text-lg text-muted-foreground">{content.subtitle}</p>
          </div>

          <div className="border border-border/50 bg-card p-6 text-left space-y-4 rounded-xl shadow-soft">
            <h2 className="font-serif text-lg">¿Qué sigue?</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {content.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="min-h-[48px]" render={<Link href="/" />}>
              <Calendar className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
            {content.primaryCta.external ? (
              <JoinCommunityButton location="gracias_cta" />
            ) : (
              <Button className="min-h-[48px]" render={<Link href={content.primaryCta.href} />}>
                {content.primaryCta.label}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {tipo === "speaker" && (
            <p className="text-xs text-muted-foreground">
              ¿Aún no estás en la comunidad?{" "}
              <a
                href="https://chat.whatsapp.com/CvBaizXWjtZCstUgXlJqi3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Únete al grupo de WhatsApp
              </a>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
