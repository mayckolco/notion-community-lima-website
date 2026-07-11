"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { Loader2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GA_EVENTS } from "@/lib/seo/analytics";

interface NewsletterFormProps {
  location: string;
  compact?: boolean;
}

export function NewsletterForm({ location, compact = false }: NewsletterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.status === 429) {
        setStatus("error");
        setErrorMsg("Demasiados intentos. Espera unos minutos.");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setErrorMsg("No pudimos procesar tu suscripción. Intenta de nuevo.");
        return;
      }

      sendGAEvent("event", GA_EVENTS.newsletterSubscribe, { location });
      router.push("/gracias?tipo=newsletter");
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Intenta de nuevo.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      {!compact && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          Recibe eventos, novedades de Claude y recursos de la comunidad en tu correo.
        </p>
      )}
      <div className={`flex gap-2 ${compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"}`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="pl-9 min-h-[44px] touch-manipulation"
            disabled={status === "loading"}
          />
        </div>
        <Button
          type="submit"
          disabled={status === "loading"}
          className="min-h-[44px] touch-manipulation shrink-0"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando…
            </>
          ) : (
            "Suscribirme"
          )}
        </Button>
      </div>
      {errorMsg && (
        <p className="text-xs text-destructive" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
