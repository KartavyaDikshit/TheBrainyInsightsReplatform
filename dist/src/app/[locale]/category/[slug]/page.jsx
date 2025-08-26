import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data/adapter"; // Import the utility function and custom type
import { locales } from "../../../../config/i18n"; // Import locales from shared config
export async function generateMetadata({ params }) {
    var _a, _b, _c, _d;
    const { slug, locale } = params;
    const category = await getCategoryBySlug(slug, locale); // Cast to string
    if (!category || !category.translations || category.translations.length === 0) { // Added null check
        return {};
    }
    const translation = category.translations[0];
    const alternatesLanguages = {};
    locales.forEach((loc) => {
        alternatesLanguages[loc] = `https://www.thebrainyinsights.com/${loc}/category/${slug}`;
    });
    return {
        title: translation.metaTitle || translation.title,
        description: translation.metaDescription || translation.description,
        openGraph: {
            title: translation.metaTitle || translation.title,
            description: (_b = (_a = translation.metaDescription) !== null && _a !== void 0 ? _a : translation.description) !== null && _b !== void 0 ? _b : '',
            url: `https://www.thebrainyinsights.com/${locale}/category/${slug}`,
            siteName: "TheBrainyInsights",
            images: [
                {
                    url: "https://www.thebrainyinsights.com/og-image.jpg", // Placeholder, replace with actual OG image
                    width: 1200,
                    height: 630,
                    alt: translation.title,
                },
            ],
            locale: locale,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: translation.metaTitle || translation.title,
            description: (_d = (_c = translation.metaDescription) !== null && _c !== void 0 ? _c : translation.description) !== null && _d !== void 0 ? _d : '',
            images: ["https://www.thebrainyinsights.com/twitter-image.jpg"], // Placeholder
        },
        alternates: {
            canonical: `https://www.thebrainyinsights.com/${locale}/category/${slug}`,
            languages: alternatesLanguages,
        },
    };
}
export default async function CategoryPage({ params }) {
    const { slug, locale } = params;
    const category = await getCategoryBySlug(slug, locale); // Use the utility function
    if (!category || !category.translations || category.translations.length === 0) { // Added null check
        notFound();
    }
    const translation = category.translations[0];
    return (<div className="category-detail-page">
      <h1 className="text-3xl font-bold mb-4">{translation.title}</h1>
      {translation.description && (<div className="category-description mb-4">
          <p>{translation.description}</p>
        </div>)}
      {/* Add more category details or related reports here */}
    </div>);
}
