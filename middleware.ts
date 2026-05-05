import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
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
    "/admin/products/:path*",
    "/admin/categories/:path*",
    "/admin/subcategories/:path*",
    "/admin/settings/:path*",
  ],
};
