import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Increase cache TTL for slow remote images
    minimumCacheTTL: 3600, // 1 hour
  },
  // Increase timeout for fetch operations and optimize on-demand entries
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 10, // Increased buffer
  },
};

export default nextConfig;
