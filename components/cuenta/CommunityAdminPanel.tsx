"use client";

import { useState } from "react";
import type { ComunidadMemberRecord } from "@/lib/notion/comunidad";
import type { ComunidadProyecto } from "@/lib/notion/proyectos";

interface CommunityAdminPanelProps {
  initialMembers: ComunidadMemberRecord[];
  initialProyectos: ComunidadProyecto[];
}

export function CommunityAdminPanel({
  initialMembers,
  initialProyectos,
}: CommunityAdminPanelProps) {
  const [members, setMembers] = useState(initialMembers);
  const [proyectos, setProyectos] = useState(initialProyectos);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function saveMember(member: ComunidadMemberRecord) {
    setSavingId(member.id);
    try {
      await fetch("/api/comunidad/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "member",
          id: member.id,
          member: {
            nombre: member.nombre,
            email: member.email,
            pais: member.pais ?? undefined,
            ciudad: member.ciudad ?? "",
            rol: member.rol ?? undefined,
            empresa: member.empresa ?? undefined,
            linkedin: member.linkedin ?? undefined,
            estado: member.estado ?? "Pendiente",
            tipo: member.tipo,
          },
        }),
      });
    } finally {
      setSavingId(null);
    }
  }

  async function publishProyecto(id: string) {
    setSavingId(id);
    try {
      await fetch("/api/comunidad/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "proyecto", id, estado: "Publicado" }),
      });
      setProyectos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: "Publicado" } : p))
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-serif text-xl">Miembros ({members.length})</h2>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="rounded-xl border border-border p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={member.nombre}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m) =>
                        m.id === member.id ? { ...m, nombre: e.target.value } : m
                      )
                    )
                  }
                  className="rounded-md border border-border px-3 py-2 text-sm"
                />
                <input
                  value={member.email}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m) =>
                        m.id === member.id ? { ...m, email: e.target.value } : m
                      )
                    )
                  }
                  className="rounded-md border border-border px-3 py-2 text-sm"
                />
                <input
                  value={member.pais ?? ""}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m) =>
                        m.id === member.id ? { ...m, pais: e.target.value } : m
                      )
                    )
                  }
                  placeholder="País"
                  className="rounded-md border border-border px-3 py-2 text-sm"
                />
                <input
                  value={member.ciudad ?? ""}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m) =>
                        m.id === member.id ? { ...m, ciudad: e.target.value } : m
                      )
                    )
                  }
                  placeholder="Ciudad"
                  className="rounded-md border border-border px-3 py-2 text-sm"
                />
                <select
                  value={member.estado ?? "Pendiente"}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m) =>
                        m.id === member.id ? { ...m, estado: e.target.value } : m
                      )
                    )
                  }
                  className="rounded-md border border-border px-3 py-2 text-sm"
                >
                  {["Borrador", "Pendiente", "Publicado"].map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
                <select
                  value={member.tipo}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m) =>
                        m.id === member.id
                          ? { ...m, tipo: e.target.value as "miembro" | "admin" }
                          : m
                      )
                    )
                  }
                  className="rounded-md border border-border px-3 py-2 text-sm"
                >
                  <option value="miembro">Miembros</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => saveMember(member)}
                disabled={savingId === member.id}
                className="text-sm rounded-md border border-border px-3 py-1.5 hover:bg-muted"
              >
                {savingId === member.id ? "Guardando..." : "Guardar miembro"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl">Proyectos ({proyectos.length})</h2>
        {proyectos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin proyectos en la base.</p>
        ) : (
          <ul className="space-y-3">
            {proyectos.map((proyecto) => (
              <li key={proyecto.id} className="rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium">{proyecto.nombre}</p>
                  <p className="text-sm text-muted-foreground">{proyecto.autor}</p>
                  <p className="text-xs text-muted-foreground">{proyecto.estado ?? "Idea"}</p>
                </div>
                {proyecto.estado !== "Publicado" && (
                  <button
                    type="button"
                    onClick={() => publishProyecto(proyecto.id)}
                    disabled={savingId === proyecto.id}
                    className="text-sm rounded-md bg-primary px-3 py-1.5 text-primary-foreground"
                  >
                    Publicar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
