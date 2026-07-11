import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchBootcampFechas } from "@/lib/notion/bootcamp";

const modalidadSchema = z.enum(["virtual", "presencial"]);

export async function GET(req: NextRequest) {
  const modalidadRaw = req.nextUrl.searchParams.get("modalidad");
  let modalidad: z.infer<typeof modalidadSchema>;
  try {
    modalidad = modalidadSchema.parse(modalidadRaw);
  } catch {
    return NextResponse.json({ error: "invalid_modalidad" }, { status: 400 });
  }

  try {
    const fechas = await fetchBootcampFechas(modalidad);
    return NextResponse.json({ fechas });
  } catch (err) {
    console.error("[bootcamp/fechas]", err);
    return NextResponse.json({ error: "notion_error" }, { status: 500 });
  }
}
