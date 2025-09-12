import { ReportCard } from "./ReportCard";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  publishDate: string;
  pages: number;
  rating: number;
  priceInfo: {
    singleUser: string;
    multiUser: string;
    corporate: string;
  };
  badges: string[];
  isFree?: boolean;
  slug: string;
}

interface ReportsGridProps {
  reports: Report[];
  locale: string;
  itemsPerPage?: number;
  showPlaceholders?: boolean;
}

export function ReportsGrid({ reports, locale, itemsPerPage = 6, showPlaceholders = true }: ReportsGridProps) {
  const placeholdersToRender = showPlaceholders ? Math.max(0, itemsPerPage - reports.length) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          id={report.id}
          title={report.title}
          description={report.description}
          category={report.category}
          coverImage={report.coverImage}
          publishDate={report.publishDate}
          pages={report.pages}
          rating={report.rating}
          priceInfo={report.priceInfo}
          badges={report.badges}
          isFree={report.isFree}
          slug={report.slug}
          locale={locale}
        />
      ))}

      {Array.from({ length: placeholdersToRender }).map((_, idx) => (
        <Card key={`placeholder-${idx}`} className="overflow-hidden border border-gray-200 bg-white">
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <Skeleton className="w-full h-full" />
          </div>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
