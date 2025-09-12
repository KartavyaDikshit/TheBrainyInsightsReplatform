import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  resultsCount: number;
  onFilterClick: () => void;
  activeFiltersCount: number;
}

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  resultsCount,
  onFilterClick,
  activeFiltersCount
}: SearchFilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search reports by title, industry, or keyword..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onFilterClick}
              className="h-12 px-4 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 relative"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-indigo-600">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-48 h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{resultsCount}</span> reports
          </p>
          
          {/* Quick Filter Chips */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-500">Quick filters:</span>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-indigo-600 hover:bg-indigo-50">
              Technology
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-indigo-600 hover:bg-indigo-50">
              Healthcare
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-indigo-600 hover:bg-indigo-50">
              Free Reports
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
