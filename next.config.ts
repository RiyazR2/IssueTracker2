// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */

// };

// export default nextConfig;

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
