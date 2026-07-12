import { redirect } from "next/navigation";

/** Rutas de detalle legacy: redirigen al catálogo actual */
export default function ProgramaDetalleLegacyPage() {
  redirect("/programas/profesionales");
}
