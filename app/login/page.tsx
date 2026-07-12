"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

type AuthMode = "register" | "login";

function LoginError() {
  const params = useSearchParams();
  const error = params.get("error");
  if (!error) return null;

  const messages: Record<string, string> = {
    link_invalido: "El link no es válido.",
    link_expirado: "El link expiró. Solicita uno nuevo.",
    no_encontrado: "No encontramos tu email. Regístrate primero o verifica el correo.",
  };

  return (
    <p className="text-sm text-destructive border border-destructive/20 bg-destructive/5 rounded-md px-4 py-3">
      {messages[error] ?? "Ocurrió un error. Intenta de nuevo."}
    </p>
  );
}

function CommunityAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("register");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [rol, setRol] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint =
        mode === "register" ? "/api/comunidad/register" : "/api/comunidad/auth/request";
      const body =
        mode === "register"
          ? { nombre, email, pais, ciudad, rol, empresa, linkedin }
          : { email };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-muted/50">
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "register"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Registrarme
        </button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "login"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Ya tengo cuenta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {mode === "register" && (
          <>
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-foreground">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                required
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-md bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/40 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pais" className="block text-sm font-medium text-foreground">
                País
              </label>
              <input
                id="pais"
                type="text"
                required
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                placeholder="Perú, Colombia, Chile..."
                className="w-full rounded-md bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/40 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="ciudad" className="block text-sm font-medium text-foreground">
                Ciudad
              </label>
              <input
                id="ciudad"
                type="text"
                required
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Lima, Arequipa, Bogotá..."
                className="w-full rounded-md bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/40 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rol" className="block text-sm font-medium text-foreground">
                Rol <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <input
                id="rol"
                type="text"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                placeholder="Developer, PM, Founder..."
                className="w-full rounded-md bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/40 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="empresa" className="block text-sm font-medium text-foreground">
                Empresa <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <input
                id="empresa"
                type="text"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Donde trabajas o construyes"
                className="w-full rounded-md bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/40 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="linkedin" className="block text-sm font-medium text-foreground">
                LinkedIn <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <input
                id="linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/tu-perfil"
                className="w-full rounded-md bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/40 transition-colors"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            aria-describedby={error ? "community-auth-error" : undefined}
            aria-invalid={error ? "true" : undefined}
            className="w-full rounded-md bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/40 transition-colors aria-invalid:border-destructive"
          />
        </div>

        {error && (
          <p
            id="community-auth-error"
            role="alert"
            className="text-sm text-destructive border border-destructive/20 bg-destructive/5 rounded-md px-4 py-3"
          >
            {error}
          </p>
        )}

        <Button type="submit" className="w-full min-h-[44px]" disabled={loading} aria-busy={loading}>
          {loading
            ? "Enviando..."
            : mode === "register"
              ? "Registrarme y confirmar email"
              : "Enviar link de acceso"}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Comunidad Claude Perú
            </p>
            <h1 className="text-2xl font-serif tracking-tight">Únete al mapa</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Regístrate para aparecer en el mapa de la comunidad. Te enviaremos un link
              para confirmar tu perfil.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
            <Suspense fallback={null}>
              <LoginError />
            </Suspense>
            <CommunityAuthForm />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            ¿Eres speaker?{" "}
            <Link
              href="/portal/login"
              className="text-foreground hover:underline underline-offset-4"
            >
              Ingresa al portal de speakers
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
