import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { PROGRAMAS_EMPRESAS_LABEL, PROGRAMAS_EMPRESAS_PUBLIC } from "@/lib/content/constants";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";

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
      "Claude Bootcamp: sesión intensiva para dominar Claude sin código. Virtual S/ 159 o presencial S/ 249 en Lima.",
    href: "/programas/profesionales",
    cta: "Ver bootcamp",
    comingSoon: false,
  },
  {
    icon: Briefcase,
    title: PROGRAMAS_EMPRESAS_PUBLIC ? "Para empresas" : PROGRAMAS_EMPRESAS_LABEL,
    description:
      "Capacitaciones a medida para equipos que quieren adoptar IA: talleres in-house, casos aplicados a tu industria y acompañamiento.",
    href: "/programas/empresas",
    cta: PROGRAMAS_EMPRESAS_PUBLIC ? "Ver propuesta" : "Próximamente",
    comingSoon: !PROGRAMAS_EMPRESAS_PUBLIC,
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
            {TRACKS.map(({ icon: Icon, title, description, href, cta, comingSoon }) => {
              const cardClass = cn(
                "border border-border/40 bg-card rounded-2xl p-8 space-y-4 transition-colors",
                comingSoon
                  ? "opacity-60 cursor-not-allowed"
                  : "group hover:border-primary/40"
              );

              const inner = (
                <>
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-lg",
                      comingSoon ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl tracking-tight">{title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm font-semibold",
                      comingSoon ? "text-muted-foreground" : "text-primary"
                    )}
                  >
                    {cta}
                    {!comingSoon && (
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                      />
                    )}
                  </span>
                </>
              );

              return comingSoon ? (
                <div key={href} className={cardClass}>
                  {inner}
                </div>
              ) : (
                <Link key={href} href={href} className={cn("group", cardClass)}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
