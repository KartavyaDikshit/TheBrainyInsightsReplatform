import "../globals.css";
import type { Metadata } from "next";
import { headers } from 'next/headers';
import { Inter } from "next/font/google";
import getServerSession from "next-auth";
import Link from "next/link";
// import { getMessages } from "next-intl/server";
// import { auth } from "@/lib/auth";
 
// import { Providers } from "../providers"; 
// import { LocaleSwitcher } from "@/components";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TheBrainyInsights Replatform",
  description: "Market Research Reports with SEO and Multilingual Support",
  keywords: "market research, industry reports, business intelligence, global markets, multilingual, SEO",
  openGraph: {
    title: "TheBrainyInsights Replatform",
    description: "Market Research Reports with SEO and Multilingual Support",
    url: "https://www.thebrainyinsights.com",
    siteName: "TheBrainyInsights",
    images: [
      {
        url: "https://www.thebrainyinsights.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TheBrainyInsights",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheBrainyInsights Replatform",
    description: "Market Research Reports with SEO and Multilingual Support",
    images: ["https://www.thebrainyinsights.com/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.thebrainyinsights.com",
    languages: {
      "en-US": "https://www.thebrainyinsights.com/en",
      "ja-JP": "https://www.thebrainyinsights.com/ja",
      "de-DE": "https://www.thebrainyinsights.com/de",
      "es-ES": "https://www.thebrainyinsights.com/es",
      "fr-FR": "https://www.thebrainyinsights.com/fr",
      "it-IT": "https://www.thebrainyinsights.com/it",
      "ko-KR": "https://www.thebrainyinsights.com/ko",
      "x-default": "https://www.thebrainyinsights.com/en",
    },
  },
};

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const { locale } = params;

  const RTL_LOCALES = ['ar', 'he']; // Example RTL locales
  const isRtl = RTL_LOCALES.includes(locale);

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} font-sans`}>
        {/* <Providers messages={messages} locale={locale}> */}
          {children}
        {/* </Providers> */}
      </body>
    </html>
  );
}