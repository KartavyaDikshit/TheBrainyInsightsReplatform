"use client";

import { useState, useMemo } from "react";
import Container from "../Container";
import Section from "../Section";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { ReportsGrid } from "../components/ReportsGrid";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";

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

interface ListingTemplateProps {
  title: string;
  reports: Report[];
  locale: string;
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  onSort?: (sortBy: string) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
}

export function ListingTemplate({
  title,
  reports,
  locale,
  onSearch,
  onFilter,
  onSort,
  showFilters = true,
  showSearch = true,
  showPagination = true,
  itemsPerPage = 6
}: ListingTemplateProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    reportTypes: [] as string[],
    priceRanges: [] as string[],
    dateRanges: [] as string[],
    priceRange: [0, 10000] as [number, number]
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    onSearch?.(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    onSort?.(value);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
    onFilter?.(selectedFilters);
  };

  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports.filter(report => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedFilters.categories.length === 0 || 
        selectedFilters.categories.includes(report.category);

      return matchesSearch && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = parseInt(a.priceInfo.singleUser.replace(/[^0-9]/g, "")) || 0;
          const priceB = parseInt(b.priceInfo.singleUser.replace(/[^0-9]/g, "")) || 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = parseInt(a.priceInfo.singleUser.replace(/[^0-9]/g, "")) || 0;
          const priceB = parseInt(b.priceInfo.singleUser.replace(/[^0-9]/g, "")) || 0;
          return priceB - priceA;
        });
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [reports, searchTerm, selectedFilters, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredAndSortedReports.slice(startIndex, startIndex + itemsPerPage);

  const activeFiltersCount = 
    selectedFilters.categories.length + 
    selectedFilters.reportTypes.length + 
    selectedFilters.priceRanges.length + 
    selectedFilters.dateRanges.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with consistent background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800" style={{ height: '323.75px' }}>
        {/* Professional Background Pattern */}
        <div className="absolute inset-0">
          {/* Geometric overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-indigo-700/95 to-purple-800/90"></div>
          
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-purple-300/10 rounded-lg rotate-45 blur-lg"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-300/10 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/5 rounded-lg rotate-12 blur-xl"></div>
          
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              Discover comprehensive market research reports and industry insights
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      {showSearch && (
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          resultsCount={filteredAndSortedReports.length}
          onFilterClick={handleFilterClick}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {paginatedReports.length > 0 ? (
          <>
            <ReportsGrid 
              reports={paginatedReports} 
              locale={locale} 
              itemsPerPage={itemsPerPage}
              showPlaceholders={true}
            />
            
            {showPagination && totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No reports found</div>
            <p className="text-gray-400">
              {searchTerm ? `No results for "${searchTerm}"` : "Try adjusting your filters"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
