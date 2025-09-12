import React from 'react';
import { Metadata } from 'next';
import { ClientReportPage } from '@/components/ClientReportPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  
  // Sample metadata for all report pages
  return {
    title: "Global AI Market Report 2025-2032 | TheBrainyInsights",
    description: "In-depth analysis of the global artificial intelligence market with forecasts, trends, and strategic insights for 2025-2032.",
    keywords: ["artificial intelligence", "AI market", "market research", "technology"],
    openGraph: {
      title: "Global AI Market Report 2025-2032 | TheBrainyInsights",
      description: "In-depth analysis of the global artificial intelligence market with forecasts, trends, and strategic insights for 2025-2032.",
      url: `https://www.thebrainyinsights.com/${locale}/reports/${slug}`,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Global AI Market Report",
        },
      ],
      locale: locale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "Global AI Market Report 2025-2032 | TheBrainyInsights",
      description: "In-depth analysis of the global artificial intelligence market with forecasts, trends, and strategic insights for 2025-2032.",
      images: ["/twitter-image.jpg"],
    },
  };
}

export default async function ReportPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  
  return <ClientReportPage locale={locale} slug={slug} />;
}