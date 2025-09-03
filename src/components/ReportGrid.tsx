import { Button } from './ui/button';
import { Card } from './ui/card';

interface Report {
  id: string;
  title: string;
  slug: string;
  pages: number;
  published_date: string | Date;
  single_price?: number;
  category_title?: string;
  avg_rating?: number;
  review_count?: number;
}

interface ReportGridProps {
  reports: Report[];
}

export function ReportGrid({ reports }: ReportGridProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Reports</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Latest research from our network of industry experts and analysts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="mb-4">
                {report.category_title && (
                  <div className="text-sm text-indigo-600 font-medium mb-2">
                    {report.category_title}
                  </div>
                )}
                <h3 className="font-semibold mb-3 leading-tight line-clamp-2">
                  <a href={`/reports/${report.slug}`} className="hover:text-indigo-600 transition-colors">
                    {report.title}
                  </a>
                </h3>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span>{report.pages} pages</span>
                  <span>•</span>
                  <span>{new Date(report.published_date).getFullYear()}</span>
                </div>

                {/* Rating Display */}
                {report.avg_rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(report.avg_rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      ({report.review_count} reviews)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <a href={`/en/reports/${report.slug}`}>View report</a>
                </Button>
                <Button variant="outline" className="flex-1">
                  Request sample
                </Button>
              </div>
              
              {report.single_price && (
                <div className="mt-3 text-right">
                  <span className="font-semibold text-indigo-600">
                    ${report.single_price.toLocaleString()}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
