import { Button } from './ui/button';
import { Card } from './ui/card';
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
    <section className="py-8 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-1.5">Featured Categories</h2>
          <p className="text-xs text-gray-600">
            Explore market research across diverse industries
          </p>
        </div>
        
        {/* Themed Box with High Transparency and Scrollable Content */}
        <div className="bg-purple-600/10 backdrop-blur-sm rounded-lg p-3 border border-purple-200/30 shadow">
          <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
            <div className="flex gap-3 min-w-max lg:grid lg:grid-cols-4 lg:min-w-0">
              {categories.map((category) => {
                return (
                  <Card key={category.id} className="bg-white/90 hover:bg-white hover:shadow-md transition-all w-56 lg:w-auto flex-shrink-0 lg:flex-shrink border border-purple-100 overflow-hidden flex flex-col h-[240px]">
                    {/* Category Image Section */}
                    <div className="h-16 flex items-center justify-center text-white" style={{ backgroundColor: '#303F9F' }}>
                      {getCategoryIcon(category.title, "w-8 h-8")}
                    </div>
                    
                    <div className="p-4 flex flex-col h-full">
                      <h3 className="text-lg font-bold mb-2 leading-snug line-clamp-2" style={{ color: '#303F9F' }}>
                        <a href={`/en/categories/${category.slug}`} className="hover:opacity-80 transition-colors">
                          {category.title}
                        </a>
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed">
                        {category.description || 'Comprehensive market research and industry analysis.'}
                      </p>
                      
                      <div className="mt-auto">
                        <Button asChild size="sm" className="w-full text-white h-9 text-xs font-medium" style={{ backgroundColor: '#303F9F' }}>
                          <a href={`/en/categories/${category.slug}`}>Explore Category</a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

