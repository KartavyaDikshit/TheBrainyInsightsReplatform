import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ReportService } from "@/lib/db/reports"; // Import the utility function
import { locales } from "../../../../config/i18n"; // Import locales from shared config
import Image from "next/image"; // Import Image component
import { Report } from "@tbi/database"; // Import Report interface

// Define a type for Report with included translations and category with its translations
type ReportWithTranslationsAndCategory = Report & {
  translations: {
    title: string;
    description: string;
    summary?: string;
    slug: string;
    tableOfContents?: string;
    methodology?: string;
    keyFindings?: string[];
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  }[];
  category?: {
    title: string;
    slug: string;
    translations: {
      title: string;
    }[];
  };
};

interface ReportPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ReportPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const report = (await ReportService.getBySlug(slug, locale)) as ReportWithTranslationsAndCategory; // Explicitly cast

  if (!report || report.translations.length === 0) {
    return {};
  }

  const translation = report.translations[0];

  const alternatesLanguages: { [key: string]: string } = {};
  locales.forEach((loc) => {
    alternatesLanguages[loc] = `https://www.thebrainyinsights.com/${loc}/report/${slug}`;
  });

  return {
    title: translation.metaTitle || translation.title,
    description: translation.metaDescription || translation.summary,
    keywords: translation.keywords?.join(', ') || '', // Corrected
    openGraph: {
      title: translation.metaTitle || translation.title,
      description: translation.metaDescription ?? translation.summary ?? undefined,
      url: `https://www.thebrainyinsights.com/${locale}/report/${slug}`,
      images: [
        {
          url: "/og-image.jpg", // Removed heroImage, using placeholder
          width: 1200,
          height: 630,
          alt: translation.title,
        },
      ],
      locale: locale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: translation.metaTitle || translation.title,
      description: translation.metaDescription ?? translation.summary ?? undefined,
      images: ["/twitter-image.jpg"], // Removed heroImage, using placeholder
    },
    alternates: {
      canonical: `https://www.thebrainyinsights.com/${locale}/report/${slug}`,
      languages: alternatesLanguages,
    },
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug, locale } = await params;

  const report = (await ReportService.getBySlug(slug, locale)) as ReportWithTranslationsAndCategory; // Explicitly cast

  if (!report || report.translations.length === 0) {
    notFound();
  }

  const translation = report.translations[0];
  const categoryTranslation = report.category?.translations[0];

  return (
    <div className="report-detail-page">
      <h1 className="text-3xl font-bold mb-4">{translation.title}</h1>
      {categoryTranslation && (
        <p className="text-gray-600 mb-2">Category: {categoryTranslation.title}</p>
      )}
      {report.published_date && ( // Added null check
        <p className="text-gray-600 mb-2">Published: {report.published_date.toDateString()}</p>
      )}
      {/* Removed heroImage as it's not in the current schema */}
      <div className="report-summary mb-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>{translation.summary}</p>
      </div>
      {translation.tableOfContents && (
        <div className="report-toc mb-4">
          <h2 className="text-xl font-semibold">Table of Contents</h2>
          <div dangerouslySetInnerHTML={{ __html: translation.tableOfContents }} />
        </div>
      )}
      {translation.methodology && (
        <div className="report-tof mb-4">
          <h2 className="text-xl font-semibold">Methodology</h2>
          <div dangerouslySetInnerHTML={{ __html: translation.methodology }} />
        </div>
      )}
      {/* Removed segmentation as it's not in the current schema */}
      {/* Removed companies as it's not in the current schema */}
      {/* Removed types as it's not in the current schema */}
      {/* Removed applications as it's not in the current schema */}
      {/* Add more fields as needed */}
    </div>
  );
}