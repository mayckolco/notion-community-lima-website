import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = ["notion.so", "amazonaws.com", "secure.notion-static.com", "prod-files-secure.s3"];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") ?? "cover.png";

  if (!url) return new NextResponse("Missing url", { status: 400 });

  const isAllowed = ALLOWED_HOSTS.some((host) => url.includes(host));
  if (!isAllowed) return new NextResponse("URL not allowed", { status: 403 });

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return new NextResponse("Failed to fetch file", { status: 502 });

  const contentType = res.headers.get("content-type") ?? "image/png";
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
