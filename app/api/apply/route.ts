import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { applySchema } from "@/lib/schemas";
import { getSlot } from "@/lib/notion/slots";
import { uploadPhotoToNotion } from "@/lib/notion/speakers";
import { createVerificationToken } from "@/lib/verify-token";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getBaseUrl } from "@/lib/base-url";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

async function isValidImageFile(file: File): Promise<boolean> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return false;
  if (file.size > MAX_PHOTO_BYTES || file.size < 8) return false;

  const buf = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  // WebP: RIFF....WEBP
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return true;

  return false;
}

function formatSlotDate(fecha: string): string {
  try {
    return format(parseISO(fecha), "EEEE d 'de' MMMM", { locale: es });
  } catch {
    return fecha;
  }
}

export async function POST(req: NextRequest) {
  // 1) Rate limit: 5 submissions per IP per 10 minutes
  const { allowed } = rateLimit(`apply:${getClientIp(req)}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // 2) CSRF: reject cross-origin requests
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }

  // 3) Parse form data
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

  // 4) Validate photo server-side with magic bytes
  const photoField = formData.get("foto");
  let photo: File | null = null;
  if (photoField instanceof File && photoField.size > 0) {
    if (!(await isValidImageFile(photoField))) {
      return NextResponse.json(
        { error: "invalid_photo", details: "Only JPEG, PNG and WebP under 5 MB are accepted" },
        { status: 400 }
      );
    }
    photo = photoField;
  }

  // 5) Pre-check slot availability
  const slot = await getSlot(parsed.slotId);
  if (!slot || slot.estado !== "Disponible") {
    return NextResponse.json({ error: "slot_unavailable" }, { status: 409 });
  }

  // 6) Upload photo now so the file ID is embedded in the verification token.
  //    Notion file uploads remain valid for at least 24 h, matching our token TTL.
  let fotoId: string | null = null;
  if (photo) {
    fotoId = await uploadPhotoToNotion(photo);
  }

  // 7) Build signed verification token containing all form data + fotoId
  let token: string;
  try {
    token = createVerificationToken({ ...parsed, fotoId });
  } catch {
    console.error("[POST /api/apply] createVerificationToken failed: EMAIL_VERIFICATION_SECRET missing?");
    return NextResponse.json({ error: "server_misconfiguration" }, { status: 500 });
  }

  // 8) Send verification email
  const baseUrl = getBaseUrl(req);
  const verifyUrl = `${baseUrl}/api/verify?token=${encodeURIComponent(token)}`;

  try {
    await sendVerificationEmail({
      to: parsed.email,
      nombre: parsed.nombre,
      verifyUrl,
      slotLabel: formatSlotDate(slot.fecha),
    });
  } catch {
    console.error("[POST /api/apply] sendVerificationEmail failed");
    return NextResponse.json({ error: "email_failed" }, { status: 500 });
  }

  return NextResponse.json({ status: "email_sent" }, { status: 202 });
}
