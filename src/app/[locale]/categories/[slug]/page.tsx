import { getCategoryBySlug, listReports } from '@/lib/data/adapter';
import { Container, ReportCard, Section } from '@/components';
import { notFound } from 'next/navigation';



export default async function CategoryPage({ params: { locale, slug } }: { params: { locale: string, slug: string } }) {
  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    notFound();
  }

  const reports = await listReports({ locale, categorySlug: slug });

  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-lg text-gray-600 mb-8">{category.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
