import Link from "next/link";
import { CheckCircle2, Calendar, ExternalLink } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function GraciasPage() {
  return (
    <>
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight">
            ¡Postulación <span className="text-primary">confirmada!</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Tu lugar está reservado. Te contactaremos pronto con los detalles.
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 text-left space-y-4">
          <h2 className="font-bold">¿Qué sigue?</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary text-xs font-bold">
                1
              </span>
              Recibirás un email de confirmación con todos los detalles de tu charla.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary text-xs font-bold">
                2
              </span>
              El equipo de AI First Founders coordinará contigo la logística del evento.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary text-xs font-bold">
                3
              </span>
              Te compartiremos el link de Luma para que puedas invitar a tu red.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" render={<Link href="/" />}>
            <Calendar className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
          <Button
            render={
              <a
                href="https://www.linkedin.com/company/ai-first-founders"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Seguirnos en LinkedIn
          </Button>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
