import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config/i18n';
const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
});
export default async function middleware(request) {
    // Apply internationalization middleware
    const response = intlMiddleware(request);
    // You can add other middleware logic here that is Edge-compatible
    // For authentication, consider using NextAuth.js's built-in middleware
    // or checking session tokens directly if they are JWTs.
    // Do NOT import Node.js-specific code here.
    return response;
}
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/dashboard/:path*',
        '/admin/:path*',
    ],
};
