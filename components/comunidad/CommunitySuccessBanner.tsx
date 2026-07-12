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
      ¡Perfil confirmado! Ya apareces en el mapa de la comunidad.{" "}
      <Link href="/comunidad" className="text-primary hover:underline underline-offset-4">
        Actualizar vista
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
