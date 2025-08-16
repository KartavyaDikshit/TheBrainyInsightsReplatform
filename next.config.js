import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable cache handler in production
  cacheHandler: process.env.NODE_ENV === 'production' 
    ? './cache-handler.cjs' // Directly provide the path
    : undefined,
    
  // Existing configuration
  experimental: {
    // Removed appDir as it's not a valid experimental flag in Next.js 15.4.6
  },
  
  // Add cache configuration
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Removed redirects as next-intl middleware handles locale redirection
  reactStrictMode: true, // This is a common Next.js config, adding it to force re-evaluation
  serverExternalPackages: ['@prisma/client'],
  images: {
    domains: [], // Add external image domains here if needed
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
