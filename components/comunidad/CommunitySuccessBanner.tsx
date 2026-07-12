"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function BannerContent() {
  const params = useSearchParams();
  if (params.get("registro") !== "ok") return null;

  return (
    <div
      role="status"
      className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground"
    >
      ¡Perfil confirmado! Ya puedes editar tu perfil y ver las sesiones.{" "}
      <Link href="/cuenta" className="text-primary hover:underline underline-offset-4">
        Ir a mi cuenta
      </Link>
    </div>
  );
}

export function CommunitySuccessBanner() {
  return (
    <Suspense fallback={null}>
      <BannerContent />
    </Suspense>
  );
}
