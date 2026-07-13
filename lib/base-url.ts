import type { NextRequest } from "next/server";

export const PRODUCTION_SITE_URL = "https://claude.ialabs.tech";

export function getBaseUrl(req?: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (req) {
    const host = req.headers.get("host");
    if (host) {
      const proto = req.headers.get("x-forwarded-proto") ?? "https";
      return `${proto}://${host}`;
    }
  }

  return PRODUCTION_SITE_URL;
}
