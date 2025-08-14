import { Metadata } from "next";
import { getAllFaqs } from "@/lib/faqs"; // Import the utility function
import { locales } from "../../../config/i18n"; // Import locales from shared config
import { FAQTranslation, ReportTranslation } from "@prisma/client";
import { JsonLd } from '@/components';
import { FAQPage, Question, Answer, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: "Frequently Asked Questions - TheBrainyInsights",
  description: "Find answers to common questions about market research reports.",
  alternates: {
    canonical: "https://www.thebrainyinsights.com/faqs", // Canonical URL for the current page
    languages: {
      "en-US": "https://www.thebrainyinsights.com/en/faqs",
      "ja-JP": "https://www.thebrainyinsights.com/ja/faqs",
      "de-DE": "https://www.thebrainyinsights.com/de/faqs",
      "es-ES": "https://www.thebrainyinsights.com/es/faqs",
      "fr-FR": "https://www.thebrainyinsights.com/fr/faqs",
      "it-IT": "https://www.thebrainyinsights.com/it/faqs",
      "ko-KR": "https://www.thebrainyinsights.com/ko/faqs",
      "x-default": "https://www.thebrainyinsights.com/en/faqs", // Fallback for unspecified locales
    },
  },
};

interface FaqsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

type FaqWithTranslations = {
  id: string;
  reportId: string | null;
  createdAt: Date;
  updatedAt: Date;
  translations: FAQTranslation[];
  report: {
    translations: ReportTranslation[];
  } | null;
};

export default async function FaqsPage({ params }: FaqsPageProps) {
  const { locale } = await params;

  const faqs = (await getAllFaqs(locale as string)) as FaqWithTranslations[]; // Use the utility function

  const faqPageJsonLd: WithContext<FAQPage> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => {
      const translation = faq.translations[0]; // Assuming the first translation is the primary one
      return {
        '@type': 'Question',
        name: translation.question ?? '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: translation.answer ?? '',
        },
      };
    }),
  };

  return (
    <div className="faqs-list-page">
      <JsonLd data={faqPageJsonLd} />
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq) => {
          const translation = faq.translations[0];
          const reportTranslation = faq.report?.translations[0];

          if (!translation) return null; // Skip if no translation for current locale

          return (
            <div key={faq.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{translation.question}</h2>
              {reportTranslation && (
                <p className="text-gray-600 text-sm mb-1">Related Report: {reportTranslation.title}</p>
              )}
              <p className="text-gray-700 text-sm">{translation.answer}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}