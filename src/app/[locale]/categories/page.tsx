import { Metadata } from "next";
// import { CategoryService } from "@/lib/db/categories";
import { Header } from "@/components/Header";
import { CategoriesHeroSection } from "@/components/CategoriesHeroSection";
import { Footer } from "@/components/Footer";
import { SimpleCategoriesGrid } from "@/components/SimpleCategoriesGrid";

export const metadata: Metadata = {
  title: "All Categories - TheBrainyInsights",
  description: "Browse all market research categories from TheBrainyInsights.",
  alternates: {
    canonical: "https://www.thebrainyinsights.com/categories",
    languages: {
      "en-US": "https://www.thebrainyinsights.com/en/categories",
      "ja-JP": "https://www.thebrainyinsights.com/ja/categories",
      "de-DE": "https://www.thebrainyinsights.com/de/categories",
      "es-ES": "https://www.thebrainyinsights.com/es/categories",
      "fr-FR": "https://www.thebrainyinsights.com/fr/categories",
      "it-IT": "https://www.thebrainyinsights.com/it/categories",
      "ko-KR": "https://www.thebrainyinsights.com/ko/categories",
      "x-default": "https://www.thebrainyinsights.com/en/categories",
    },
  },
};

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<any>;
}

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

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;

  // Enhanced sample categories with more details for proper functionality
  const sampleCategories: CategoryData[] = [
    {
      id: "1",
      title: "Technology",
      description: "Latest technology trends, AI, machine learning, digital transformation, and emerging tech insights covering software, hardware, and IT services.",
      icon: "💻",
      reportCount: 45,
      viewCount: 12500,
      isFeatured: true,
      industry: "Technology",
      slug: "technology"
    },
    {
      id: "2", 
      title: "Healthcare",
      description: "Medical devices, pharmaceuticals, biotechnology, healthcare services, digital health, and medical technology market analysis.",
      icon: "🏥",
      reportCount: 38,
      viewCount: 9800,
      isFeatured: true,
      industry: "Healthcare", 
      slug: "healthcare"
    },
    {
      id: "3",
      title: "Finance",
      description: "Banking, fintech, insurance, financial services, blockchain, cryptocurrency, and payment systems market research.",
      icon: "💰",
      reportCount: 32,
      viewCount: 8400,
      isFeatured: false,
      industry: "Finance",
      slug: "finance"
    },
    {
      id: "4",
      title: "Energy",
      description: "Renewable energy, oil & gas, sustainable energy solutions, solar, wind, and energy storage market insights.",
      icon: "⚡",
      reportCount: 28,
      viewCount: 7200,
      isFeatured: false,
      industry: "Energy",
      slug: "energy"
    },
    {
      id: "5",
      title: "Automotive",
      description: "Electric vehicles, autonomous driving, automotive technology, mobility solutions, and transportation industry analysis.",
      icon: "🚗",
      reportCount: 35,
      viewCount: 9100,
      isFeatured: true,
      industry: "Automotive",
      slug: "automotive"
    },
    {
      id: "6",
      title: "Food & Beverages",
      description: "Food processing, beverages, agriculture, food technology, packaging, and food safety market trends and analysis.",
      icon: "🍽️",
      reportCount: 22,
      viewCount: 5600,
      isFeatured: false,
      industry: "F&B",
      slug: "food-beverages"
    },
    {
      id: "7",
      title: "Consumer Goods",
      description: "Retail, e-commerce, consumer products, fashion, cosmetics, and personal care market research and trends.",
      icon: "🛒",
      reportCount: 40,
      viewCount: 10200,
      isFeatured: true,
      industry: "Consumer Goods",
      slug: "consumer-goods"
    },
    {
      id: "8",
      title: "Manufacturing",
      description: "Industrial manufacturing, automation, robotics, Industry 4.0, supply chain, and production technology insights.",
      icon: "🏭",
      reportCount: 26,
      viewCount: 6800,
      isFeatured: false,
      industry: "Manufacturing",
      slug: "manufacturing"
    },
    {
      id: "9",
      title: "Aerospace & Defense",
      description: "Aviation, defense technology, space technology, satellites, drones, and aerospace components market analysis.",
      icon: "✈️",
      reportCount: 18,
      viewCount: 4500,
      isFeatured: false,
      industry: "Aerospace",
      slug: "aerospace-defense"
    }
  ];

  try {
    // Try to fetch categories data from database - temporarily disabled for stability
    // const categoriesData = await CategoryService.getAll(locale);
    // const transformedCategories: CategoryData[] = categoriesData.map((cat: any) => ({...}));
    const transformedCategories = sampleCategories;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoriesHeroSection />
        <SimpleCategoriesGrid 
          categories={transformedCategories}
          locale={locale}
        />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading categories:', error);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoriesHeroSection />
        <SimpleCategoriesGrid 
          categories={sampleCategories}
          locale={locale}
        />
        <Footer />
      </div>
    );
  }
}