import { NextRequest, NextResponse } from "next/server";
import { syncTuesdays } from "@/lib/luma/sync";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncTuesdays();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron/sync-luma]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
