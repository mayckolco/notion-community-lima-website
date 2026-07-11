import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { appendBootcampEncuesta } from "@/lib/notion/bootcamp";
import { bootcampEncuestaSchema } from "@/lib/schemas";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(`bootcamp-encuesta:${getClientIp(req)}`, 10, 10 * 60 * 1000);
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  let parsed: z.infer<typeof bootcampEncuestaSchema>;
  try {
    parsed = bootcampEncuestaSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "invalid_payload", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const ok = await appendBootcampEncuesta(parsed.leadId, {
      dedicacion: parsed.dedicacion,
      nivelIa: parsed.nivelIa,
      problema: parsed.problema,
      herramientas: parsed.herramientas,
      expectativas: parsed.expectativas,
    });

    if (!ok) {
      return NextResponse.json({ error: "update_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[bootcamp/encuesta]", err);
    return NextResponse.json({ error: "notion_error" }, { status: 500 });
  }
}
