import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 2026-05-12 data realignment: renamed slugs after switching from
      // projected pricing to LiteLLM-verified real model data.
      // Preserve SEO link equity via 301 permanent redirects.
      {
        source: "/gemini-3-0-pro-cost-calculator",
        destination: "/gemini-3-1-pro-cost-calculator",
        permanent: true,
      },
      {
        source: "/gemini-3-0-flash-cost-calculator",
        destination: "/gemini-3-flash-cost-calculator",
        permanent: true,
      },
      {
        source: "/deepseek-v4-cost-calculator",
        destination: "/deepseek-v3-2-cost-calculator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
