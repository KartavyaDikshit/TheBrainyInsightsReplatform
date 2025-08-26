import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Supported locales
const locales = ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko'] as const;
const defaultLocale = 'en' as const;

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    // Check if pathname starts with a locale
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Redirect if no locale in pathname
    if (!pathnameHasLocale) {
      // Get locale from Accept-Language header or use default
      const locale = getLocale(request) || defaultLocale;
      
      // Redirect to the same pathname with locale prefix
      const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Add security headers
    const response = NextResponse.next();
    
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

function getLocale(request: NextRequest): string {
  // Simple locale detection from Accept-Language
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    for (const locale of locales) {
      if (acceptLanguage.includes(locale)) {
        return locale;
      }
    }
  }
  return defaultLocale;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - robots.txt
    // - sitemap.xml
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};