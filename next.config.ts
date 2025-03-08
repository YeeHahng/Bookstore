import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'books-data-for-cloudshelf.s3.amazonaws.com',
      'books-data-for-cloudshelf.s3.us-east-1.amazonaws.com',
      'via.placeholder.com'
    ],
  },
};

export default nextConfig;
