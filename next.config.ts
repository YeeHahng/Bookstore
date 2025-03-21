/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'books-data-for-cloudshelf.s3.amazonaws.com',
      'books-data-for-cloudshelf.s3.us-east-1.amazonaws.com',
      'via.placeholder.com'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip type checking during builds for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Set these pages to be dynamically rendered instead of statically generated
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};

export default nextConfig;