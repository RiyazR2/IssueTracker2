// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */

// };

// export default nextConfig;

//************************************ */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  onDemandEntries: {
    webpackHotMiddleware: {
      client: false,
    },
  },
};

export default nextConfig;

/**************************************** */

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: false,
//   onDemandEntries: {
//     maxInactiveAge: 1000 * 60, // Example: Keep pages in memory for 1 minute
//     pagesBufferLength: 5, // Example: Keep 5 pages in memory
//   },
// };

// export default nextConfig;
