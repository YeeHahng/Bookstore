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
  typescript: {
    ignoreBuildErrors: true,
  },
  // Turn off static generation completely
  output: 'standalone'
};

export default nextConfig;