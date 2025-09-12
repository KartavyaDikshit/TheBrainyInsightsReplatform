import { search } from '@/lib/data/adapter';
import { ReportCard } from '@tbi/ui';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import SearchBar from '@tbi/ui/SearchBar';
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
                <ReportCard 
                  key={report.id}
                  id={report.id}
                  title={report.title}
                  description={report.description || report.summary || ""}
                  category="Search Results"
                  coverImage="https://images.unsplash.com/photo-1615867636682-5a5c5f8f3a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZGlnaXRhbCUyMGRhdGF8ZW58MXx8fHwxNzU3NDc2OTc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  publishDate={report.publishedDate?.toDateString() || "Unknown"}
                  pages={100}
                  rating={4.5}
                  priceInfo={{
                    singleUser: "$3,500",
                    multiUser: "$5,250",
                    corporate: "$7,000"
                  }}
                  badges={["Search Result"]}
                  isFree={false}
                  slug={report.slug}
                  locale={locale}
                />
              ))}
            </div>
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                {page < 10 && (
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </>
        )}
      </Container>
    </Section>
  );
}