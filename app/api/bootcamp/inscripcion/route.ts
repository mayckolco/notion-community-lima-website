import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createBootcampInscripcion } from "@/lib/notion/bootcamp";
import { bootcampInscripcionSchema } from "@/lib/schemas";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 5 * 1024 * 1024;

async function isValidImageFile(file: File): Promise<boolean> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return false;
  if (file.size > MAX_FILE_BYTES || file.size < 8) return false;

  const buf = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return true;

  return false;
}

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(`bootcamp-inscripcion:${getClientIp(req)}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

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

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const raw = {
    reservaId: formData.get("reservaId"),
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    referencia: formData.get("referencia"),
  };

  let parsed: z.infer<typeof bootcampInscripcionSchema>;
  try {
    parsed = bootcampInscripcionSchema.parse(raw);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "invalid_payload", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const comprobanteField = formData.get("comprobante");
  if (!(comprobanteField instanceof File) || comprobanteField.size === 0) {
    return NextResponse.json({ error: "comprobante_required" }, { status: 400 });
  }

  if (!(await isValidImageFile(comprobanteField))) {
    return NextResponse.json(
      { error: "invalid_comprobante", details: "Solo PNG, JPG o WEBP (máx. 5 MB)" },
      { status: 400 }
    );
  }

  try {
    const result = await createBootcampInscripcion({
      ...parsed,
      comprobante: comprobanteField,
    });

    if (!result) {
      return NextResponse.json({ error: "reserva_unavailable" }, { status: 409 });
    }

    return NextResponse.json({
      leadId: result.leadId,
      referencia: parsed.referencia,
    });
  } catch (err) {
    console.error("[bootcamp/inscripcion]", err);
    return NextResponse.json({ error: "notion_error" }, { status: 500 });
  }
}
