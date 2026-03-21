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

    // Allow login page
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next()
    }

    // If not logged in → redirect
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  return NextResponse.next()
}

// Apply only to admin
export const config = {
  matcher: ["/admin/:path*"],
}