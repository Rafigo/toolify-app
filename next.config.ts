import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/_i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/planning-poker",
        destination: "/planning-poker/admin/dashboard",
        permanent: true,
      },
      {
        source: "/planning-poker/admin",
        destination: "/planning-poker/admin/dashboard",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
