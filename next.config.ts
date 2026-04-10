import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },

  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;