import { search } from '@/lib/data/adapter';
import { Container, ReportCard, Section, Pagination, SearchBar } from '@/components';



export default async function SearchPage({ params: { locale }, searchParams }: { params: { locale: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
  const query = searchParams?.['q'] as string || '';
  const page = searchParams?.['page'] ? parseInt(searchParams['page'] as string) : 1;
  const reports = await search({ q: query, locale, page });

  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-8">Search</h1>
        <SearchBar initialQuery={query} />

        {query && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">Results for &quot;{query}&quot;</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} locale={locale} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={10} />
          </>
        )}
      </Container>
    </Section>
  );
}