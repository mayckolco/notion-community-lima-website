import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { NOVEDADES_CACHE_TAG } from "@/lib/novedades/get-novedades";
import { fetchAnthropicNews } from "@/lib/novedades/fetch-anthropic";

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[cron/sync-novedades] CRON_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const xCronSecret = req.headers.get("x-cron-secret");
  const provided = bearerToken ?? xCronSecret;

  if (!provided || provided !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await fetchAnthropicNews();
    revalidateTag(NOVEDADES_CACHE_TAG);
    return NextResponse.json({ ok: true, count: items.length });
  } catch {
    console.error("[cron/sync-novedades] sync failed");
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
