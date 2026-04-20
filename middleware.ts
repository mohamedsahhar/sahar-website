import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {},
  {
    callbacks: {
      authorized: ({ token }) => {
        return token?.role === "SUPER_ADMIN";
      },
    },

    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/repairs/:path*",
    "/admin/brands/:path*",
    "/admin/devices/:path*",
    "/admin/settings/:path*",
  ],
};