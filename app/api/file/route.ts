import { NextRequest, NextResponse } from "next/server";
import { isAllowedNotionFileUrl } from "@/lib/notion/files";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) return new NextResponse("Missing url", { status: 400 });
  if (!isAllowedNotionFileUrl(url)) {
    return new NextResponse("URL not allowed", { status: 403 });
  }

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return new NextResponse("Failed to fetch file", { status: 502 });

  const contentType = res.headers.get("content-type") ?? "image/png";
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, no-store, max-age=0, must-revalidate",
    },
  });
}
