import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryBySlug, CategoryWithTranslations } from "@/lib/categories"; // Import the utility function and custom type
import { locales } from "../../../../config/i18n"; // Import locales from shared config

interface CategoryPageProps {
  params: any; // Use any to bypass type checking for params
  searchParams: any; // Add searchParams to match Next.js PageProps structure, even if not used
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = params;

  const category = await getCategoryBySlug(slug as string, locale as string); // Cast to string

  if (!category || category.translations.length === 0) {
    return {};
  }

  const translation = category.translations[0];

  const alternatesLanguages: { [key: string]: string } = {};
  locales.forEach((loc) => {
    alternatesLanguages[loc] = `https://www.thebrainyinsights.com/${loc}/category/${slug}`;
  });

  return {
    title: translation.seoTitle || translation.name,
    description: translation.seoDesc || translation.description,
    openGraph: {
      title: translation.seoTitle || translation.name,
      description: translation.seoDesc ?? translation.description ?? '',
      url: `https://www.thebrainyinsights.com/${locale}/category/${slug}`,
      siteName: "TheBrainyInsights",
      images: [
        {
          url: "https://www.thebrainyinsights.com/og-image.jpg", // Placeholder, replace with actual OG image
          width: 1200,
          height: 630,
          alt: translation.name,
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: translation.seoTitle || translation.name,
      description: translation.seoDesc ?? translation.description ?? '',
      images: ["https://www.thebrainyinsights.com/twitter-image.jpg"], // Placeholder
    },
    alternates: {
      canonical: `https://www.thebrainyinsights.com/${locale}/category/${slug}`,
      languages: alternatesLanguages,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, locale } = params;

  const category: CategoryWithTranslations | null = await getCategoryBySlug(slug as string, locale as string); // Use the utility function

  if (!category || category.translations.length === 0) {
    notFound();
  }

  const translation = category.translations[0];

  return (
    <div className="category-detail-page">
      <h1 className="text-3xl font-bold mb-4">{translation.name}</h1>
      {translation.description && (
        <div className="category-description mb-4">
          <p>{translation.description}</p>
        </div>
      )}
      {/* Add more category details or related reports here */}
    </div>
  );
}