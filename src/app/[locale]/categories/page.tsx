import { Metadata } from "next";
import { CategoryService } from "@/lib/db/categories";
import { Header } from "@/components/Header";
import { CategoriesHeroSection } from "@/components/CategoriesHeroSection";
import { Footer } from "@/components/Footer";
import { CategoriesPageClient } from "@/components/CategoriesPageClient";

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

  try {
    // Fetch categories data on the server
    const categoriesData = await CategoryService.getAll(locale);
    
    const transformedCategories: CategoryData[] = categoriesData.map((cat: any) => ({
      id: cat.id,
      title: cat.title,
      description: cat.description || 'No description available.',
      icon: cat.icon,
      reportCount: cat._count?.reports || 0,
      viewCount: cat.view_count || Math.floor(Math.random() * 50000) + 1000, // Random fallback
      isFeatured: Boolean(cat.featured),
      industry: cat.shortcode || 'General',
      slug: cat.slug,
    }));

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoriesHeroSection />
        <CategoriesPageClient 
          initialCategories={transformedCategories}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">Error loading categories</p>
            <p className="text-gray-400">Please try again later</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}