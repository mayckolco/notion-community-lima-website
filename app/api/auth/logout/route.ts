import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getBaseUrl } from "@/lib/base-url";

export async function POST(req: NextRequest) {
  const baseUrl = getBaseUrl(req);

  const response = NextResponse.redirect(`${baseUrl}/portal/login`, { status: 303 });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
