import { getReportBySlug } from '@/lib/data/adapter';
import { Container, Section, JsonLd, Breadcrumbs } from '@/components';
import { notFound } from 'next/navigation';
import { Article, WithContext } from 'schema-dts';
import { Metadata } from 'next'; // Import Metadata

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const report = await getReportBySlug(slug, locale);

  if (!report) {
    return {}; // Return empty metadata if report not found
  }

  return {
    title: report.seoTitle || report.title,
    description: report.seoDesc || report.summary,
    keywords: report.keywords,
    // Add other meta tags as needed, e.g., openGraph, twitter
  };
}

export default async function ReportPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const report = await getReportBySlug(slug, locale);

  if (!report) {
    notFound();
  }

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: report.title,
    description: report.summary,
    author: {
      '@type': 'Organization',
      name: 'The Brainy Insights',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Brainy Insights',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.thebrainyinsights.com/og-image.jpg', // Using the placeholder OG image for now
      },
    },
    datePublished: report.publishedAt ? new Date(report.publishedAt).toISOString() : new Date().toISOString(), // placeholder
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.thebrainyinsights.com/${locale}/reports/${slug}`,
    },
  };

  const breadcrumbItems = [
    { name: 'Home', href: `/${locale}` },
    { name: 'Reports', href: `/${locale}/reports` },
    { name: report.title, href: `/${locale}/reports/${slug}` },
  ];

  return (
    <Section>
      <JsonLd data={jsonLd} />
      <Container>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-4xl font-bold mt-4 mb-4">{report.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{report.summary}</p>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: report.bodyHtml }} />
      </Container>
    </Section>
  );
}