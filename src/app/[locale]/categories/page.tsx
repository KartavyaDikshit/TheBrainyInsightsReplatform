import Link from "next/link";
import { Metadata } from "next";
import { listCategories, TransformedCategory } from "@/lib/data/adapter"; // Import the utility function and custom type
import { locales } from "../../../config/i18n"; // Import locales from shared config

export const metadata: Metadata = {
  title: "All Categories - TheBrainyInsights",
  description: "Browse all market research categories from TheBrainyInsights.",
  alternates: {
    canonical: "https://www.thebrainyinsights.com/categories", // Canonical URL for the current page
    languages: {
      "en-US": "https://www.thebrainyinsights.com/en/categories",
      "ja-JP": "https://www.thebrainyinsights.com/ja/categories",
      "de-DE": "https://www.thebrainyinsights.com/de/categories",
      "es-ES": "https://www.thebrainyinsights.com/es/categories",
      "fr-FR": "https://www.thebrainyinsights.com/fr/categories",
      "it-IT": "https://www.thebrainyinsights.com/it/categories",
      "ko-KR": "https://www.thebrainyinsights.com/ko/categories",
      "x-default": "https://www.thebrainyinsights.com/en/categories", // Fallback for unspecified locales
    },
  },
};

interface CategoriesPageProps {
  params: Promise<any>; // Use any to bypass type checking for params
  searchParams: Promise<any>; // Add searchParams to match Next.js PageProps structure, even if not used
}

export default async function CategoriesPage(props: CategoriesPageProps) {
  const params = await props.params;
  const { locale } = params;

  const categories: TransformedCategory[] = await listCategories(locale as string); // Use the utility function and cast locale

  return (
    <div className="categories-list-page">
      <h1 className="text-3xl font-bold mb-6">All Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          // Add null check for category.translations
          const translation = category.translations?.[0];
          if (!translation) return null; // Skip if no translation for current locale

          return (
            <div key={category.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/${locale}/category/${category.slug}`} className="text-indigo-600 hover:underline">
                  {translation.title}
                </Link>
              </h2>
              {translation.description && (
                <p className="text-gray-700 text-sm line-clamp-3">{translation.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}