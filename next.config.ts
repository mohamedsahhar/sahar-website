import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },

  async redirects() {
    return [
      // ✅ Force non-www → www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "sa7arrepair.com",
          },
        ],
        destination: "https://www.sa7arrepair.com/:path*",
        permanent: true,
      },

      // ✅ Redirect /services → homepage
      {
        source: "/services",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;