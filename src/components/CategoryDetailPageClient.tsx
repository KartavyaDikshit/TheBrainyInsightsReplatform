"use client";

import { useState, useMemo } from 'react';
import { ReportCard } from '@tbi/ui';
import { CategoryDetailSidebar } from './CategoryDetailSidebar';
import { Button } from './ui/button';

interface ReportData {
  id: string;
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  publishedDate?: Date;
  pageCount?: number;
  singlePrice?: number;
  multiPrice?: number;
  corporatePrice?: number;
  downloadCount?: number;
  viewCount?: number;
  tags?: string[];
  geography?: string;
  reportType?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

interface CategoryDetailPageClientProps {
  initialReports: ReportData[];
  categoryName: string;
  popularReports: Array<{
    title: string;
    price: number;
    isNew?: boolean;
    slug: string;
  }>;
  relatedCategories: Array<{
    name: string;
    reportCount: number;
    slug: string;
  }>;
  locale: string;
}

const REPORTS_PER_PAGE = 8;

export function CategoryDetailPageClient({
  initialReports,
  categoryName,
  popularReports,
  relatedCategories,
  locale
}: CategoryDetailPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort reports by latest
  const sortedReports = useMemo(() => {
    return [...initialReports].sort((a, b) => {
      if (!a.publishedDate && !b.publishedDate) return 0;
      if (!a.publishedDate) return 1;
      if (!b.publishedDate) return -1;
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });
  }, [initialReports]);

  // Pagination
  const totalPages = Math.ceil(sortedReports.length / REPORTS_PER_PAGE);
  const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
  const displayedReports = sortedReports.slice(startIndex, startIndex + REPORTS_PER_PAGE);

  return (
    <>
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Reports Grid */}
            <div className="lg:col-span-3">
              {displayedReports.length > 0 ? (
                <div className="bg-indigo-500/20 hover:bg-indigo-500/30 transition-all duration-300 p-6 border border-black/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 mb-8">
                    {displayedReports.map((report) => (
                      <ReportCard 
                        key={report.id} 
                        id={report.id}
                        title={report.title}
                        description={report.description}
                        category={categoryName}
                        coverImage={report.coverImage || "https://images.unsplash.com/photo-1586864387507-c7761c02bc37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHJlcG9ydCUyMGNvdmVyJTIwZG9jdW1lbnRzfGVufDF8fHx8MTc1Njg3NjUxM3ww&ixlib=rb-4.1.0&q=80&w=1080"}
                        publishDate={report.publishedDate ? new Date(report.publishedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent'}
                        pages={report.pageCount || 150}
                        rating={4.5}
                        priceInfo={{
                          singleUser: report.singlePrice ? `$${report.singlePrice.toLocaleString()}` : '$2,500',
                          multiUser: report.multiPrice ? `$${report.multiPrice.toLocaleString()}` : '$3,750',
                          corporate: report.corporatePrice ? `$${report.corporatePrice.toLocaleString()}` : '$5,000'
                        }}
                        badges={[
                          ...(report.isNew ? ['New'] : []),
                          ...(report.isTrending ? ['Trending'] : [])
                        ]}
                        isFree={false}
                        slug={report.slug}
                        locale={locale}
                      />
                    ))}
                  </div>

                  {/* Pagination Navigation */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <Button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="bg-white"
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            variant={currentPage === page ? "default" : "outline"}
                            className={currentPage === page 
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" 
                              : "bg-white"
                            }
                            size="sm"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        className="bg-white"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-indigo-500/20 p-6 border border-black/30">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-600">
                    No reports are currently available in this category.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CategoryDetailSidebar 
                categoryName={categoryName}
                popularReports={popularReports}
                relatedCategories={relatedCategories}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
