/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable cache handler temporarily
  // cacheHandler: undefined,
  
  experimental: {
    // Remove problematic experimental features temporarily
  },
  
  typescript: {
    // Ignore TypeScript errors during build (temporary)
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Ignore ESLint errors during build (temporary)
    ignoreDuringBuilds: false,
  },
  
  // Force dynamic rendering for all routes
  output: undefined,
  
  images: {
    domains: [],
  },
};

export default nextConfig;