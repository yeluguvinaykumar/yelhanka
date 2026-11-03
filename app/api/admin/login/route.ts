import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_SECONDS, createSessionToken, safeCompare } from "@/lib/auth";

const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.reset > now && record.count >= 6) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD || "tasty-treasures";
  const valid = await safeCompare(password, expected);

  if (!valid) {
    const current = attempts.get(ip);
    attempts.set(ip, {
      count: (current && current.reset > now ? current.count : 0) + 1,
      reset: now + 10 * 60 * 1000,
    });
    return NextResponse.json({ error: "That password does not match." }, { status: 401 });
  }

  attempts.delete(ip);
  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return response;
}
