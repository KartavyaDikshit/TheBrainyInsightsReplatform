"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
const Pagination = ({ currentPage, totalPages }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const createPageURL = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
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
            pageNumbers.push(<Link key={i} href={createPageURL(i)} className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === i ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : ''}`}>
          {i}
        </Link>);
        }
        return pageNumbers;
    };
    return (<nav aria-label="Page navigation">
      <ul className="inline-flex -space-x-px text-sm">
        <li>
          <Link href={createPageURL(Math.max(1, currentPage - 1))} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Previous
          </Link>
        </li>
        {renderPageNumbers()}
        <li>
          <Link href={createPageURL(Math.min(totalPages, currentPage + 1))} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Next
          </Link>
        </li>
      </ul>
    </nav>);
};
export default Pagination;
