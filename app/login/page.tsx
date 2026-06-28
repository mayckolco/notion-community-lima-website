"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function LoginError() {
  const params = useSearchParams();
  const error = params.get("error");
  if (!error) return null;

  const messages: Record<string, string> = {
    link_invalido: "El link no es válido.",
    link_expirado: "El link expiró. Solicita uno nuevo.",
    no_encontrado: "No encontramos tu email. Verifica que sea el mismo con el que aplicaste.",
  };

  return (
    <p className="text-sm text-red-400 border border-red-900/50 bg-red-950/30 px-4 py-3">
      {messages[error] ?? "Ocurrió un error. Intenta de nuevo."}
    </p>
  );
}

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        setError("Demasiados intentos. Espera unos minutos.");
        return;
      }
      if (!res.ok) {
        setError("Ocurrió un error. Intenta de nuevo.");
        return;
      }

      router.push("/login/sent");
    } catch {
      setError("No se pudo conectar. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm text-muted-foreground">
          Email con el que aplicaste
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full bg-background border border-border/70 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 border border-red-900/50 bg-red-950/30 px-4 py-3">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar link de acceso"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Portal de Speakers
            </p>
            <h1 className="text-2xl font-black tracking-tight">Ingresa a tu portal</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ingresa el email con el que aplicaste. Te enviaremos un link de acceso directo.
            </p>
          </div>

          <div className="border border-border/50 bg-card p-6 space-y-4">
            <Suspense fallback={null}>
              <LoginError />
            </Suspense>
            <LoginForm />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            ¿Aún no eres speaker?{" "}
            <Link href="/aplicar" className="text-foreground hover:underline underline-offset-4">
              Aplica aquí
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
