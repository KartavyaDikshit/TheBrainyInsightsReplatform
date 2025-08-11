import { listReports } from '@/lib/data/adapter';
import { Container, ReportCard, Section, Pagination } from '@/components';



export default async function ReportsPage({ params: { locale }, searchParams }: { params: { locale: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
  const page = searchParams?.['page'] ? parseInt(searchParams['page'] as string) : 1;
  const reports = await listReports({ locale, page });

  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-8">All Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} locale={locale} />
          ))}
        </div>

        <Pagination currentPage={page} totalPages={10} />
      </Container>
    </Section>
  );
}