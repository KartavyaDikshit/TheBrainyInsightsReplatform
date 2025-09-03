import { notFound } from "next/navigation";
import { ReportService } from "@/lib/db/reports"; // Import the utility function
import { locales } from "../../../../config/i18n"; // Import locales from shared config
export async function generateMetadata({ params }) {
    var _a, _b, _c, _d;
    const { slug, locale } = await params;
    const report = (await ReportService.getBySlug(slug, locale)); // Explicitly cast
    if (!report || report.translations.length === 0) {
        return {};
    }
    const translation = report.translations[0];
    const alternatesLanguages = {};
    locales.forEach((loc) => {
        alternatesLanguages[loc] = `https://www.thebrainyinsights.com/${loc}/report/${slug}`;
    });
    return {
        title: translation.metaTitle || translation.title,
        description: translation.metaDescription || translation.summary,
        keywords: translation.keywords.join(', '), // Corrected
        openGraph: {
            title: translation.metaTitle || translation.title,
            description: (_b = (_a = translation.metaDescription) !== null && _a !== void 0 ? _a : translation.summary) !== null && _b !== void 0 ? _b : undefined,
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
            description: (_d = (_c = translation.metaDescription) !== null && _c !== void 0 ? _c : translation.summary) !== null && _d !== void 0 ? _d : undefined,
            images: ["/twitter-image.jpg"], // Removed heroImage, using placeholder
        },
        alternates: {
            canonical: `https://www.thebrainyinsights.com/${locale}/report/${slug}`,
            languages: alternatesLanguages,
        },
    };
}
export default async function ReportPage({ params }) {
    var _a;
    const { slug, locale } = await params;
    const report = (await ReportService.getBySlug(slug, locale)); // Explicitly cast
    if (!report || report.translations.length === 0) {
        notFound();
    }
    const translation = report.translations[0];
    const categoryTranslation = (_a = report.category) === null || _a === void 0 ? void 0 : _a.translations[0];
    return (<div className="report-detail-page">
      <h1 className="text-3xl font-bold mb-4">{translation.title}</h1>
      {categoryTranslation && (<p className="text-gray-600 mb-2">Category: {categoryTranslation.title}</p>)}
      {report.publishedDate && ( // Added null check
        <p className="text-gray-600 mb-2">Published: {report.publishedDate.toDateString()}</p>)}
      {/* Removed heroImage as it's not in the current schema */}
      <div className="report-summary mb-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>{translation.summary}</p>
      </div>
      {translation.tableOfContents && (<div className="report-toc mb-4">
          <h2 className="text-xl font-semibold">Table of Contents</h2>
          <div dangerouslySetInnerHTML={{ __html: translation.tableOfContents }}/>
        </div>)}
      {translation.methodology && (<div className="report-tof mb-4">
          <h2 className="text-xl font-semibold">Methodology</h2>
          <div dangerouslySetInnerHTML={{ __html: translation.methodology }}/>
        </div>)}
      {/* Removed segmentation as it's not in the current schema */}
      {/* Removed companies as it's not in the current schema */}
      {/* Removed types as it's not in the current schema */}
      {/* Removed applications as it's not in the current schema */}
      {/* Add more fields as needed */}
    </div>);
}
