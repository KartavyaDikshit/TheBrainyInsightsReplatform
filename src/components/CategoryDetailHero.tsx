
import { TrendingUp, FileText, DollarSign, Tag } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { getCategoryIcon } from './icons/CategoryIcons';

interface CategoryDetailHeroProps {
  categoryName: string;
  description: string;
  icon?: string;
  totalReports: number;
  averagePrice?: number;
  industryGrowth?: string;
  popularTags?: string[];
  locale?: string;
}

export function CategoryDetailHero({
  categoryName,
  description,
  icon,
  totalReports,
  averagePrice,
  industryGrowth,
  popularTags = [],
  locale = 'en'
}: CategoryDetailHeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white h-[323.75px]">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0">
        {/* Geometric overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-indigo-700/95 to-purple-800/90"></div>
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-purple-300/10 rounded-lg rotate-45 blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-300/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/5 rounded-lg rotate-12 blur-xl"></div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        {/* Breadcrumb */}
        <Breadcrumb className="pt-4 mb-8">
          <BreadcrumbList className="text-indigo-100">
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`} className="text-indigo-100 hover:text-white">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-indigo-300" />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/categories`} className="text-indigo-100 hover:text-white">
                Categories
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-indigo-300" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-medium">{categoryName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-start space-x-6 flex-1 pb-6">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
              {getCategoryIcon(categoryName, "w-16 h-16")}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">{categoryName}</h1>
            <p className="text-xl text-indigo-100 leading-relaxed mb-4">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
