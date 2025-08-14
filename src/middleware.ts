import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import auth from 'next-auth/middleware'; // Import auth from next-auth/middleware
import { Session } from 'next-auth';
import { locales, defaultLocale } from './config/i18n'; // Import locales and defaultLocale from shared config

const handleIntlRouting = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

const authMiddleware = auth((request) => {
  return handleIntlRouting(request);
});

export const middleware = authMiddleware;

export const config = {
  // Match all request paths except for:
  // - API routes (starting with /api)
  // - Next.js internal paths (starting with /_next)
  // - Static files (containing a dot, e.g., favicon.ico)
  // - The auth pages themselves, to avoid redirect loops
  matcher: [
    '/((?!api|_next|auth|[^/.]+\.[^/.]+$).*)/',
    '/dashboard/:path*', 
    '/admin/:path*', 
  ],
};
