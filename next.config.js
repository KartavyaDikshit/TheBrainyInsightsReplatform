import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed redirects as next-intl middleware handles locale redirection
  reactStrictMode: true, // This is a common Next.js config, adding it to force re-evaluation
  serverExternalPackages: ['@prisma/client'],
  images: {
    domains: [], // Add external image domains here if needed
  },
};

export default withNextIntl(nextConfig);
