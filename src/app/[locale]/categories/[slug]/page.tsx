import { notFound } from "next/navigation";
import { Metadata } from "next";
// import { CategoryService } from "@/lib/db/categories";
// import { ReportService } from "@/lib/db/reports";
import { Header } from "@/components/Header";
import { CategoryDetailHero } from "@/components/CategoryDetailHero";
import { Footer } from "@/components/Footer";
import { CategoryDetailPageClient } from "@/components/CategoryDetailPageClient";

const SUPPORTED_LOCALES = ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko'];

interface CategoryPageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<any>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  // Sample category data for metadata
  const categoryTitles: { [key: string]: string } = {
    'technology': 'Technology Market Research',
    'healthcare': 'Healthcare Market Research', 
    'finance': 'Finance & Financial Services Research',
    'energy': 'Energy & Renewable Energy Research',
    'automotive': 'Automotive & Transportation Research',
    'food-beverages': 'Food & Beverages Market Research',
    'consumer-goods': 'Consumer Goods Market Research',
    'manufacturing': 'Manufacturing & Industrial Research',
    'aerospace-defense': 'Aerospace & Defense Research'
  };

  const title = categoryTitles[slug] || 'Market Research';

  return {
    title: `${title} | TheBrainyInsights`,
    description: `Comprehensive ${title.toLowerCase()} reports and industry insights from TheBrainyInsights.`,
    openGraph: {
      title: `${title} - Market Research Reports`,
      description: `Comprehensive ${title.toLowerCase()} reports and industry insights from TheBrainyInsights.`,
      url: `https://www.thebrainyinsights.com/${locale}/categories/${slug}`,
      siteName: "TheBrainyInsights",
      images: [
        {
          url: "https://www.thebrainyinsights.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Market Research Reports`,
      description: `Comprehensive ${title.toLowerCase()} reports and industry insights from TheBrainyInsights.`,
      images: ["https://www.thebrainyinsights.com/twitter-image.jpg"],
    },
  };
}

interface ReportData {
  id: string;
  title: string;
  description: string;
  slug: string;
  publishedDate?: Date;
  pageCount?: number;
  singlePrice?: number;
  multiPrice?: number;
  corporatePrice?: number;
  downloadCount?: number;
  viewCount?: number;
  tags?: string[];
  geography?: string;
  reportType?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  // Sample category data
  const categoryData: { [key: string]: any } = {
    'technology': {
      title: 'Technology',
      description: 'Latest technology trends, AI, machine learning, digital transformation, and emerging tech insights covering software, hardware, and IT services across global markets.',
      icon: '💻',
      reportCount: 45,
      popularTags: ['Artificial Intelligence', 'Machine Learning', 'Digital Transformation', 'Cloud Computing', 'Cybersecurity']
    },
    'healthcare': {
      title: 'Healthcare', 
      description: 'Medical devices, pharmaceuticals, biotechnology, healthcare services, digital health, telemedicine, and medical technology market analysis with regulatory insights.',
      icon: '🏥',
      reportCount: 38,
      popularTags: ['Digital Health', 'Medical Devices', 'Pharmaceuticals', 'Biotechnology', 'Healthcare IT']
    },
    'finance': {
      title: 'Finance',
      description: 'Banking, fintech, insurance, financial services, blockchain, cryptocurrency, payment systems, and wealth management market research and analysis.',
      icon: '💰',
      reportCount: 32,
      popularTags: ['Fintech', 'Digital Banking', 'Blockchain', 'Insurance Technology', 'Payment Systems']
    },
    'energy': {
      title: 'Energy',
      description: 'Renewable energy, oil & gas, sustainable energy solutions, solar, wind, energy storage, and clean technology market insights and forecasts.',
      icon: '⚡',
      reportCount: 28,
      popularTags: ['Renewable Energy', 'Solar Power', 'Wind Energy', 'Energy Storage', 'Clean Technology']
    },
    'automotive': {
      title: 'Automotive',
      description: 'Electric vehicles, autonomous driving, automotive technology, mobility solutions, transportation industry analysis, and automotive supply chain insights.',
      icon: '🚗',
      reportCount: 35,
      popularTags: ['Electric Vehicles', 'Autonomous Driving', 'Connected Cars', 'Mobility Services', 'Automotive Technology']
    },
    'food-beverages': {
      title: 'Food & Beverages',
      description: 'Food processing, beverages, agriculture, food technology, packaging, food safety, sustainable agriculture, and nutrition market trends and analysis.',
      icon: '🍽️',
      reportCount: 22,
      popularTags: ['Food Technology', 'Sustainable Agriculture', 'Food Safety', 'Beverage Innovation', 'Nutrition']
    },
    'consumer-goods': {
      title: 'Consumer Goods',
      description: 'Retail, e-commerce, consumer products, fashion, cosmetics, personal care, home goods, and consumer behavior market research and trends.',
      icon: '🛒',
      reportCount: 40,
      popularTags: ['E-commerce', 'Consumer Behavior', 'Retail Technology', 'Fashion Industry', 'Personal Care']
    },
    'manufacturing': {
      title: 'Manufacturing',
      description: 'Industrial manufacturing, automation, robotics, Industry 4.0, supply chain, production technology, and smart manufacturing insights.',
      icon: '🏭',
      reportCount: 26,
      popularTags: ['Industry 4.0', 'Smart Manufacturing', 'Industrial Automation', 'Supply Chain', 'Robotics']
    },
    'aerospace-defense': {
      title: 'Aerospace & Defense',
      description: 'Aviation, defense technology, space technology, satellites, drones, aerospace components, and defense systems market analysis.',
      icon: '✈️',
      reportCount: 18,
      popularTags: ['Aviation Technology', 'Defense Systems', 'Space Technology', 'Drone Technology', 'Satellites']
    }
  };

  const category = categoryData[slug];
  
  if (!category) {
    notFound();
  }

  try {
    // Generate sample reports for this category
    const transformedReports: ReportData[] = Array.from({ length: 12 }, (_, i) => ({
      id: `${slug}-${i + 1}`,
      title: `${category.title} Market Analysis ${2025 + Math.floor(i / 4)}: ${['Global Trends', 'Regional Insights', 'Technology Outlook', 'Competitive Landscape'][i % 4]}`,
      description: `Comprehensive analysis of ${category.title.toLowerCase()} market dynamics, including market size, growth drivers, competitive landscape, and strategic insights for stakeholders in the industry.`,
      slug: `${slug}-market-analysis-${i + 1}`,
      publishedDate: new Date(2024, 11 - (i % 12), 15),
      pageCount: Math.floor(Math.random() * 200) + 250,
      singlePrice: Math.floor(Math.random() * 2000) + 2500,
      multiPrice: Math.floor(Math.random() * 3000) + 3500,
      corporatePrice: Math.floor(Math.random() * 4000) + 5000,
      downloadCount: Math.floor(Math.random() * 500) + 100,
      viewCount: Math.floor(Math.random() * 2000) + 500,
      tags: category.popularTags.slice(0, 3),
      geography: ['Global', 'North America', 'Europe', 'Asia Pacific', 'LATAM'][Math.floor(Math.random() * 5)],
      reportType: ['Market Research', 'Industry Analysis', 'Technology Analysis', 'Competitive Analysis'][Math.floor(Math.random() * 4)],
      isNew: i < 3,
      isTrending: i < 5 && Math.random() > 0.5,
    }));

    // Get related categories for sidebar
    const allCategories = Object.keys(categoryData);
    const relatedCategories = allCategories
      .filter(catSlug => catSlug !== slug)
      .slice(0, 4)
      .map(catSlug => ({
        name: categoryData[catSlug].title,
        reportCount: categoryData[catSlug].reportCount,
        slug: catSlug,
      }));

    // Get popular reports for sidebar
    const popularReports = transformedReports
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 3)
      .map(report => ({
        title: report.title,
        price: report.singlePrice || 0,
        isNew: report.isNew,
        slug: report.slug,
      }));

    const averagePrice = transformedReports.length > 0 ? 
      Math.round(transformedReports.reduce((sum, r) => sum + (r.singlePrice || 0), 0) / transformedReports.length) : 
      undefined;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoryDetailHero
          categoryName={category.title}
          description={category.description}
          icon={category.icon}
          totalReports={category.reportCount}
          averagePrice={averagePrice}
          industryGrowth={['+12.8%', '+8.5%', '+15.2%', '+6.9%', '+10.3%'][Math.floor(Math.random() * 5)]}
          popularTags={category.popularTags}
          locale={locale}
        />
        <CategoryDetailPageClient
          initialReports={transformedReports}
          categoryName={category.title}
          popularReports={popularReports}
          relatedCategories={relatedCategories}
          locale={locale}
        />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">Error loading category</p>
            <p className="text-gray-400">Please try again later</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}