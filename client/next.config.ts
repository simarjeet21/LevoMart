import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   allowedDevOrigins: ["http://levomart.local"],
  // },
  allowedDevOrigins: [
    "http://levomart.local",
    "http://localhost:3000",
    "http://levomart.local/",
    "https://levomart.local",
  ],
  // onDemandEntries: {
  //   maxInactiveAge: 25 * 1000, // 25 seconds
  //   pagesBufferLength: 5,
  // },
  // // Helpful for debugging server errors
  // experimental: {
  //   typedRoutes: true,
  // },
};

export default nextConfig;
