// src/app/[locale]/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '800', '900'],
  variable: '--font-inter',
  display: 'swap' 
});

function getDir(locale: string) {
  // Add any RTL locales you support
  return ['ar', 'he', 'fa', 'ur'].includes(locale) ? 'rtl' : 'ltr';
}

export default function RootLayout(props: { children: ReactNode; params: { locale: string } }) {
  const { children, params: { locale } } = props;

  // IMPORTANT:
  // - Do NOT use `typeof window` or any client-only checks here.
  // - Keep dir/lang deterministic on the server.
  // - `suppressHydrationWarning` avoids noise if a client provider tweaks <html> later.
  return (
    <html lang={locale || 'en'} dir={getDir(locale || 'en')} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
