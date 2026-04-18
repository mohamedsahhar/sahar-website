import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page + API
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/login")
  ) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("sa7ar_admin")?.value;

    console.log("COOKIE:", token);

    if (token !== "loggedin") {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/login"],
};