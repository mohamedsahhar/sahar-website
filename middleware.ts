import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl

  // Protect admin routes
  if (pathname.startsWith("/admin")) {

    // ✅ Allow login page always
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next()
    }

    // ❌ Not logged in → redirect
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // 🔒 NEW: Role protection
    const role = token.role

    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

// Apply only to admin
export const config = {
  matcher: ["/admin/:path*"],
}