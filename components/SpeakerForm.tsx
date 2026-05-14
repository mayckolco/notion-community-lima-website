"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { applySchema, HERRAMIENTAS_OPTIONS, type ApplyInput } from "@/lib/schemas";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FormPrefill } from "@/lib/linkedin/map-to-form";

interface SpeakerFormProps {
  slotId: string;
  slotLabel: string;
}

export function SpeakerForm({ slotId, slotLabel }: SpeakerFormProps) {
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedinPrefilled, setLinkedinPrefilled] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ApplyInput>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      slotId,
      nombre: "",
      email: "",
      linkedin: "",
      titulo: "",
      descripcion: "",
      herramientas: [],
    },
  });

  const selectedTools = watch("herramientas") ?? [];

  const toggleTool = (tool: string) => {
    const current = selectedTools;
    const next = current.includes(tool)
      ? current.filter((t) => t !== tool)
      : [...current, tool];
    setValue("herramientas", next, { shouldValidate: true });
  };

  const fetchLinkedInProfile = useCallback(async () => {
    const url = getValues("linkedin");
    if (!url || !url.includes("linkedin.com/in/")) return;

    setLinkedinLoading(true);
    setLinkedinPrefilled(false);

    try {
      const res = await fetch(`/api/linkedin-profile?url=${encodeURIComponent(url)}`);
      if (!res.ok) return;

      const { prefill }: { prefill: FormPrefill } = await res.json();

      if (prefill.nombre && !getValues("nombre")) {
        setValue("nombre", prefill.nombre, { shouldValidate: true });
      }
      if (prefill.titulo && !getValues("titulo")) {
        setValue("titulo", prefill.titulo, { shouldValidate: true });
      }
      if (prefill.descripcion && !getValues("descripcion")) {
        setValue("descripcion", prefill.descripcion, { shouldValidate: true });
      }
      if (prefill.herramientas.length > 0 && selectedTools.length === 0) {
        setValue("herramientas", prefill.herramientas, { shouldValidate: true });
      }
      if (prefill.photoUrl && !photo) {
        const photoRes = await fetch(prefill.photoUrl);
        if (photoRes.ok) {
          const blob = await photoRes.blob();
          const file = new File([blob], "linkedin-photo.jpg", { type: blob.type || "image/jpeg" });
          setPhoto(file);
        }
      }

      setLinkedinPrefilled(true);
    } catch {
      // silently fail — user fills manually
    } finally {
      setLinkedinLoading(false);
    }
  }, [getValues, setValue, selectedTools, photo]);

  const onSubmit = async (data: ApplyInput) => {
    setServerError(null);
    setPhotoError(null);

    if (!photo) {
      setPhotoError("La foto es requerida");
      return;
    }

    const formData = new FormData();
    formData.append("slotId", data.slotId);
    formData.append("nombre", data.nombre);
    formData.append("email", data.email);
    formData.append("linkedin", data.linkedin);
    formData.append("titulo", data.titulo);
    formData.append("descripcion", data.descripcion);
    data.herramientas.forEach((h) => formData.append("herramientas", h));
    formData.append("foto", photo);

    const res = await fetch("/api/apply", { method: "POST", body: formData });

    if (res.status === 409) {
      setServerError("Esta fecha ya fue reservada por otro speaker. Por favor elige otra.");
      return;
    }
    if (!res.ok) {
      setServerError("Ocurrió un error inesperado. Intenta de nuevo.");
      return;
    }

    router.push("/gracias");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <input type="hidden" {...register("slotId")} />

      <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
        <p className="text-sm text-muted-foreground">Fecha seleccionada</p>
        <p className="font-semibold text-primary">{slotLabel} · 7:00 – 8:00 pm</p>
      </div>

      {/* LinkedIn field — triggers scrape on blur */}
      <Field label="LinkedIn" error={errors.linkedin?.message} required>
        <div className="relative">
          <Input
            placeholder="https://linkedin.com/in/tu-perfil"
            {...register("linkedin")}
            onBlur={fetchLinkedInProfile}
            className={cn(errors.linkedin && "border-destructive", "pr-10")}
          />
          {linkedinLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        {linkedinPrefilled && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
            <Sparkles className="h-3 w-3" />
            Datos cargados desde LinkedIn — revisa y edita si quieres
          </p>
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nombre completo" error={errors.nombre?.message} required>
          <Input
            placeholder="María García"
            {...register("nombre")}
            className={cn(errors.nombre && "border-destructive")}
          />
        </Field>

        <Field label="Email" error={errors.email?.message} required>
          <Input
            type="email"
            placeholder="maria@ejemplo.com"
            {...register("email")}
            className={cn(errors.email && "border-destructive")}
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

      <Field label="Descripción" error={errors.descripcion?.message} required>
        <Textarea
          placeholder="Cuenta de qué va tu charla, qué aprendizajes compartirás y quién es el público ideal..."
          rows={4}
          {...register("descripcion")}
          className={cn(errors.descripcion && "border-destructive")}
        />
      </Field>

      <div className="space-y-2">
        <Label>
          Herramientas que usas <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {HERRAMIENTAS_OPTIONS.map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => toggleTool(tool)}
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
        </div>
        {errors.herramientas && (
          <p className="text-xs text-destructive">{errors.herramientas.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>
          Foto de perfil <span className="text-destructive">*</span>
        </Label>
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
