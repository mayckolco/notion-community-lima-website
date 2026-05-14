import { NextRequest, NextResponse } from "next/server";
import { scrapeLinkedInProfile } from "@/lib/linkedin/apify";
import { mapLinkedInToForm } from "@/lib/linkedin/map-to-form";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url || !url.includes("linkedin.com")) {
    return NextResponse.json({ error: "URL de LinkedIn inválida" }, { status: 400 });
  }

  if (!process.env.APIFY_TOKEN) {
    return NextResponse.json({ error: "Scraper no configurado" }, { status: 503 });
  }

  try {
    const profile = await scrapeLinkedInProfile(url);
    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const prefill = mapLinkedInToForm(profile);
    return NextResponse.json({ prefill });
  } catch (err) {
    console.error("[linkedin-profile]", err);
    return NextResponse.json({ error: "Error al obtener el perfil" }, { status: 500 });
  }
}
