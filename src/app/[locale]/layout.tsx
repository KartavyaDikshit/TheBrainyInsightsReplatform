import React from 'react';
import { Metadata } from 'next';
import { SiteHeader, SiteFooter, Container, MainNav, LanguageSwitcher } from '@/components';
import { getConfig } from '@/lib/data/adapter';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server'; // This will use the i18n.ts configuration


export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const { locales } = getConfig();
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  const alternates: { [key: string]: string } = {};
  locales.forEach(l => {
    alternates[l] = `${baseUrl}/${l}`;
  });

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternates,
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(); // Load messages for the current locale

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <MainNav />
          <LanguageSwitcher />
          <Container>
            {children}
          </Container>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}