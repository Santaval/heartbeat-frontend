import { cookies } from "next/headers";
import { readJsonBody } from "@/lib/body";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await readJsonBody(req);
  const password = typeof body.password === "string" ? body.password : "";

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return Response.json({ ok: false, error: "invalid" }, { status: 401 });
  }

  const token = await createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return Response.json({ ok: true });
}
