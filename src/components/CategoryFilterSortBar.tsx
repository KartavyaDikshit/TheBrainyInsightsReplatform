"use client";

import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface CategoryFilterSortBarProps {
  totalResults: number;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  initialSort?: string;
}

export function CategoryFilterSortBar({ 
  totalResults, 
  onSearchChange, 
  onSortChange,
  initialSort = 'latest'
}: CategoryFilterSortBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState(initialSort);

  const sortOptions = [
    { value: 'latest', label: 'Latest Reports' },
    { value: 'oldest', label: 'Oldest Reports' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'title', label: 'Title A-Z' },
  ];

  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Latest Reports';

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleSortChange = (sortValue: string) => {
    setCurrentSort(sortValue);
    onSortChange(sortValue);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col space-y-4">
          {/* Top Row: Search, Filters, Tailored Research */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search within category..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="min-w-[180px] justify-between">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Sort by: {currentSortLabel}
                    </div>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem 
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={currentSort === option.value ? 'bg-accent' : ''}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              {totalResults.toLocaleString()} {totalResults === 1 ? 'report' : 'reports'} found
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
