import { NextRequest, NextResponse } from "next/server";
import { syncTuesdays } from "@/lib/luma/sync";

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[cron/sync-luma] CRON_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // Vercel sends: Authorization: Bearer <CRON_SECRET>
  // Manual calls can use: x-cron-secret: <CRON_SECRET>
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const xCronSecret = req.headers.get("x-cron-secret");
  const provided = bearerToken ?? xCronSecret;

  if (!provided || provided !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncTuesdays();
    return NextResponse.json({ ok: true, ...result });
  } catch {
    console.error("[cron/sync-luma] sync failed");
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
