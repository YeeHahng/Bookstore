import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['books-data-for-cloudshelf.s3.amazonaws.com'],
  },
};

export default nextConfig;
