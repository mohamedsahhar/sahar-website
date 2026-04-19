export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin",
    "/admin/repairs/:path*",
    "/admin/brands/:path*",
    "/admin/devices/:path*",
  ],
};