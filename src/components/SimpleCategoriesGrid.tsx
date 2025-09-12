"use client";

import React from "react";
import Link from "next/link";

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

interface SimpleCategoriesGridProps {
  categories: CategoryData[];
  locale: string;
}

export function SimpleCategoriesGrid({ categories, locale }: SimpleCategoriesGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Categories</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore comprehensive market research across all major industries and sectors
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/categories/${category.slug}`}
            className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors duration-300">
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <p className="text-sm text-gray-600 font-medium">Category</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                  {category.title}
                </h3>
                {category.isFeatured && (
                  <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-200">
                    Featured
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {category.description}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {category.reportCount} reports
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    {category.viewCount.toLocaleString()} views
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {category.industry}
                </span>
                <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                  Explore Reports
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Research Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {categories.length}+
              </div>
              <div className="text-sm text-gray-600">Industry Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {categories.reduce((sum, cat) => sum + cat.reportCount, 0)}+
              </div>
              <div className="text-sm text-gray-600">Research Reports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {Math.round(categories.reduce((sum, cat) => sum + cat.viewCount, 0) / 1000)}K+
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
