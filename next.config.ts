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
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;