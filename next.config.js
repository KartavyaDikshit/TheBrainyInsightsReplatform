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
  
  staticPageGenerationTimeout: 120
};

export default nextConfig;