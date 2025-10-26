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
    },
    {
      id: "sample-4",
      title: "Renewable Energy Market: Solar & Wind Power Analysis 2025-2030",
      description: "Detailed market analysis of renewable energy sector focusing on solar and wind power. Includes government policies, investment trends, and regional market dynamics.",
      category: "Energy",
      coverImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMHdpbmQlMjB0dXJiaW5lc3xlbnwxfHx8fDE3NTc0Nzk5NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "Sep 2024",
      pages: 380,
      rating: 4.6,
      priceInfo: {
        singleUser: "$3,400",
        multiUser: "$5,100",
        corporate: "$6,800"
      },
      badges: ["Trending"],
      isFree: false,
      slug: "renewable-energy-market-2025-2030",
      locale: locale
    },
    {
      id: "sample-5",
      title: "E-commerce Platform Market: Digital Transformation Insights",
      description: "Analysis of e-commerce platforms, digital payment systems, and consumer behavior trends. Market size, growth drivers, and competitive landscape analysis.",
      category: "Retail",
      coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBzaG9wcGluZyUyMG9ubGluZXxlbnwxfHx8fDE3NTc0Nzk5NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "Aug 2024",
      pages: 290,
      rating: 4.5,
      priceInfo: {
        singleUser: "$2,800",
        multiUser: "$4,200",
        corporate: "$5,600"
      },
      badges: ["Popular"],
      isFree: false,
      slug: "ecommerce-platform-market-2025",
      locale: locale
    },
    {
      id: "sample-6",
      title: "5G Technology Market: Infrastructure & Applications 2025-2032",
      description: "Comprehensive study of 5G technology deployment, infrastructure requirements, use cases, and market opportunities across industries.",
      category: "Technology",
      coverImage: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw1ZyUyMHRlY2hub2xvZ3klMjBuZXR3b3JrfGVufDF8fHx8MTc1NzQ3OTk1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "Jul 2024",
      pages: 410,
      rating: 4.7,
      priceInfo: {
        singleUser: "$3,600",
        multiUser: "$5,400",
        corporate: "$7,200"
      },
      badges: ["New"],
      isFree: false,
      slug: "5g-technology-market-2025-2032",
      locale: locale
    },
    {
      id: "sample-7",
      title: "Electric Vehicle Market: Global Trends & Forecast 2025-2030",
      description: "In-depth analysis of electric vehicle market including battery technology, charging infrastructure, government incentives, and market penetration by region.",
      category: "Automotive",
      coverImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZ3xlbnwxfHx8fDE3NTc0Nzk5NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "Jun 2024",
      pages: 340,
      rating: 4.8,
      priceInfo: {
        singleUser: "$3,300",
        multiUser: "$4,950",
        corporate: "$6,600"
      },
      badges: ["Trending", "Premium"],
      isFree: false,
      slug: "electric-vehicle-market-2025-2030",
      locale: locale
    },
    {
      id: "sample-8",
      title: "Cybersecurity Market: Threat Analysis & Solutions 2025-2030",
      description: "Comprehensive cybersecurity market research covering threat landscape, security solutions, compliance requirements, and market growth projections.",
      category: "Technology",
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwZGF0YSUyMHByb3RlY3Rpb258ZW58MXx8fHwxNzU3NDc5OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "May 2024",
      pages: 375,
      rating: 4.9,
      priceInfo: {
        singleUser: "$3,700",
        multiUser: "$5,550",
        corporate: "$7,400"
      },
      badges: ["Premium"],
      isFree: false,
      slug: "cybersecurity-market-2025-2030",
      locale: locale
    },
    {
      id: "sample-9",
      title: "Biotechnology Market: Innovation & Investment Opportunities",
      description: "Market analysis of biotechnology sector including gene therapy, personalized medicine, biopharmaceuticals, and agricultural biotechnology.",
      category: "Healthcare",
      coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW90ZWNobm9sb2d5JTIwbGFifGVufDF8fHx8MTc1NzQ3OTk2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "Apr 2024",
      pages: 420,
      rating: 4.6,
      priceInfo: {
        singleUser: "$3,900",
        multiUser: "$5,850",
        corporate: "$7,800"
      },
      badges: ["Popular"],
      isFree: false,
      slug: "biotechnology-market-2025",
      locale: locale
    },
    {
      id: "sample-10",
      title: "Smart Home Technology Market: Consumer Trends & Adoption",
      description: "Analysis of smart home devices, IoT integration, consumer preferences, and market growth. Includes smart speakers, security systems, and home automation.",
      category: "Technology",
      coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NzQ3OTk2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "Mar 2024",
      pages: 295,
      rating: 4.5,
      priceInfo: {
        singleUser: "$2,900",
        multiUser: "$4,350",
        corporate: "$5,800"
      },
      badges: ["Trending"],
      isFree: false,
      slug: "smart-home-technology-market-2025",
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
        showSearch={false}
        showPagination={true}
        itemsPerPage={9}
      />
      <Footer />
    </div>
  );
}