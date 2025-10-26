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
      id: "2",
      title: "Information Technology & Semiconductors",
      description: "Latest technology trends, AI, machine learning, semiconductor manufacturing, chip design, and emerging tech insights.",
      icon: "💻",
      reportCount: 45,
      viewCount: 12500,
      isFeatured: true,
      industry: "Technology",
      slug: "information-technology-semiconductors"
    },
    {
      id: "3",
      title: "Machinery & Equipment",
      description: "Industrial machinery, heavy equipment, construction equipment, manufacturing tools, and machinery technology market insights.",
      icon: "⚙️",
      reportCount: 32,
      viewCount: 8400,
      isFeatured: false,
      industry: "Machinery",
      slug: "machinery-equipment"
    },
    {
      id: "4",
      title: "Aerospace & Defence",
      description: "Aviation, defense technology, space technology, satellites, drones, and aerospace components market analysis.",
      icon: "✈️",
      reportCount: 28,
      viewCount: 7200,
      isFeatured: false,
      industry: "Aerospace",
      slug: "aerospace-defence"
    },
    {
      id: "5",
      title: "Chemicals & Materials",
      description: "Chemical manufacturing, specialty chemicals, materials science, polymers, composites, and advanced materials market research.",
      icon: "🧪",
      reportCount: 35,
      viewCount: 9100,
      isFeatured: true,
      industry: "Chemicals",
      slug: "chemicals-materials"
    },
    {
      id: "6",
      title: "Food & Beverages",
      description: "Food processing, beverages, food technology, packaging, distribution, and food safety market trends and analysis.",
      icon: "🍽️",
      reportCount: 30,
      viewCount: 7800,
      isFeatured: false,
      industry: "F&B",
      slug: "food-beverages"
    },
    {
      id: "7",
      title: "Agriculture",
      description: "Agricultural technology, farming equipment, crop management, precision agriculture, and agribusiness market insights.",
      icon: "🌾",
      reportCount: 26,
      viewCount: 6500,
      isFeatured: false,
      industry: "Agriculture",
      slug: "agriculture"
    },
    {
      id: "8",
      title: "Energy & Power",
      description: "Renewable energy, oil & gas, power generation, sustainable energy solutions, solar, wind, and energy storage market insights.",
      icon: "⚡",
      reportCount: 42,
      viewCount: 10800,
      isFeatured: true,
      industry: "Energy",
      slug: "energy-power"
    },
    {
      id: "9",
      title: "Consumer Goods",
      description: "Retail, e-commerce, consumer products, fashion, cosmetics, personal care, and consumer electronics market research.",
      icon: "🛒",
      reportCount: 40,
      viewCount: 10200,
      isFeatured: true,
      industry: "Consumer Goods",
      slug: "consumer-goods"
    },
    {
      id: "10",
      title: "Automotive & Transportation",
      description: "Electric vehicles, autonomous driving, automotive technology, mobility solutions, logistics, and transportation industry analysis.",
      icon: "🚗",
      reportCount: 38,
      viewCount: 9600,
      isFeatured: false,
      industry: "Automotive",
      slug: "automotive-transportation"
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