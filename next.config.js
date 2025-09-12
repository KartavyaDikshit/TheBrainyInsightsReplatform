/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tbi/database'],
  serverExternalPackages: ['@prisma/client'],
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  staticPageGenerationTimeout: 120
};

export default nextConfig;