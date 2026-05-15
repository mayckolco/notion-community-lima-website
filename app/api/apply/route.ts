import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { applySchema } from "@/lib/schemas";
import { getSlot, lockSlot } from "@/lib/notion/slots";
import { archiveSpeaker, createSpeaker } from "@/lib/notion/speakers";

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

  // 3) Create Speaker page
  let speakerId: string;
  try {
    speakerId = await createSpeaker(parsed, parsed.slotId, photo);
  } catch (err) {
    console.error("[POST /api/apply] createSpeaker failed:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  // 4) Re-read slot to guard against race condition
  const freshSlot = await getSlot(parsed.slotId);
  if (!freshSlot || freshSlot.estado !== "Disponible") {
    await archiveSpeaker(speakerId).catch(console.error);
    return NextResponse.json({ error: "slot_unavailable" }, { status: 409 });
  }

  // 5) Lock the slot
  try {
    await lockSlot(parsed.slotId);
  } catch (err) {
    console.error("[POST /api/apply] lockSlot failed:", err);
    await archiveSpeaker(speakerId).catch(console.error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json({ speakerId, slotId: parsed.slotId }, { status: 201 });
}
