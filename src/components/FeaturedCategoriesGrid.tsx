"use client";

import { getCategoryIcon } from './icons/CategoryIcons';

interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  reportCount?: number;
}

interface FeaturedCategoriesGridProps {
  categories: Category[];
}

export function FeaturedCategoriesGrid({ categories }: FeaturedCategoriesGridProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore market intelligence across industries that matter to your business
          </p>
        </div>
        
        {/* Gradient Container wrapping the Categories Grid */}
        <div className="bg-indigo-600/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/30 shadow-lg">
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/en/categories/${category.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="mb-3 text-indigo-600">
                  {getCategoryIcon(category.title, "w-12 h-12")}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {category.description || 'Comprehensive market research and industry analysis'}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

