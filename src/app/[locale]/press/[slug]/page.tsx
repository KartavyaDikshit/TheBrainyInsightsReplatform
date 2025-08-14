import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPressBySlug } from "@/lib/presses"; // Import the utility function
import { JsonLd } from '@/components';
import { Article, WithContext } from 'schema-dts';
import { locales } from "../../../../config/i18n"; // Import locales from shared config
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

interface PressPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PressPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const press = (await getPressBySlug(slug, locale)) as PressWithCategoryAndTranslations; // Explicitly cast

  if (!press) {
    return {};
  }

  const categoryTranslation = press.category?.translations[0];

  const alternatesLanguages: { [key: string]: string } = {};
  locales.forEach((loc) => {
    alternatesLanguages[loc] = `https://www.thebrainyinsights.com/${loc}/press/${slug}`;
  });

  return {
    title: press.seoTitle || press.title,
    description: press.seoDescription || press.description,
    keywords: press.seoKeywords || '',
    openGraph: {
      title: press.seoTitle || press.title,
      description: press.seoDescription || press.description,
      url: `https://www.thebrainyinsights.com/${locale}/press/${slug}`,
      siteName: "TheBrainyInsights",
      images: [
        {
          url: "https://www.thebrainyinsights.com/og-image.jpg", // Placeholder, replace with actual OG image
          width: 1200,
          height: 630,
          alt: press.title || "Press Release",
        },
      ],
      locale: locale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: press.seoTitle || press.title,
      description: press.seoDescription || press.description,
      images: ["https://www.thebrainyinsights.com/twitter-image.jpg"], // Placeholder
    },
    alternates: {
      canonical: `https://www.thebrainyinsights.com/${locale}/press/${slug}`,
      languages: alternatesLanguages,
    },
  };
}

export default async function PressPage({ params }: PressPageProps) {
  const { slug, locale } = await params;

  const press = (await getPressBySlug(slug, locale)) as PressWithCategoryAndTranslations; // Explicitly cast

  if (!press) {
    notFound();
  }

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: press.title,
    description: press.description,
    author: {
      '@type': 'Organization',
      name: 'The Brainy Insights',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Brainy Insights',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.thebrainyinsights.com/og-image.jpg', // Using the placeholder OG image for now
      },
    },
    datePublished: press.publishedAt ? new Date(press.publishedAt).toISOString() : new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.thebrainyinsights.com/${locale}/press/${slug}`,
    },
  };

  const categoryTranslation = press.category?.translations[0];

  return (
    <div className="press-detail-page">
      <JsonLd data={jsonLd} />
      <h1 className="text-3xl font-bold mb-4">{press.title}</h1>
      {categoryTranslation && (
        <p className="text-gray-600 mb-2">Category: {categoryTranslation.name}</p>
      )}
      {press.publishedAt && (
        <p className="text-gray-600 mb-2">Published: {press.publishedAt.toDateString()}</p>
      )}
      {press.description && (
        <div className="press-description mb-4">
          <p>{press.description}</p>
        </div>
      )}
      {/* Add more press details as needed */}
    </div>
  );
}