import { getReportBySlug } from '@/lib/data/adapter';
import { Container, Section, JsonLd, Breadcrumbs } from '@/components';
import { notFound } from 'next/navigation';
import { Article, WithContext } from 'schema-dts';



export default async function ReportPage({ params: { locale, slug } }: { params: { locale: string, slug: string } }) {
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
        url: 'https://www.thebrainyinsights.com/assets/images/logo.png',
      },
    },
    datePublished: new Date().toISOString(), // placeholder
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