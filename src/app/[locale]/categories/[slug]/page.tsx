import { getCategoryBySlug, listReports } from '@/lib/data/adapter';
import { Container, ReportCard, Section } from '@/components';
import { JsonLd } from '@/components';
import { CollectionPage, WithContext } from 'schema-dts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next'; // Import Metadata

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params; // Destructure directly from params

  const category = await getCategoryBySlug(slug as string, locale as string); // Cast to string

  if (!category) {
    return {}; // Return empty metadata if category not found
  }

  return {
    title: category.seoTitle || category.name,
    description: category.seoDesc || category.description,
    // Add other meta tags as needed
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params; // Destructure directly from params

  const category = await getCategoryBySlug(slug as string, locale as string); // Cast to string

  if (!category) {
    notFound();
  }

  const reports = await listReports({ locale: locale as string, categorySlug: slug as string }); // Cast to string

  const categoryJsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `https://www.thebrainyinsights.com/${locale}/categories/${slug}`,
    mainEntity: reports.map(report => ({
      '@type': 'Article', // Assuming reports are articles
      headline: report.title,
      url: `https://www.thebrainyinsights.com/${locale}/reports/${report.slug}`,
    })),
  };

  return (
    <Section>
      <JsonLd data={categoryJsonLd} />
      <Container>
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-lg text-gray-600 mb-8">{category.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} locale={locale as string} />
          ))}
        </div>
      </Container>
    </Section>
  );
}