"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Number of page buttons to display

    // Determine start and end page for rendering
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if we are at the end of the total pages
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Link 
          key={i} 
          href={createPageURL(i)} 
          className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
            currentPage === i ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : ''
          }`}
        >
          {i}
        </Link>
      );
    }

    return pageNumbers;
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="inline-flex -space-x-px">
        {/* Previous Button */}
        {currentPage > 1 && (
          <li>
            <Link 
              href={createPageURL(currentPage - 1)}
              className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Previous
            </Link>
          </li>
        )}

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Button */}
        {currentPage < totalPages && (
          <li>
            <Link 
              href={createPageURL(currentPage + 1)}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Next
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}