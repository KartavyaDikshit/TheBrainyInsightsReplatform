import { getReportBySlug } from '@/lib/data/adapter';
import { Container, Section, Breadcrumbs } from '@tbi/ui'; // Removed JsonLd
import { notFound } from 'next/navigation';
// import { Article, WithContext } from 'schema-dts'; // Commented out
import { Metadata } from 'next'; // Import Metadata

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const report = await getReportBySlug(slug, locale);

  if (!report) {
    return {}; // Return empty metadata if report not found
  }

  return {
    title: report.metaTitle || report.title,
    description: report.metaDescription || report.summary,
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

  // const jsonLd: WithContext<Article> = { // Commented out
  //   '@context': 'https://schema.org', // Commented out
  //   '@type': 'Article', // Commented out
  //   headline: report.title, // Use report.title directly // Commented out
  //   description: report.summary, // Use report.summary directly // Commented out
  //   author: { // Commented out
  //     '@type': 'Organization', // Commented out
  //     name: 'The Brainy Insights', // Commented out
  //   }, // Commented out
  //   publisher: { // Commented out
  //     '@type': 'Organization', // Commented out
  //     name: 'The Brainy Insights', // Commented out
  //     logo: { // Commented out
  //       '@type': 'ImageObject', // Commented out
  //       url: 'https://www.thebrainyinsights.com/og-image.jpg', // Using the placeholder OG image for now // Commented out
  //     }, // Commented out
  //   }, // Commented out
  //   datePublished: report.publishedDate ? new Date(report.publishedDate).toISOString() : new Date().toISOString(), // placeholder // Commented out
  //   mainEntityOfPage: { // Commented out
  //     '@type': 'WebPage', // Commented out
  //     '@id': `https://www.thebrainyinsights.com/${locale}/reports/${slug}`, // Commented out
  //   }, // Commented out
  // }; // Commented out

  const breadcrumbItems = [
    { label: 'Home', href: `/${locale}` },
    { label: 'Reports', href: `/${locale}/reports` },
    { label: report.title, href: `/${locale}/reports/${slug}` }, // Use report.title directly
  ];

  return (
    <Section>
      {/* <JsonLd data={jsonLd} /> */} {/* Commented out */}
      <Container>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-4xl font-bold mt-4 mb-4">{report.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{report.summary}</p>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: report.description || '' }} />
      </Container>
    </Section>
  );
}