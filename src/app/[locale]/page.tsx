import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CategoryService } from '@/lib/db/categories';
import { ReportService } from '@/lib/db/reports';

const SUPPORTED_LOCALES = ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko'];

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: 'TheBrainyInsights - Market Research & Business Intelligence Platform',
    description: 'Leading global platform for comprehensive market research reports, industry analysis, and business intelligence across 200+ industries.',
    keywords: 'market research, business intelligence, industry reports, market analysis',
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  try {
    // Fetch data from database
    const [featuredCategories, featuredReportsData] = await Promise.all([
      CategoryService.getAll(locale, { featured: true, limit: 6 }),
      ReportService.getAll(locale, { featured: true, limit: 8 })
    ]);

    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Market Research & Business Intelligence
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
              Leading global platform for comprehensive market research reports, 
              industry analysis, and business intelligence across 200+ industries.
            </p>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Industry Categories
              </h2>
              <p className="text-xl text-gray-600">
                Explore comprehensive research across major industries
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {category._count?.reports} reports
                    </span>
                    <a 
                      href={`/${locale}/categories/${category.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Reports →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Reports */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Latest Research Reports
              </h2>
              <p className="text-xl text-gray-600">
                Recently published market research with comprehensive analysis
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {featuredReportsData.reports.slice(0, 8).map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      {report.category?.title}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      <a 
                        href={`/${locale}/reports/${report.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {report.title}
                      </a>
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{report.pages} pages</span>
                      <span>{new Date(report.published_date).getFullYear()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Starting from</div>
                        <div className="text-lg font-bold text-gray-900">
                          {report.single_price ? `${report.single_price.toLocaleString()}` : 'Contact us'}
                        </div>
                      </div>
                      <a
                        href={`/${locale}/reports/${report.slug}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Report
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error('Homepage error:', error);
    throw new Error('Failed to load homepage data');
  }
}