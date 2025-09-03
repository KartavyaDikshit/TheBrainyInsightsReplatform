import { TrendingUp, FileText, DollarSign, Tag } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

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
    <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Category Icon and Info */}
          <div className="lg:col-span-2 flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                {icon ? (
                  <span className="text-4xl">{icon}</span>
                ) : (
                  <span className="text-white font-bold text-xl">
                    {categoryName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
              <p className="text-lg text-indigo-100 leading-relaxed mb-4">
                {description}
              </p>
              {popularTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-indigo-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Category Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-indigo-200" />
                  <span className="text-indigo-100">Total Reports</span>
                </div>
                <span className="font-semibold text-white">{totalReports}</span>
              </div>
              {averagePrice && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-indigo-200" />
                    <span className="text-indigo-100">Avg. Price</span>
                  </div>
                  <span className="font-semibold text-white">${averagePrice.toLocaleString()}</span>
                </div>
              )}
              {industryGrowth && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-indigo-200" />
                    <span className="text-indigo-100">Growth Rate</span>
                  </div>
                  <span className="font-semibold text-white">{industryGrowth}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-indigo-200" />
                  <span className="text-indigo-100">Popular Topics</span>
                </div>
                <span className="font-semibold text-white">{popularTags.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
