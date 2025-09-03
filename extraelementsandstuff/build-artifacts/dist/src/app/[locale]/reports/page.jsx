import Link from "next/link";
import { ReportService } from "@/lib/db/reports"; // Import the utility function
export const metadata = {
    title: "All Reports - TheBrainyInsights",
    description: "Browse all market research reports from TheBrainyInsights.",
    alternates: {
        canonical: "https://www.thebrainyinsights.com/reports", // Canonical URL for the current page
        languages: {
            "en-US": "https://www.thebrainyinsights.com/en/reports",
            "ja-JP": "https://www.thebrainyinsights.com/ja/reports",
            "de-DE": "https://www.thebrainyinsights.com/de/reports",
            "es-ES": "https://www.thebrainyinsights.com/es/reports",
            "fr-FR": "https://www.thebrainyinsights.com/fr/reports",
            "it-IT": "https://www.thebrainyinsights.com/it/reports",
            "ko-KR": "https://www.thebrainyinsights.com/ko/reports",
            "x-default": "https://www.thebrainyinsights.com/en/reports", // Fallback for unspecified locales
        },
    },
};
export default async function ReportsPage({ params }) {
    const { locale } = await params;
    const { reports } = (await ReportService.getAll(locale)); // Explicitly cast
    return (<div className="reports-list-page">
      <h1 className="text-3xl font-bold mb-6">All Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
            const translation = report.translations[0];
            if (!translation)
                return null; // Skip if no translation for current locale
            return (<div key={report.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/${locale}/report/${report.slug}`} className="text-indigo-600 hover:underline">
                  {translation.title}
                </Link>
              </h2>
              {report.publishedDate && (<p className="text-gray-600 text-sm mb-2">Published: {report.publishedDate.toDateString()}</p>)}
              <p className="text-gray-700 text-sm line-clamp-3">{translation.summary}</p>
            </div>);
        })}
      </div>
    </div>);
}
