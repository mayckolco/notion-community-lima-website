"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Smartphone,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutStepper } from "@/components/programas/checkout/CheckoutStepper";
import { CheckoutSummary } from "@/components/programas/checkout/CheckoutSummary";
import {
  BOOTCAMP_YAPE,
  NOTION_BOOTCAMP,
  formatBootcampPrecio,
  generateBootcampReferencia,
} from "@/lib/content/bootcamp";
import type { ProgramaModalidad } from "@/lib/content/programas";
import type { BootcampFecha } from "@/lib/content/bootcamp";
import {
  BOOTCAMP_HERRAMIENTAS_OPTIONS,
  BOOTCAMP_NIVEL_IA_OPTIONS,
  bootcampEncuestaSchema,
} from "@/lib/schemas";
import { GA_EVENTS } from "@/lib/seo/analytics";
import { cn } from "@/lib/utils";

interface CheckoutFormProps {
  modalidad: ProgramaModalidad;
  initialFechaId?: string;
}

type Step = 1 | 2 | 3;

const inputClass =
  "w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20";

export function CheckoutForm({ modalidad, initialFechaId }: CheckoutFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [fechasLoading, setFechasLoading] = useState(true);
  const [selectedFecha, setSelectedFecha] = useState<BootcampFecha | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [referencia, setReferencia] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dedicacion, setDedicacion] = useState("");
  const [nivelIa, setNivelIa] = useState<string>(BOOTCAMP_NIVEL_IA_OPTIONS[0]);
  const [problema, setProblema] = useState("");
  const [herramientas, setHerramientas] = useState<string[]>([]);
  const [expectativas, setExpectativas] = useState("");
  const [encuestaDone, setEncuestaDone] = useState(false);

  const precio =
    modalidad === "virtual"
      ? NOTION_BOOTCAMP.precio.virtual
      : NOTION_BOOTCAMP.precio.presencial;

  const modalidadLabel = modalidad === "virtual" ? "Virtual" : "Presencial";

  useEffect(() => {
    let cancelled = false;
    setFechasLoading(true);
    fetch(`/api/bootcamp/fechas?modalidad=${modalidad}`)
      .then((r) => r.json())
      .then((data: { fechas?: BootcampFecha[] }) => {
        if (cancelled) return;
        const loaded = data.fechas ?? [];

        if (initialFechaId) {
          const match = loaded.find((fecha) => fecha.id === initialFechaId);
          if (match) {
            setSelectedFecha(match);
            setStep(1);
          } else {
            setError("La fecha seleccionada ya no está disponible. Elige otra.");
          }
        } else {
          setError("Selecciona una fecha en la página del bootcamp para continuar.");
        }
      })
      .catch(() => {
        if (!cancelled) setError("No pudimos cargar las fechas. Intenta de nuevo.");
      })
      .finally(() => {
        if (!cancelled) setFechasLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [modalidad, initialFechaId]);

  const copyReferencia = useCallback(async () => {
    if (!referencia) return;
    await navigator.clipboard.writeText(referencia);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [referencia]);

  function handleFileSelect(file: File | null) {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Solo PNG, JPG o WEBP (máx. 5 MB)");
      return;
    }
    setError(null);
    setComprobante(file);
  }

  async function handleInscripcion() {
    if (!selectedFecha || !comprobante || !referencia) return;
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append("reservaId", selectedFecha.id);
    fd.append("nombre", nombre.trim());
    fd.append("email", email.trim());
    fd.append("whatsapp", whatsapp.trim());
    fd.append("referencia", referencia);
    fd.append("comprobante", comprobante);

    try {
      const res = await fetch("/api/bootcamp/inscripcion", { method: "POST", body: fd });
      const data = (await res.json()) as { leadId?: string; error?: string };

      if (!res.ok) {
        setError(
          data.error === "reserva_unavailable"
            ? "Esta fecha ya no tiene cupos. Elige otra."
            : "No pudimos registrar tu inscripción. Intenta de nuevo."
        );
        return;
      }

      sendGAEvent("event", GA_EVENTS.preReservaPrograma, {
        location: "checkout_yape",
        programa: NOTION_BOOTCAMP.nombre,
        modalidad,
      });

      setLeadId(data.leadId ?? null);
      setStep(3);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEncuesta(e: React.FormEvent) {
    e.preventDefault();
    if (!leadId) {
      setError("No encontramos tu inscripción. Recarga la página e intenta de nuevo.");
      return;
    }

    const payload = {
      leadId,
      dedicacion: dedicacion.trim(),
      nivelIa,
      problema: problema.trim(),
      herramientas,
      expectativas: expectativas.trim(),
    };

    const parsed = bootcampEncuestaSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues.map((issue) => issue.message).join(" "));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bootcamp/encuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as {
        error?: string;
        details?: Array<{ message: string }>;
      };

      if (!res.ok) {
        const detailMsg = data.details?.map((d) => d.message).join(" ");
        setError(
          detailMsg ||
            (data.error === "update_failed"
              ? "No pudimos guardar en Notion. Intenta de nuevo."
              : "Revisa los campos e intenta de nuevo.")
        );
        return;
      }

      setEncuestaDone(true);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function toggleHerramienta(tool: string) {
    setHerramientas((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl tracking-tight">
            Inscripción al curso
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {NOTION_BOOTCAMP.nombre} · {modalidadLabel}
          </p>
        </div>
        <CheckoutStepper current={step} />
      </header>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 lg:gap-8 items-start">
        <div className="min-w-0">
          {fechasLoading ? (
            <div className="rounded-2xl border border-border/40 bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Preparando tu inscripción…</p>
            </div>
          ) : !selectedFecha ? (
            <div className="rounded-2xl border border-border/40 bg-card p-8 text-center space-y-4">
              <p className="text-sm text-destructive">
                {error ?? "No pudimos cargar la fecha seleccionada."}
              </p>
              <Button variant="outline" size="sm" render={<Link href="/programas/profesionales" />}>
                Volver a fechas disponibles
              </Button>
            </div>
          ) : (
            <>
          {/* Paso 1: Datos */}
          {step === 1 && (
            <div className="rounded-2xl border border-border/40 bg-card p-5 sm:p-8 space-y-6">
              <div>
                <h2 className="font-serif text-xl tracking-tight">Paso 1: Tus datos personales</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Completa la información para reservar tu cupo en{" "}
                  <strong className="text-foreground">{selectedFecha.fechaLabel}</strong>.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Ana García"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="ana@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="9XX XXX XXX"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" render={<Link href="/programas/profesionales" />}>
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
                <Button
                  size="lg"
                  className="flex-1 min-h-[48px]"
                  disabled={!nombre.trim() || !email.trim() || !whatsapp.trim()}
                  onClick={() => {
                    setReferencia(generateBootcampReferencia(nombre));
                    setStep(2);
                  }}
                >
                  Continuar al pago
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Paso 2: Pago Yape */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20 p-5 sm:p-8 space-y-5">
                <div>
                  <h2 className="font-serif text-xl tracking-tight">Paso 2: Realiza tu pago por Yape</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Usa el código de referencia como <strong>concepto</strong> al yapear.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-300/50 bg-background p-4 space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
                    Tu código de referencia
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-2xl sm:text-3xl font-bold tracking-wide">
                      {referencia}
                    </p>
                    <Button variant="outline" size="sm" onClick={copyReferencia}>
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      Copiar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Escribe este código en el campo <strong>concepto</strong> de tu Yape.
                  </p>
                </div>

                <div className="rounded-xl border border-border/40 bg-background p-4 space-y-3">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Smartphone className="h-4 w-4 text-primary" strokeWidth={1.75} />
                    Instrucciones de pago
                  </p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                    <dt className="text-muted-foreground">Método</dt>
                    <dd>Yape</dd>
                    <dt className="text-muted-foreground">Número Yape</dt>
                    <dd className="font-medium">{BOOTCAMP_YAPE.numero}</dd>
                    <dt className="text-muted-foreground">A nombre de</dt>
                    <dd>{BOOTCAMP_YAPE.titular}</dd>
                    <dt className="text-muted-foreground">Monto</dt>
                    <dd className="font-semibold">{formatBootcampPrecio(precio)}</dd>
                    <dt className="text-muted-foreground">Concepto</dt>
                    <dd className="font-mono text-xs">{referencia}</dd>
                  </dl>
                </div>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card p-5 sm:p-8 space-y-5">
                <div>
                  <h3 className="font-medium">Sube tu comprobante</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Toma una captura del pago realizado y súbela aquí para confirmar tu inscripción.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileSelect(e.dataTransfer.files[0] ?? null);
                  }}
                  className={cn(
                    "w-full rounded-xl border-2 border-dashed p-8 text-center transition-colors",
                    comprobante
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/60 hover:border-primary/40"
                  )}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" strokeWidth={1.5} />
                  {comprobante ? (
                    <p className="text-sm font-medium">{comprobante.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Haz clic para subir o arrastra y suelta</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG o WEBP (Máx. 5 MB)</p>
                    </>
                  )}
                </button>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  size="lg"
                  className="w-full min-h-[48px]"
                  disabled={!comprobante || loading}
                  onClick={handleInscripcion}
                >
                  {loading ? "Enviando…" : "Confirmar inscripción"}
                </Button>
              </div>
            </div>
          )}

          {/* Paso 3: Encuesta */}
          {step === 3 && (
            <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
              <div className="h-1 bg-primary" />
              <div className="p-5 sm:p-8 space-y-6">
                {encuestaDone ? (
                  <div className="text-center space-y-6 py-4">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
                    </span>
                    <div className="space-y-2">
                      <h2 className="font-serif text-2xl tracking-tight">¡Felicitaciones!</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                        Estaremos validando tu pago y nos pondremos en contacto contigo para
                        contarte los siguientes pasos.
                      </p>
                      {referencia && (
                        <p className="text-xs text-muted-foreground pt-1">Referencia: {referencia}</p>
                      )}
                    </div>
                    <Button size="lg" render={<Link href="/programas/profesionales" />}>
                      Volver a programas
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary mx-auto">
                        <Check className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl tracking-tight">
                        ¡Comprobante recibido!
                      </h2>
                      {referencia && (
                        <p className="text-sm text-muted-foreground">Referencia: {referencia}</p>
                      )}
                      <h3 className="font-serif text-lg tracking-tight pt-2">
                        Cuéntanos un poco sobre ti
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Esto nos ayuda a personalizar el bootcamp para ti 🎯
                      </p>
                    </div>

                    <form onSubmit={handleEncuesta} className="space-y-5">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          1. ¿A qué te dedicas actualmente?
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Soy contador en una empresa de logística"
                          value={dedicacion}
                          onChange={(e) => setDedicacion(e.target.value)}
                          className={inputClass}
                          minLength={2}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          2. ¿Cuál es tu nivel actual con herramientas de IA?
                        </label>
                        <div className="space-y-2">
                          {BOOTCAMP_NIVEL_IA_OPTIONS.map((opt, i) => {
                            const emojis = ["🔰", "🌱", "⚡", "🚀"];
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setNivelIa(opt)}
                                className={cn(
                                  "w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors",
                                  nivelIa === opt
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                    : "border-border/50 hover:border-primary/30"
                                )}
                              >
                                {emojis[i]} {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          3. ¿Cuál es el mayor problema en tu trabajo que quisieras resolver con IA?
                        </label>
                        <textarea
                          placeholder="Cuéntanos con detalle, esto es muy importante para preparar tu sesión"
                          value={problema}
                          onChange={(e) => setProblema(e.target.value)}
                          rows={3}
                          className={cn(inputClass, "resize-y")}
                          minLength={5}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Mínimo 5 caracteres</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          4. ¿Qué herramienta de IA te genera más curiosidad? (puedes elegir varias)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {BOOTCAMP_HERRAMIENTAS_OPTIONS.map((tool) => (
                            <button
                              key={tool}
                              type="button"
                              onClick={() => toggleHerramienta(tool)}
                              className={cn(
                                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                                herramientas.includes(tool)
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border/60 hover:border-primary/40"
                              )}
                            >
                              {tool}
                            </button>
                          ))}
                        </div>
                        {herramientas.length === 0 && (
                          <p className="text-xs text-muted-foreground mt-1">Elige al menos una opción</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          5. ¿Qué esperas llevarte del bootcamp?
                        </label>
                        <textarea
                          placeholder="Ej. Quiero aprender a automatizar mis reportes semanales"
                          value={expectativas}
                          onChange={(e) => setExpectativas(e.target.value)}
                          rows={3}
                          className={cn(inputClass, "resize-y")}
                          minLength={5}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Mínimo 5 caracteres</p>
                      </div>

                      {error && <p className="text-sm text-destructive">{error}</p>}

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full min-h-[48px]"
                        disabled={loading || herramientas.length === 0}
                      >
                        {loading ? "Enviando…" : "Enviar y finalizar"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>

                      <button
                        type="button"
                        className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setEncuestaDone(true)}
                      >
                        Completar después
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
            </>
          )}
        </div>

        {step < 3 && selectedFecha && (
          <CheckoutSummary
            precio={precio}
            fecha={selectedFecha}
            referencia={step >= 2 ? referencia : undefined}
          />
        )}
      </div>
    </div>
  );
}
