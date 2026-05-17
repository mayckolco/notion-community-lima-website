import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { applySchema } from "@/lib/schemas";
import { getSlot, confirmWebinar } from "@/lib/notion/slots";
import { findSpeakerByEmail, createSpeakerProfile, archiveSpeaker } from "@/lib/notion/speakers";

export async function POST(req: NextRequest) {
  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_payload", details: "Expected multipart/form-data" }, { status: 400 });
  }

  const raw = {
    slotId: formData.get("slotId"),
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    linkedin: formData.get("linkedin"),
    whatsapp: formData.get("whatsapp"),
    rol: formData.get("rol"),
    empresa: formData.get("empresa"),
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion"),
    herramientas: formData.getAll("herramientas"),
  };

  let parsed: z.infer<typeof applySchema>;
  try {
    parsed = applySchema.parse(raw);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "invalid_payload", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  // 1) Pre-check: slot must still be Disponible
  const slot = await getSlot(parsed.slotId);
  if (!slot || slot.estado !== "Disponible") {
    return NextResponse.json({ error: "slot_unavailable" }, { status: 409 });
  }

  // 2) Get photo
  const photoField = formData.get("foto");
  const photo = photoField instanceof File && photoField.size > 0 ? photoField : null;

  // 3) Find existing speaker or create new profile
  let speakerId = await findSpeakerByEmail(parsed.email);
  const speakerIsNew = speakerId === null;

  if (speakerIsNew) {
    try {
      speakerId = await createSpeakerProfile(parsed, photo);
    } catch (err) {
      console.error("[POST /api/apply] createSpeakerProfile failed:", err);
      return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
  }

  // 4) Re-read slot to guard against race condition
  const freshSlot = await getSlot(parsed.slotId);
  if (!freshSlot || freshSlot.estado !== "Disponible") {
    if (speakerIsNew && speakerId) {
      await archiveSpeaker(speakerId).catch(console.error);
    }
    return NextResponse.json({ error: "slot_unavailable" }, { status: 409 });
  }

  // 5) Update webinar with talk data and link to speaker
  try {
    await confirmWebinar(parsed.slotId, speakerId!, {
      titulo: parsed.titulo,
      herramientas: parsed.herramientas,
      descripcion: parsed.descripcion,
    });
  } catch (err) {
    console.error("[POST /api/apply] confirmWebinar failed:", err);
    if (speakerIsNew && speakerId) {
      await archiveSpeaker(speakerId).catch(console.error);
    }
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json({ speakerId, slotId: parsed.slotId }, { status: 201 });
}
