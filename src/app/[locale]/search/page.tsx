import { search } from '@/lib/data/adapter';
import { ReportCard, Pagination, SearchBar } from '@tbi/ui';
import Section from '@tbi/ui/Section';
import Container from '@tbi/ui/Container';



export default async function SearchPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { locale } = await params;
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams?.['q'] as string || '';
  const page = awaitedSearchParams?.['page'] ? parseInt(awaitedSearchParams['page'] as string) : 1;
  const reports = await search({ q: query, locale, page });

  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold mb-8">Search</h1>
        <SearchBar initialQuery={query} locale={locale} />

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