import Link from "next/link";
import { Metadata } from "next";
import { getAllPresses } from "@/lib/presses"; // Import the utility function
import { locales } from "../../../config/i18n"; // Import locales from shared config
import { Prisma } from "@prisma/client"; // Import Prisma for types

// Define a type for Press with included category and its translations
type PressWithCategoryAndTranslations = Prisma.PressGetPayload<{
  include: {
    category: {
      include: {
        translations: true;
      };
    };
  };
}>;

export const metadata: Metadata = {
  title: "All Press Releases - TheBrainyInsights",
  description: "Browse all press releases from TheBrainyInsights.",
  alternates: {
    canonical: "https://www.thebrainyinsights.com/presses", // Canonical URL for the current page
    languages: {
      "en-US": "https://www.thebrainyinsights.com/en/presses",
      "ja-JP": "https://www.thebrainyinsights.com/ja/presses",
      "de-DE": "https://www.thebrainyinsights.com/de/presses",
      "es-ES": "https://www.thebrainyinsights.com/es/presses",
      "fr-FR": "https://www.thebrainyinsights.com/fr/presses",
      "it-IT": "https://www.thebrainyinsights.com/it/presses",
      "ko-KR": "https://www.thebrainyinsights.com/ko/presses",
      "x-default": "https://www.thebrainyinsights.com/en/presses", // Fallback for unspecified locales
    },
  },
};

interface PressesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function PressesPage({ params }: PressesPageProps) {
  const { locale } = await params;

  const presses = (await getAllPresses(locale)) as PressWithCategoryAndTranslations[]; // Explicitly cast

  return (
    <div className="presses-list-page">
      <h1 className="text-3xl font-bold mb-6">All Press Releases</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presses.map((press) => {
          const categoryTranslation = press.category?.translations[0];

          return (
            <div key={press.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/${locale}/press/${press.slug}`} className="text-indigo-600 hover:underline">
                  {press.title}
                </Link>
              </h2>
              {categoryTranslation && (
                <p className="text-gray-600 text-sm mb-1">Category: {categoryTranslation.name}</p>
              )}
              {press.publishedAt && (
                <p className="text-gray-600 text-sm mb-2">Published: {press.publishedAt.toDateString()}</p>
              )}
              {press.description && (
                <p className="text-gray-700 text-sm line-clamp-3">{press.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}