import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const supportedLocales = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const finalLocale = locale || 'en';

  if (!supportedLocales.includes(finalLocale)) {
    notFound();
  }

  return {
    messages: (await import(`../../messages/${finalLocale}.json`)).default,
    locale: finalLocale // Explicitly return the locale
  };
});