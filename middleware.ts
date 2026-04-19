import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    "/admin",
    "/admin/repairs/:path*",
    "/admin/brands/:path*",
    "/admin/devices/:path*",
    "/admin/settings/:path*",
  ],
};