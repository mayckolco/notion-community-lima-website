"use client";

import { useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X, Mail } from "lucide-react";
import { applySchema, HERRAMIENTAS_OPTIONS, type ApplyInput } from "@/lib/schemas";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PRESET_TOOLS = (HERRAMIENTAS_OPTIONS as readonly string[]).filter((t) => t !== "Otros");

interface SpeakerFormProps {
  slotId: string;
  slotLabel: string;
}

export function SpeakerForm({ slotId, slotLabel }: SpeakerFormProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherInput, setOtherInput] = useState("");
  const [customTools, setCustomTools] = useState<string[]>([]);
  const hasStartedRef = useRef(false);

  const handleFormFocus = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    sendGAEvent("event", "start_application", { slot_date: slotLabel });
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplyInput>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      slotId,
      nombre: "",
      email: "",
      linkedin: "",
      whatsapp: "",
      rol: "",
      empresa: "",
      titulo: "",
      descripcion: "",
      herramientas: [],
    },
  });

  const selectedTools = watch("herramientas") ?? [];

  const togglePreset = (tool: string) => {
    const next = selectedTools.includes(tool)
      ? selectedTools.filter((t) => t !== tool)
      : [...selectedTools, tool];
    setValue("herramientas", next, { shouldValidate: true });
  };

  const addCustomTool = () => {
    const trimmed = otherInput.trim();
    if (!trimmed || selectedTools.includes(trimmed)) {
      setOtherInput("");
      return;
    }
    setValue("herramientas", [...selectedTools, trimmed], { shouldValidate: true });
    setCustomTools((prev) => [...prev, trimmed]);
    setOtherInput("");
  };

  const removeCustomTool = (tool: string) => {
    setCustomTools((prev) => prev.filter((t) => t !== tool));
    setValue("herramientas", selectedTools.filter((t) => t !== tool), { shouldValidate: true });
  };

  const otherActive = showOtherInput || customTools.length > 0;

  const onSubmit = async (data: ApplyInput) => {
    setServerError(null);
    setPhotoError(null);

    const formData = new FormData();
    formData.append("slotId", data.slotId);
    formData.append("nombre", data.nombre);
    formData.append("email", data.email);
    formData.append("linkedin", data.linkedin ?? "");
    formData.append("whatsapp", data.whatsapp ?? "");
    formData.append("rol", data.rol);
    formData.append("empresa", data.empresa);
    formData.append("titulo", data.titulo);
    formData.append("descripcion", data.descripcion);
    data.herramientas.forEach((h) => formData.append("herramientas", h));
    if (photo) formData.append("foto", photo);

    const res = await fetch("/api/apply", { method: "POST", body: formData });

    if (res.status === 429) {
      setServerError("Demasiados intentos. Espera unos minutos e intenta de nuevo.");
      return;
    }
    if (res.status === 409) {
      setServerError("Esta fecha ya fue reservada por otro speaker. Por favor elige otra.");
      return;
    }
    if (res.status === 202) {
      sendGAEvent("event", "submit_application", { slot_date: slotLabel });
      setSubmittedEmail(data.email);
      return;
    }
    if (!res.ok) {
      setServerError("Ocurrió un error inesperado. Intenta de nuevo.");
      return;
    }
  };

  if (submittedEmail) {
    return (
      <div className="space-y-6 text-center py-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight">Revisa tu correo</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Enviamos un link de confirmación a<br />
            <span className="font-mono text-foreground">{submittedEmail}</span>
          </p>
        </div>
        <div className="border border-border/50 bg-card p-4 text-left text-sm text-muted-foreground space-y-2">
          <p>El link es válido por <strong className="text-foreground">24 horas</strong>. Revisa tu carpeta de spam si no lo ves.</p>
          <p>Una vez que hagas clic, tu fecha quedará confirmada.</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocusCapture={handleFormFocus}
      className="space-y-6"
      noValidate
    >
      <input type="hidden" {...register("slotId")} />

      <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
        <p className="text-sm text-muted-foreground">Fecha seleccionada</p>
        <p className="font-semibold text-primary">{slotLabel} · 7:00 – 8:00 pm</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nombre y Apellido" error={errors.nombre?.message} required>
          <Input
            placeholder="María García"
            {...register("nombre")}
            className={cn(errors.nombre && "border-destructive")}
          />
        </Field>

        <Field label="WhatsApp" error={errors.whatsapp?.message}>
          <Input
            type="tel"
            placeholder="+51 999 888 777"
            {...register("whatsapp")}
            className={cn(errors.whatsapp && "border-destructive")}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Rol" error={errors.rol?.message} required>
          <Input
            placeholder="CEO, CTO, Founder..."
            {...register("rol")}
            className={cn(errors.rol && "border-destructive")}
          />
        </Field>

        <Field label="Empresa" error={errors.empresa?.message} required>
          <Input
            placeholder="Nombre de tu empresa o proyecto"
            {...register("empresa")}
            className={cn(errors.empresa && "border-destructive")}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message} required>
          <Input
            type="email"
            placeholder="maria@ejemplo.com"
            {...register("email")}
            className={cn(errors.email && "border-destructive")}
          />
        </Field>

        <Field label="LinkedIn" error={errors.linkedin?.message}>
          <Input
            placeholder="https://linkedin.com/in/tu-perfil"
            {...register("linkedin")}
            className={cn(errors.linkedin && "border-destructive")}
          />
        </Field>
      </div>

      <Field label="Título de la charla" error={errors.titulo?.message} required>
        <Input
          placeholder="Cómo construí mi startup con IA en 30 días"
          {...register("titulo")}
          className={cn(errors.titulo && "border-destructive")}
        />
      </Field>

      <Field label="Descripción breve" error={errors.descripcion?.message} required>
        <Textarea
          placeholder="Cuenta de qué va tu charla, qué aprendizajes compartirás y quién es el público ideal..."
          rows={4}
          {...register("descripcion")}
          className={cn(errors.descripcion && "border-destructive")}
        />
      </Field>

      {/* Herramientas */}
      <div className="space-y-2">
        <Label>
          Herramientas que usarás <span className="text-destructive">*</span>
        </Label>

        <div className="flex flex-wrap gap-2">
          {PRESET_TOOLS.map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => togglePreset(tool)}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium border transition-all",
                selectedTools.includes(tool)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
              )}
            >
              {tool}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowOtherInput((v) => !v)}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium border transition-all",
              otherActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
            )}
          >
            Otros
          </button>
        </div>

        {customTools.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {customTools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {tool}
                <button
                  type="button"
                  onClick={() => removeCustomTool(tool)}
                  className="ml-0.5 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {showOtherInput && (
          <div className="flex gap-2 pt-1">
            <Input
              value={otherInput}
              onChange={(e) => setOtherInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTool();
                }
              }}
              placeholder="Ej: Windsurf, Dify, Perplexity..."
              className="max-w-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomTool}
              disabled={!otherInput.trim()}
            >
              Agregar
            </Button>
          </div>
        )}

        {errors.herramientas && (
          <p className="text-xs text-destructive">{errors.herramientas.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Foto de perfil</Label>
        <PhotoUpload value={photo} onChange={setPhoto} error={photoError ?? undefined} />
      </div>

      {serverError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Enviando postulación...
          </>
        ) : (
          "Confirmar postulación"
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
