import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {hostname : "lh3.googleusercontent.com"},
      {
        hostname: "images.unsplash.com",
        protocol: "https"
      },
      {
        hostname: "res.cloudinary.com",
      }
    ],
  },
};

export default nextConfig;
