import { NextRequest, NextResponse } from "next/server";
import { COMMUNITY_SESSION_COOKIE_NAME } from "@/lib/auth/community-session";

export async function POST(req: NextRequest) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host")}`;

  const response = NextResponse.redirect(`${baseUrl}/comunidad`, { status: 303 });
  response.cookies.set({
    name: COMMUNITY_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
