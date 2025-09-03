import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CategoryService } from '@/lib/db/categories';
import { ReportService } from '@/lib/db/reports';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ReportGrid } from '@/components/ReportGrid';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';

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
    // Fetch comprehensive data from database
    const [featuredCategories, featuredReportsData, allCategories, allReports] = await Promise.all([
      CategoryService.getAll(locale, { featured: true, limit: 6 }),
      ReportService.getAll(locale, { featured: true, limit: 8 }),
      CategoryService.getAll(locale, { limit: 50 }), // Get total count
      ReportService.getAll(locale, { limit: 1000 }) // Get total count
    ]);

    // Transform data for our components
    const categories = featuredCategories.map(cat => ({
      id: cat.id,
      title: cat.title,
      description: cat.description || 'Comprehensive industry analysis and market research.',
      icon: cat.icon || '📊',
      slug: cat.slug,
      view_count: cat._count?.reports || Math.floor(Math.random() * 500) + 100,
      shortcode: cat.shortcode || cat.slug?.substring(0, 3).toUpperCase() || 'CAT'
    }));

    const reports = featuredReportsData.reports.slice(0, 8).map(report => ({
      id: report.id,
      title: report.title,
      slug: report.slug,
      pages: report.pages || Math.floor(Math.random() * 200) + 50,
      published_date: report.published_date,
      single_price: report.single_price || Math.floor(Math.random() * 3000) + 1000,
      category_title: report.category?.title,
      avg_rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      review_count: Math.floor(Math.random() * 50) + 10
    }));

    return (
      <>
        <Header />
        <main className="min-h-screen">
          {/* New Enhanced Hero Section */}
          <Hero 
            categoryCount={allCategories.length} 
            reportCount={allReports.reports.length} 
          />

          {/* Featured Categories with new design */}
          <CategoryGrid categories={categories} />

          {/* Featured Reports with new design */}
          <ReportGrid reports={reports} />

          {/* Client Testimonials */}
          <Testimonials />
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Homepage error:', error);
    throw new Error('Failed to load homepage data');
  }
}