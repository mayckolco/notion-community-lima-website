import { NextResponse } from "next/server";
import { listSlots } from "@/lib/notion/slots";

export const revalidate = 60;

export async function GET() {
  try {
    const slots = await listSlots();
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("[GET /api/slots]", err);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
