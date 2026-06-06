import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60
const FIFTEEN_MINUTES_IN_MS = FIFTEEN_MINUTES_IN_SECONDS * 1000
const ADMIN_ACTIVITY_COOKIE = "admin_last_activity"
const AUTH_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.callback-url",
  "__Secure-next-auth.callback-url",
]

function applyNoCache(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  )
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")
  return response
}

function clearProtectedCookies(response: NextResponse) {
  for (const cookieName of AUTH_COOKIE_NAMES) {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
  }

  response.cookies.set(ADMIN_ACTIVITY_COOKIE, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  })

  return response
}

function isProtectedAdminPage(pathname: string) {
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")
}

function isProtectedApiRoute(req: NextRequest, pathname: string) {
  return pathname.startsWith("/api/admin")
}

function buildUnauthorizedResponse(req: NextRequest, isApiRequest: boolean) {
  const response = isApiRequest
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : NextResponse.redirect(new URL("/admin/login", req.url))

  return clearProtectedCookies(applyNoCache(response))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtectedPage = isProtectedAdminPage(pathname)
  const isProtectedApi = isProtectedApiRoute(req, pathname)

  if (pathname.startsWith("/admin/login")) {
    return applyNoCache(NextResponse.next())
  }

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return buildUnauthorizedResponse(req, isProtectedApi)
  }

  const lastActivityRaw = req.cookies.get(ADMIN_ACTIVITY_COOKIE)?.value
  const lastActivity = lastActivityRaw ? Number(lastActivityRaw) : Date.now()
  const isActivityExpired =
    Number.isNaN(lastActivity) ||
    Date.now() - lastActivity > FIFTEEN_MINUTES_IN_MS

  if (isActivityExpired) {
    return buildUnauthorizedResponse(req, isProtectedApi)
  }

  const response = applyNoCache(NextResponse.next())

  response.cookies.set(ADMIN_ACTIVITY_COOKIE, String(Date.now()), {
    httpOnly: true,
    maxAge: FIFTEEN_MINUTES_IN_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: req.nextUrl.protocol === "https:",
  })

  return response
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}
