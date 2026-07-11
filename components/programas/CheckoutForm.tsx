"use client";

import { useState } from "react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { ArrowLeft, CheckCircle2, CreditCard, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLAUDE_BOOTCAMP, formatBootcampPrecio } from "@/lib/content/bootcamp";
import type { ProgramaModalidad } from "@/lib/content/programas";
import { WHATSAPP_DIRECT_URL } from "@/lib/content/constants";
import { GA_EVENTS } from "@/lib/seo/analytics";

interface CheckoutFormProps {
  modalidad: ProgramaModalidad;
}

export function CheckoutForm({ modalidad }: CheckoutFormProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);

  const precio =
    modalidad === "virtual"
      ? CLAUDE_BOOTCAMP.precio.virtual
      : CLAUDE_BOOTCAMP.precio.presencial;

  const modalidadLabel = modalidad === "virtual" ? "Virtual" : "Presencial";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    sendGAEvent("event", GA_EVENTS.preReservaPrograma, {
      location: "checkout",
      programa: CLAUDE_BOOTCAMP.nombre,
      modalidad,
    });
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("success");
  }

  if (step === "success") {
    const confirmText = `Hola! Acabo de completar la pre-reserva de ${CLAUDE_BOOTCAMP.nombre} (${modalidadLabel}) por ${formatBootcampPrecio(precio)}. Quiero confirmar fechas y cupo. Gracias!`;
    const whatsappUrl = `${WHATSAPP_DIRECT_URL}?text=${encodeURIComponent(confirmText)}`;

    return (
      <div className="text-center space-y-6 py-4">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
        </span>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl tracking-tight">Pre-reserva registrada</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Tu cupo está apartado. Escríbenos por WhatsApp para confirmar fecha y coordinar el
            pago final.
          </p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card p-4 text-left text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">Programa:</span> {CLAUDE_BOOTCAMP.nombre}
          </p>
          <p>
            <span className="text-muted-foreground">Modalidad:</span> {modalidadLabel}
          </p>
          <p>
            <span className="text-muted-foreground">Monto:</span>{" "}
            <strong>{formatBootcampPrecio(precio)}</strong>
          </p>
        </div>
        <Button size="lg" className="min-h-[48px] w-full sm:w-auto" render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}>
          Confirmar por WhatsApp
        </Button>
        <Link
          href="/programas/profesionales"
          className="inline-block text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Volver a programas
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border/40 bg-card p-5 space-y-3">
        <h2 className="font-medium text-sm">Resumen del pedido</h2>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{CLAUDE_BOOTCAMP.nombre} · {modalidadLabel}</span>
          <span className="font-semibold">{formatBootcampPrecio(precio)}</span>
        </div>
        <div className="border-t border-border/40 pt-3 flex justify-between font-medium">
          <span>Total</span>
          <span className="font-serif text-lg">{formatBootcampPrecio(precio)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="h-4 w-4 text-primary" strokeWidth={1.75} />
          Datos de pago
          <span className="ml-auto flex items-center gap-1 text-[10px] uppercase tracking-wider">
            <Lock className="h-3 w-3" strokeWidth={1.75} />
            Simulado
          </span>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nombre completo"
            required
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="tel"
            placeholder="WhatsApp (+51 ...)"
            required
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            placeholder="Número de tarjeta (simulado)"
            defaultValue="4242 4242 4242 4242"
            readOnly
            className="w-full rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="MM/AA"
              defaultValue="12/28"
              readOnly
              className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
            />
            <input
              type="text"
              placeholder="CVC"
              defaultValue="123"
              readOnly
              className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" strokeWidth={1.75} />
        Pasarela de demostración. No se procesará ningún cargo real. La pre-reserva se confirma
        por WhatsApp.
      </p>

      <Button
        type="submit"
        size="lg"
        className="w-full min-h-[48px]"
        disabled={loading}
      >
        {loading ? "Procesando…" : `Pagar ${formatBootcampPrecio(precio)}`}
      </Button>

      <Link
        href="/programas/profesionales"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Volver a programas
      </Link>
    </form>
  );
}
