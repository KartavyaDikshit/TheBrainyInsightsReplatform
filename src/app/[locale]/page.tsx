import { Section, Container, CategoryCard, ReportCard } from '@/components';
import { listCategories, listReports } from '@/lib/data/adapter';



export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const categories = await listCategories(locale);
  const reports = await listReports({ locale, featured: true, size: 4 });

  return (
    <>
      <Section>
        <Container>
          <h1 className="text-3xl font-bold mb-4">Home Page</h1>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} locale={locale} />
            ))}
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Featured Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} locale={locale} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}