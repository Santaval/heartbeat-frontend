import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/login") return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
      return NextResponse.next();
    }
    if (!(await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value))) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // device APIs are public
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // everything else = admin pages -> require session
  if (!(await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
