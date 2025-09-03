"use client";

import { useState, useMemo } from 'react';
import { CategoryFilterSortBar } from './CategoryFilterSortBar';
import { CategoryReportCard } from './CategoryReportCard';
import { CategoryDetailSidebar } from './CategoryDetailSidebar';
import { Button } from './ui/button';

interface ReportData {
  id: string;
  title: string;
  description: string;
  slug: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = initialReports;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.tags && report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          if (!a.publishedDate && !b.publishedDate) return 0;
          if (!a.publishedDate) return 1;
          if (!b.publishedDate) return -1;
          return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
        case 'oldest':
          if (!a.publishedDate && !b.publishedDate) return 0;
          if (!a.publishedDate) return 1;
          if (!b.publishedDate) return -1;
          return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
        case 'price-low':
          return (a.singlePrice || 0) - (b.singlePrice || 0);
        case 'price-high':
          return (b.singlePrice || 0) - (a.singlePrice || 0);
        case 'popular':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [initialReports, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReports.length / REPORTS_PER_PAGE);
  const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
  const displayedReports = filteredAndSortedReports.slice(startIndex, startIndex + REPORTS_PER_PAGE);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <>
      <CategoryFilterSortBar
        totalResults={filteredAndSortedReports.length}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        initialSort={sortBy}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Reports Grid */}
            <div className="lg:col-span-3">
              {displayedReports.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 mb-8">
                    {displayedReports.map((report) => (
                      <CategoryReportCard 
                        key={report.id} 
                        {...report}
                        locale={locale}
                      />
                    ))}
                  </div>

                  {/* Load More / Pagination */}
                  {currentPage < totalPages && (
                    <div className="text-center">
                      <Button 
                        onClick={loadMore}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      >
                        Load More Reports ({filteredAndSortedReports.length - (currentPage * REPORTS_PER_PAGE)} remaining)
                      </Button>
                    </div>
                  )}

                  {/* Pagination Info */}
                  <div className="mt-6 text-center text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(startIndex + REPORTS_PER_PAGE, filteredAndSortedReports.length)} of {filteredAndSortedReports.length} reports
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? "Try adjusting your search criteria to find what you're looking for."
                      : "No reports are currently available in this category."
                    }
                  </p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </Button>
                  )}
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
