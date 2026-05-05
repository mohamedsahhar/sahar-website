import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.localhost",
    "sa7arrepair.com",
    "www.sa7arrepair.com",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async redirects() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/services",
          destination: "/",
          permanent: true,
        },
      ];
    }

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
