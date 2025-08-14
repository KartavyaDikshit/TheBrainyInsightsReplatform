import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getReportBySlug } from "@/lib/reports"; // Import the utility function
import { locales } from "../../../../config/i18n"; // Import locales from shared config
import Image from "next/image"; // Import Image component
import { Prisma } from "@prisma/client"; // Import Prisma for types

// Define a type for Report with included translations and category with its translations
type ReportWithTranslationsAndCategory = Prisma.ReportGetPayload<{
  include: {
    translations: true;
    category: {
      include: {
        translations: true;
      };
    };
  };
}>;

interface ReportPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ReportPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const report = (await getReportBySlug(slug, locale)) as ReportWithTranslationsAndCategory; // Explicitly cast

  if (!report || report.translations.length === 0) {
    return {};
  }

  const translation = report.translations[0];

  const alternatesLanguages: { [key: string]: string } = {};
  locales.forEach((loc) => {
    alternatesLanguages[loc] = `https://www.thebrainyinsights.com/${loc}/report/${slug}`;
  });

  return {
    title: translation.seoTitle || translation.title,
    description: translation.seoDesc || translation.summary,
    keywords: translation.keywordsJson ? JSON.parse(translation.keywordsJson).keywords.join(', ') : '',
    openGraph: {
      title: translation.seoTitle || translation.title,
      description: translation.seoDesc || translation.summary,
      url: `https://www.thebrainyinsights.com/${locale}/report/${slug}`,
      images: [
        {
          url: report.heroImage || "https://www.thebrainyinsights.com/og-image.jpg", // Use report image or placeholder
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
      title: translation.seoTitle || translation.title,
      description: translation.seoDesc || translation.summary,
      images: [report.heroImage || "https://www.thebrainyinsights.com/twitter-image.jpg"], // Use report image or placeholder
    },
    alternates: {
      canonical: `https://www.thebrainyinsights.com/${locale}/report/${slug}`,
      languages: alternatesLanguages,
    },
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug, locale } = await params;

  const report = (await getReportBySlug(slug, locale)) as ReportWithTranslationsAndCategory; // Explicitly cast

  if (!report || report.translations.length === 0) {
    notFound();
  }

  const translation = report.translations[0];
  const categoryTranslation = report.category?.translations[0];

  return (
    <div className="report-detail-page">
      <h1 className="text-3xl font-bold mb-4">{translation.title}</h1>
      {categoryTranslation && (
        <p className="text-gray-600 mb-2">Category: {categoryTranslation.name}</p>
      )}
      {report.publishedAt && (
        <p className="text-gray-600 mb-2">Published: {report.publishedAt.toDateString()}</p>
      )}
      {report.heroImage && ( // Conditionally render Image if heroImage exists
        <div className="report-hero-image mb-4">
          <Image
            src={report.heroImage}
            alt={translation.title}
            width={500} // Placeholder width
            height={300} // Placeholder height
            layout="responsive" // Makes image responsive
            objectFit="contain" // Ensures image fits within bounds
          />
        </div>
      )}
      <div className="report-summary mb-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>{translation.summary}</p>
      </div>
      {report.tocHtml && (
        <div className="report-toc mb-4">
          <h2 className="text-xl font-semibold">Table of Contents</h2>
          <div dangerouslySetInnerHTML={{ __html: report.tocHtml }} />
        </div>
      )}
      {report.tofHtml && (
        <div className="report-tof mb-4">
          <h2 className="text-xl font-semibold">Table of Figures</h2>
          <div dangerouslySetInnerHTML={{ __html: report.tofHtml }} />
        </div>
      )}
      {report.segmentation && (
        <div className="report-segmentation mb-4">
          <h2 className="text-xl font-semibold">Segmentation</h2>
          <p>{report.segmentation}</p>
        </div>
      )}
      {report.companies && (
        <div className="report-companies mb-4">
          <h2 className="text-xl font-semibold">Companies Mentioned</h2>
          <p>{report.companies}</p>
        </div>
      )}
      {report.types && (
        <div className="report-types mb-4">
          <h2 className="text-xl font-semibold">Types</h2>
          <p>{report.types}</p>
        </div>
      )}
      {report.applications && (
        <div className="report-applications mb-4">
          <h2 className="text-xl font-semibold">Applications</h2>
          <p>{report.applications}</p>
        </div>
      )}
      {/* Add more fields as needed */}
    </div>
  );
}