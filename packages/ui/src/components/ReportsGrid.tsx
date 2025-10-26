"use client";

import { useState } from "react";
import { ReportCard } from "./ReportCard";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get unique categories from reports
  const categories = Array.from(new Set(reports.map(r => r.category)));

  // Filter reports based on search and category
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === "" || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(report.category);
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="bg-indigo-600/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/30 shadow-lg">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search Bar */}
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

        {/* Category Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 bg-white border-gray-300 min-w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Category
              {selectedCategories.length > 0 && (
                <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
            <DropdownMenuLabel className="text-gray-900">Categories</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
                className="bg-white hover:bg-indigo-50 text-gray-900"
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedCategories.length > 0 && (
              <>
                <DropdownMenuSeparator className="bg-gray-200" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs hover:bg-indigo-50 text-gray-900"
                  onClick={() => setSelectedCategories([])}
                >
                  Clear filters
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
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
        
        {filteredReports.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No reports found matching your criteria</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategories([]);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
