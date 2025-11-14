interface Report {
  id: string;
  title: string;
  slug: string;
  pages: number;
  published_date: string | Date;
  single_price?: number;
  category_title?: string;
  description?: string;
}

interface ReportGridProps {
  reports: Report[];
}

// Helper function to format date
function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Helper function to format price
function formatPrice(price?: number): string {
  if (!price) return 'Contact for pricing';
  return `$${price.toLocaleString()}`;
}

export function ReportGrid({ reports }: ReportGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Reports</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access comprehensive market research and analysis from industry experts
          </p>
        </div>
        
        {/* Gradient Container wrapping the Reports Grid */}
        <div className="bg-indigo-600/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/30 shadow-lg">
          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <a
                key={report.id}
                href={`/en/reports/${report.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                {/* Category Badge */}
                {report.category_title && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {report.category_title}
                    </span>
                  </div>
                )}
                
                {/* Report Title */}
                <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                  {report.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {report.description || 'Comprehensive market research and industry analysis providing insights into trends, competitive landscape, and future projections.'}
                </p>
                
                {/* Report Metadata */}
                <div className="flex items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                      <line x1="16" x2="16" y1="2" y2="6"></line>
                      <line x1="8" x2="8" y1="2" y2="6"></line>
                      <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                    <span>{formatDate(report.published_date)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* View All Reports Button */}
        <div className="text-center mt-12">
          <a
            href="/en/reports"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            View All Reports
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="ml-2 w-5 h-5"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
