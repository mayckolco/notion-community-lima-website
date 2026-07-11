import type { Metadata } from "next";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";

const COURSE_NAME = "Capacitaciones de IA para empresas";
const COURSE_DESCRIPTION =
  "Capacitaciones a medida para equipos que quieren adoptar Claude e IA aplicada con talleres in-house y casos de su industria.";

export const metadata: Metadata = createPageMetadata({
  title: "Programas para empresas",
  description:
    "Capacitaciones de IA a medida para equipos: talleres in-house de Claude, casos aplicados a tu industria y acompañamiento en la adopción.",
  path: "/programas/empresas",
});

const WHATSAPP_URL = "https://wa.me/51946542990";

const BENEFITS = [
  "Talleres prácticos in-house o remotos, adaptados a tu industria",
  "Casos de uso reales con Claude aplicados a los flujos de tu equipo",
  "Acompañamiento en la adopción: desde el piloto hasta el uso diario",
  "Buenas prácticas de seguridad y datos al usar IA en la empresa",
];

export default function ProgramasEmpresasPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Programas", path: "/programas" },
            { name: "Empresas", path: "/programas/empresas" },
          ]),
          courseJsonLd({
            name: COURSE_NAME,
            description: COURSE_DESCRIPTION,
            url: `${SITE_URL}/programas/empresas`,
          }),
        ]}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-primary">
              Programas · Empresas
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
              Lleva la IA a <span className="gradient-text">tu equipo</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Capacitaciones a medida para empresas que quieren adoptar Claude e IA
              aplicada: formamos a tu equipo con casos reales de tu propia operación.
            </p>
          </div>

          <div className="border border-border/40 bg-card rounded-2xl p-8 sm:p-10 space-y-6">
            <h2 className="font-serif text-xl sm:text-2xl tracking-tight">
              ¿Qué incluye una capacitación?
            </h2>
            <ul className="space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-5 w-5 text-primary shrink-0 mt-0.5"
                    strokeWidth={1.75}
                  />
                  <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border/40 bg-card rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">
                Conversemos sobre <span className="gradient-text">tu caso</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                Cuéntanos qué quiere lograr tu equipo y armamos una propuesta a medida.
              </p>
            </div>

            <Button
              size="lg"
              className="min-h-[52px]"
              render={
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" />
              }
            >
              <MessageCircle className="h-5 w-5 mr-2" strokeWidth={1.75} />
              Hablar por WhatsApp
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
