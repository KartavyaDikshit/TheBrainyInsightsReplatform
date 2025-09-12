import { Metadata } from "next";
// import { ReportService } from "@/lib/db/reports";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingTemplate } from "@tbi/ui";
// import type { ReportWithTranslations } from "@/lib/db/reports";

export const metadata: Metadata = {
  title: "All Reports - TheBrainyInsights",
  description: "Browse all market research reports from TheBrainyInsights.",
  alternates: {
    canonical: "https://www.thebrainyinsights.com/reports",
    languages: {
      "en-US": "https://www.thebrainyinsights.com/en/reports",
      "ja-JP": "https://www.thebrainyinsights.com/ja/reports",
      "de-DE": "https://www.thebrainyinsights.com/de/reports",
      "es-ES": "https://www.thebrainyinsights.com/es/reports",
      "fr-FR": "https://www.thebrainyinsights.com/fr/reports",
      "it-IT": "https://www.thebrainyinsights.com/it/reports",
      "ko-KR": "https://www.thebrainyinsights.com/ko/reports",
      "x-default": "https://www.thebrainyinsights.com/en/reports",
    },
  },
};

interface ReportsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { locale } = await params;

  let transformedReports: any[] = [];
  
  try {
    // Temporarily disable database for testing
    // const { reports } = await ReportService.getAll(locale);
    
    // Transform reports data for the ListingTemplate - disabled for testing
    // transformedReports = reports.map((report: ReportWithTranslations) => ({...}));
    transformedReports = []; // Use sample data
  } catch (error) {
    console.log('Database not available, using sample data:', error);
    transformedReports = []; // Ensure it's empty array so we use sample data
  }

  // Add sample reports if no database reports or for testing
  const sampleReports = [
    {
      id: "sample-1",
      title: "Global Artificial Intelligence Market: Growth Analysis & Forecasts 2025-2032",
      description: "Comprehensive market intelligence covering AI adoption trends, competitive landscape, regional analysis, and strategic insights across key industry verticals. Includes detailed forecasts, market sizing, and technology assessment.",
      category: "Technology",
      coverImage: "https://images.unsplash.com/photo-1693045181676-57199422ee66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHJlcG9ydCUyMGRvY3VtZW50JTIwcGRmJTIwcHJldmlld3xlbnwxfHx8fDE3NTc0Nzk5NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "Dec 2024",
      pages: 450,
      rating: 4.9,
      priceInfo: {
        singleUser: "$3,500",
        multiUser: "$5,250",
        corporate: "$7,000"
      },
      badges: ["Premium", "New"],
      isFree: false,
      slug: "global-artificial-intelligence-market-2025-2032",
      locale: locale
    },
    {
      id: "sample-2", 
      title: "Cloud Computing Market: Growth & Opportunities 2025-2030",
      description: "In-depth analysis of cloud computing market trends, key players, regional insights, and growth opportunities. Covering IaaS, PaaS, SaaS segments with detailed forecasts.",
      category: "Technology",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwZ3Jvd3RofGVufDF8fHx8MTc1NzQ3OTk0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "Nov 2024",
      pages: 320,
      rating: 4.7,
      priceInfo: {
        singleUser: "$3,200",
        multiUser: "$4,800",
        corporate: "$6,400"
      },
      badges: ["Trending"],
      isFree: false,
      slug: "cloud-computing-market-2025-2030",
      locale: locale
    },
    {
      id: "sample-3",
      title: "Healthcare IoT Solutions: Industry Applications & Forecasts",
      description: "Comprehensive analysis of IoT applications in healthcare, including remote monitoring, smart devices, and digital health platforms. Market drivers, challenges, and future outlook.",
      category: "Healthcare",
      coverImage: "https://images.unsplash.com/photo-1618044733300-9472054094ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXQlMjByZXNlYXJjaCUyMGFuYWx5dGljcyUyMGNoYXJ0c3xlbnwxfHx8fDE3NTc0Nzk5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "Oct 2024",
      pages: 265,
      rating: 4.8,
      priceInfo: {
        singleUser: "$2,950",
        multiUser: "$4,425",
        corporate: "$5,900"
      },
      badges: ["Popular"],
      isFree: false,
      slug: "healthcare-iot-solutions-2025",
      locale: locale
    }
  ];

  // Combine database reports with sample reports
  const allReports = [...transformedReports, ...sampleReports];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ListingTemplate
        title="Market Research Reports"
        reports={allReports}
        locale={locale}
        showFilters={true}
        showSearch={true}
        showPagination={true}
        itemsPerPage={6}
      />
      <Footer />
    </div>
  );
}