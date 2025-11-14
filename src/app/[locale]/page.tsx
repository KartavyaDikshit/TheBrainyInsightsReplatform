import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CategoryService } from '@/lib/db/categories';
import { ReportService } from '@/lib/db/reports';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ReportGrid } from '@/components/ReportGrid';
import { Testimonials } from '@/components/Testimonials';
import { TrustedBySection } from '@/components/TrustedBySection';
import { FeaturedCategoriesGrid } from '@/components/FeaturedCategoriesGrid';
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
    const [featuredReportsData, allCategories, allReports] = await Promise.all([
      ReportService.getAll(locale, { featured: true, limit: 4 }),
      CategoryService.getAll(locale, { limit: 50 }), // Get total count
      ReportService.getAll(locale, { limit: 1000 }) // Get total count
    ]);

    // Sample categories to always display - 6 featured categories
    const sampleCategories = [
      {
        id: 'sample-healthcare',
        title: 'Healthcare & Life Sciences',
        slug: 'healthcare-life-sciences',
        description: 'Medical devices, pharmaceuticals, and biotech insights',
        reportCount: 230
      },
      {
        id: 'sample-technology',
        title: 'Technology & Software',
        slug: 'technology-software',
        description: 'Tech trends, software markets, and digital transformation',
        reportCount: 312
      },
      {
        id: 'sample-manufacturing',
        title: 'Manufacturing & Industrial',
        slug: 'manufacturing-industrial',
        description: 'Industrial equipment, automation, and supply chain analysis',
        reportCount: 198
      },
      {
        id: 'sample-financial',
        title: 'Financial Services',
        slug: 'financial-services',
        description: 'Banking, fintech, insurance, and investment trends',
        reportCount: 167
      },
      {
        id: 'sample-retail',
        title: 'Retail & Consumer Goods',
        slug: 'retail-consumer-goods',
        description: 'Consumer behavior, e-commerce, and retail market data',
        reportCount: 142
      },
      {
        id: 'sample-energy',
        title: 'Energy & Sustainability',
        slug: 'energy-sustainability',
        description: 'Renewable energy, oil & gas, and environmental solutions',
        reportCount: 145
      }
    ];

    // Sample reports to always display
    const sampleReports = [
      {
        id: 'sample-energy-storage',
        title: 'Energy Storage Systems Market Size by Technology Type (Lithium-Ion Batteries, Lead-Acid Batteries, Flow Batteries, Sodium-Based Batteries)',
        slug: 'energy-storage-systems-market-2025',
        pages: 320,
        published_date: '2025-01-15',
        single_price: 4500,
        category_title: 'Energy and Power',
        description: 'This comprehensive 320-page report provides detailed analysis of the global energy storage systems market, covering lithium-ion, lead-acid, flow batteries, and emerging sodium-based technologies. Includes market sizing, competitive landscape, technology trends, and regional analysis across key markets including North America, Europe, and Asia-Pacific.'
      },
      {
        id: 'sample-ai-market',
        title: 'Global Artificial Intelligence Market Analysis 2025: Comprehensive Industry Forecast and Competitive Landscape',
        slug: 'artificial-intelligence-market-2025',
        pages: 285,
        published_date: '2025-01-10',
        single_price: 3800,
        category_title: 'Technology & Electronics',
        description: 'In-depth analysis of the global artificial intelligence market covering machine learning, deep learning, natural language processing, computer vision, and robotics. Includes detailed competitive landscape, market segmentation, regional dynamics, and strategic recommendations.'
      },
      {
        id: 'sample-ev-market',
        title: 'Electric Vehicle Market Outlook: Battery Technologies, Charging Infrastructure, and Global Adoption Trends',
        slug: 'electric-vehicle-market-2025',
        pages: 245,
        published_date: '2025-01-08',
        single_price: 4200,
        category_title: 'Automotive & Transportation',
        description: 'Comprehensive analysis of the electric vehicle market including battery technology advancements, charging infrastructure development, government policies, and adoption trends across major automotive markets worldwide.'
      },
      {
        id: 'sample-5g-market',
        title: '5G Technology Market: Network Infrastructure, Applications, and Global Deployment Analysis',
        slug: '5g-technology-market-2025',
        pages: 298,
        published_date: '2025-01-05',
        single_price: 3900,
        category_title: 'Telecommunications',
        description: 'Strategic analysis of 5G network deployment, infrastructure requirements, application use cases across industries, and competitive landscape of major telecom equipment providers and network operators.'
      },
      {
        id: 'sample-medical-devices',
        title: 'Medical Devices Market: Diagnostic Equipment, Surgical Instruments, and Digital Health Technologies',
        slug: 'medical-devices-market-2025',
        pages: 310,
        published_date: '2025-01-03',
        single_price: 4100,
        category_title: 'Healthcare & Medical Devices',
        description: 'Detailed market research on medical devices including diagnostic imaging equipment, surgical instruments, patient monitoring systems, and emerging digital health technologies transforming healthcare delivery.'
      },
      {
        id: 'sample-renewable-energy',
        title: 'Renewable Energy Market: Solar, Wind, Hydro, and Emerging Technologies - Global Market Forecast',
        slug: 'renewable-energy-market-2025',
        pages: 335,
        published_date: '2024-12-28',
        single_price: 4600,
        category_title: 'Energy and Power',
        description: 'Comprehensive analysis of renewable energy markets including solar photovoltaics, wind turbines, hydroelectric power, and emerging technologies such as tidal and geothermal energy systems.'
      },
      {
        id: 'sample-semiconductor',
        title: 'Semiconductor Market Analysis: Advanced Chips, Manufacturing Technologies, and Supply Chain Dynamics',
        slug: 'semiconductor-market-2025',
        pages: 278,
        published_date: '2024-12-20',
        single_price: 4400,
        category_title: 'Technology & Electronics',
        description: 'In-depth examination of the global semiconductor industry including advanced chip architectures, manufacturing processes, supply chain challenges, and strategic positioning of major semiconductor manufacturers.'
      },
      {
        id: 'sample-aerospace',
        title: 'Aerospace & Defense Market: Commercial Aviation, Military Systems, and Space Technologies',
        slug: 'aerospace-defense-market-2025',
        pages: 265,
        published_date: '2024-12-15',
        single_price: 4800,
        category_title: 'Aerospace & Defense',
        description: 'Strategic market analysis of aerospace and defense sectors covering commercial aircraft, military systems, satellite technologies, and emerging space economy opportunities.'
      }
    ];

    // Merge database data with sample data
    const dbReports = featuredReportsData.reports.map(report => ({
      id: report.id,
      title: report.title,
      slug: report.slug,
      pages: report.pages || Math.floor(Math.random() * 200) + 50,
      published_date: report.published_date,
      single_price: (report as any).single_price || Math.floor(Math.random() * 3000) + 1000,
      category_title: report.category?.title,
      description: report.description || report.summary || 'Comprehensive market research and analysis providing insights into industry trends, competitive landscape, and future projections.'
    }));

    const dbCategories = allCategories.map(category => ({
      id: category.id,
      title: category.title,
      slug: category.slug,
      description: category.description,
      reportCount: category.report_count
    }));

    // Combine sample and DB data, prioritizing samples
    const reports = [...sampleReports, ...dbReports].slice(0, 6);
    const featuredCategories = [...sampleCategories, ...dbCategories].slice(0, 6);

    return (
      <>
        <Header />
        <main className="min-h-screen">
          {/* New Enhanced Hero Section */}
          <Hero 
            categoryCount={allCategories.length} 
            reportCount={allReports.reports.length} 
          />

          {/* Trusted by Industry Leaders Section - Auto Scrolling */}
          <TrustedBySection />

          {/* Featured Categories */}
          <FeaturedCategoriesGrid categories={featuredCategories} />

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