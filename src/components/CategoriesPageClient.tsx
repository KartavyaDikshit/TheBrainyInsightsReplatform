"use client";

import React, { useState, useMemo } from "react";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { CategoryCard } from "@/components/CategoryCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface CategoryData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  reportCount: number;
  viewCount: number;
  isFeatured: boolean;
  industry?: string;
  slug: string;
}

interface CategoriesPageClientProps {
  initialCategories: CategoryData[];
  locale: string;
}

const ITEMS_PER_PAGE = 6;

export function CategoriesPageClient({ initialCategories, locale }: CategoriesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    const filtered = initialCategories.filter(category => {
      const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === "all") return matchesSearch;
      if (filterBy === "featured") return matchesSearch && category.isFeatured;
      return matchesSearch && category.industry?.toLowerCase() === filterBy;
    });

    // Sort categories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "popularity":
          return b.viewCount - a.viewCount;
        case "reports":
          return b.reportCount - a.reportCount;
        case "recent":
          return a.title.localeCompare(b.title); // Mock sorting by recent
        default:
          return 0;
      }
    });

    return filtered;
  }, [initialCategories, searchTerm, sortBy, filterBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = filteredAndSortedCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filters change
  const handleFilterChange = (newFilter: string) => {
    setFilterBy(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
    setCurrentPage(1);
  };

  return (
    <>
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        filterBy={filterBy}
        onFilterChange={handleFilterChange}
      />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredAndSortedCategories.length} of {initialCategories.length} categories
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Categories Grid */}
        {paginatedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                {...category}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No categories found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="cursor-pointer"
                      size="default"
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                      size="default"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="cursor-pointer"
                      size="default"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </>
  );
}
