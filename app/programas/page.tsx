import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = createPageMetadata({
  title: "Programas",
  description:
    "Formaciones de Claude Perú para profesionales y empresas. Aprende a usar Claude y la IA aplicada, desde cero o en tu organización.",
  path: "/programas",
});

const TRACKS = [
  {
    icon: GraduationCap,
    title: "Para profesionales",
    description:
      "6 cursos, 3 programas y 3 rutas para aprender Claude Chat, Cowork y Code desde cero hasta experto — sin código. Cohortes de 10, virtual y presencial.",
    href: "/programas/profesionales",
    cta: "Ver catálogo",
  },
  {
    icon: Briefcase,
    title: "Para empresas",
    description:
      "Capacitaciones a medida para equipos que quieren adoptar IA: talleres in-house, casos aplicados a tu industria y acompañamiento.",
    href: "/programas/empresas",
    cta: "Ver propuesta",
  },
];

export default function ProgramasPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Programas", path: "/programas" },
        ])}
      />
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-primary">Programas</p>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
              Formaciones para <span className="gradient-text">cada nivel</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Formaciones y experiencias de Claude Perú, tanto para profesionales que
              quieren dominar la IA como para empresas que buscan adoptarla en sus equipos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TRACKS.map(({ icon: Icon, title, description, href, cta }) => (
              <Link
                key={href}
                href={href}
                className="group border border-border/40 bg-card rounded-2xl p-8 space-y-4 hover:border-primary/40 transition-colors"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="font-serif text-xl sm:text-2xl tracking-tight">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
