import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { EmpresasPublicContent, EMPRESAS_BENEFITS } from "@/components/programas/EmpresasPublicContent";
import { PROGRAMAS_EMPRESAS_PUBLIC } from "@/lib/content/constants";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata({
  title: PROGRAMAS_EMPRESAS_PUBLIC
    ? "Programas para empresas"
    : "Programas para empresas (pronto)",
  description: PROGRAMAS_EMPRESAS_PUBLIC
    ? "Capacitaciones de IA a medida para equipos: talleres in-house de Claude, casos aplicados a tu industria y acompañamiento en la adopción."
    : "Capacitaciones de IA a medida para equipos — próximamente en Claude Perú. Mientras tanto, explora nuestros programas para profesionales.",
  path: "/programas/empresas",
  noIndex: !PROGRAMAS_EMPRESAS_PUBLIC,
});

export default function ProgramasEmpresasPage() {
  if (!PROGRAMAS_EMPRESAS_PUBLIC) {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Programas", path: "/programas" },
            { name: "Empresas (pronto)", path: "/programas/empresas" },
          ])}
        />
        <Navbar />
        <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto space-y-8 text-center">
            <Link
              href="/programas"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Volver a programas
            </Link>

            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                Pronto
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
                Programas para empresas{" "}
                <span className="text-muted-foreground">(pronto)</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Estamos preparando capacitaciones a medida para equipos que quieren adoptar
                Claude e IA aplicada. Muy pronto podrás solicitar talleres in-house y
                acompañamiento para tu organización.
              </p>
            </div>

            <div className="border border-border/40 bg-card rounded-2xl p-6 sm:p-8 text-left space-y-4 opacity-60">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <Briefcase className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <p className="text-sm font-medium text-muted-foreground">Vista previa</p>
              </div>
              <ul className="space-y-2">
                {EMPRESAS_BENEFITS.map((benefit) => (
                  <li key={benefit} className="text-sm text-muted-foreground leading-relaxed">
                    · {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Mientras tanto, explora el catálogo para profesionales.
              </p>
              <Button size="lg" className="min-h-[52px]" render={<Link href="/programas/profesionales" />}>
                Ver programas para profesionales
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
            name: "Capacitaciones de IA para empresas",
            description:
              "Capacitaciones a medida para equipos que quieren adoptar Claude e IA aplicada con talleres in-house y casos de su industria.",
            url: `${SITE_URL}/programas/empresas`,
          }),
        ]}
      />
      <Navbar />
      <EmpresasPublicContent />
      <Footer />
    </>
  );
}
