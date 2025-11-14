"use client";

import { useState, useMemo } from 'react';
import { ReportCard } from '@tbi/ui';
import { Input } from "@tbi/ui";
import { Button } from './ui/button';
import { Search } from "lucide-react";

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

const REPORTS_PER_PAGE = 9;

export function CategoryDetailPageClient({
  initialReports,
  categoryName,
  popularReports,
  relatedCategories,
  locale
}: CategoryDetailPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    // First filter by search term
    const filtered = initialReports.filter(report => {
      if (searchTerm === "") return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        report.title.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower) ||
        (report.tags && report.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    });

    // Then sort by latest
    return filtered.sort((a, b) => {
      if (!a.publishedDate && !b.publishedDate) return 0;
      if (!a.publishedDate) return 1;
      if (!b.publishedDate) return -1;
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });
  }, [initialReports, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReports.length / REPORTS_PER_PAGE);
  const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
  const displayedReports = filteredAndSortedReports.slice(startIndex, startIndex + REPORTS_PER_PAGE);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <>
      {/* Main Content Area */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Reports Grid */}
          {displayedReports.length > 0 ? (
            <div>
              {/* Gradient Container wrapping Search Bar and Reports Grid */}
              <div className="bg-indigo-600/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/30 shadow-lg mb-8">
                {/* Search Bar - matching categories page style */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 bg-white border-gray-300"
                    />
                  </div>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="bg-indigo-600/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/30 shadow-lg">
              {/* Search Bar - matching categories page style */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white border-gray-300"
                  />
                </div>
              </div>

              {/* Empty State */}
              <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
                <div className="max-w-md mx-auto">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm 
                      ? `No reports match your search "${searchTerm}"`
                      : "No reports are currently available in this category."
                    }
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
