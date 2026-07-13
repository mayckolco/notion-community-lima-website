import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verify-token";
import { getSlot, confirmWebinar } from "@/lib/notion/slots";
import { findSpeakerByEmail, createSpeakerProfile } from "@/lib/notion/speakers";
import { getBaseUrl } from "@/lib/base-url";

export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl(req);

  const redirect = (error: string) =>
    NextResponse.redirect(`${baseUrl}/verificando?error=${error}`);

  // 1) Decode and verify token
  const rawToken = req.nextUrl.searchParams.get("token");
  if (!rawToken) return redirect("token_invalido");

  const data = verifyToken(rawToken);
  if (!data) return redirect("link_expirado");

  // 2) Check slot is still available
  const slot = await getSlot(data.slotId);
  if (!slot || slot.estado !== "Disponible") {
    return redirect("fecha_tomada");
  }

  // 3) Find or create speaker profile
  let speakerId = await findSpeakerByEmail(data.email);
  if (!speakerId) {
    const { fotoId, ...speakerData } = data;
    try {
      speakerId = await createSpeakerProfile(speakerData, null, fotoId ?? undefined);
    } catch {
      console.error("[GET /api/verify] createSpeakerProfile failed");
      return redirect("error_interno");
    }
  }

  // 4) Confirm slot
  try {
    await confirmWebinar(data.slotId, speakerId, {
      titulo: data.titulo,
      herramientas: data.herramientas,
      descripcion: data.descripcion,
    });
  } catch {
    console.error("[GET /api/verify] confirmWebinar failed");
    return redirect("error_interno");
  }

  return NextResponse.redirect(`${baseUrl}/gracias?tipo=speaker`);
}
