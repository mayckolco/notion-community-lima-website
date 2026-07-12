"use client";

import { useState } from "react";
import type { ComunidadMemberRecord } from "@/lib/notion/comunidad";

interface MemberProfileFormProps {
  member: ComunidadMemberRecord;
}

export function MemberProfileForm({ member }: MemberProfileFormProps) {
  const [nombre, setNombre] = useState(member.nombre);
  const [pais, setPais] = useState(member.pais ?? "");
  const [ciudad, setCiudad] = useState(member.ciudad ?? "");
  const [rol, setRol] = useState(member.rol ?? "");
  const [empresa, setEmpresa] = useState(member.empresa ?? "");
  const [linkedin, setLinkedin] = useState(member.linkedin ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/comunidad/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, pais, ciudad, rol, empresa, linkedin }),
      });

      if (!res.ok) {
        setError("No se pudo guardar. Intenta de nuevo.");
        return;
      }

      setMessage("Perfil actualizado.");
    } catch {
      setError("No se pudo conectar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" id="perfil-nombre" value={nombre} onChange={setNombre} required />
        <Field label="Email" id="perfil-email" value={member.email} onChange={() => {}} disabled />
        <Field label="País" id="perfil-pais" value={pais} onChange={setPais} required />
        <Field label="Ciudad" id="perfil-ciudad" value={ciudad} onChange={setCiudad} required />
        <Field label="Rol" id="perfil-rol" value={rol} onChange={setRol} />
        <Field label="Empresa" id="perfil-empresa" value={empresa} onChange={setEmpresa} />
      </div>
      <Field
        label="LinkedIn"
        id="perfil-linkedin"
        value={linkedin}
        onChange={setLinkedin}
        placeholder="https://linkedin.com/in/tu-perfil"
      />

      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  required,
  disabled,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm disabled:opacity-60"
      />
    </div>
  );
}
