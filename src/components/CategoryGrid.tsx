import { ChevronRight } from 'lucide-react';
import { Card } from './ui/card';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  view_count: number;
  shortcode: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore market intelligence across industries that matter to your business
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <a 
              key={category.id}
              href={`/en/category/${category.slug}`}
              className="block"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group h-full">
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1 flex flex-col">
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">
                      {category.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                      <span>{category.view_count.toLocaleString()} views</span>
                      <span className="font-mono">{category.shortcode.toUpperCase()}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 mt-1" />
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
