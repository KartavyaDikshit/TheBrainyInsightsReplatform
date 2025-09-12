'use client';

import React from 'react';
import { 
  ReportHero, 
  ReportSidebar, 
  ReportContent,
} from '@tbi/ui';
import { Download, MessageCircle, Calendar, FileText, TrendingUp, BarChart3, Building } from 'lucide-react';

interface ClientReportPageProps {
  locale: string;
  slug: string;
}

export function ClientReportPage({ locale, slug }: ClientReportPageProps) {
  // Generate dynamic report data based on slug
  const generateReportData = (slug: string) => {
    // Extract category and info from slug
    const categoryMap: { [key: string]: { title: string, category: string, icon: string } } = {
      'technology': { title: 'Technology', category: 'Technology', icon: '💻' },
      'healthcare': { title: 'Healthcare', category: 'Healthcare', icon: '🏥' },
      'finance': { title: 'Finance', category: 'Finance', icon: '💰' },
      'energy': { title: 'Energy', category: 'Energy', icon: '⚡' },
      'automotive': { title: 'Automotive', category: 'Automotive', icon: '🚗' },
      'food-beverages': { title: 'Food & Beverages', category: 'Food & Beverages', icon: '🍽️' },
      'consumer-goods': { title: 'Consumer Goods', category: 'Consumer Goods', icon: '🛒' },
      'manufacturing': { title: 'Manufacturing', category: 'Manufacturing', icon: '🏭' },
      'aerospace-defense': { title: 'Aerospace & Defense', category: 'Aerospace & Defense', icon: '✈️' },
    };

    // Default to AI market if no specific category found
    let categoryInfo = { title: 'Technology', category: 'Technology', icon: '💻' };
    let reportTitle = "Global Artificial Intelligence Market";
    
    // Try to match category from slug
    for (const [key, value] of Object.entries(categoryMap)) {
      if (slug.includes(key)) {
        categoryInfo = value;
        reportTitle = `Global ${value.title} Market`;
        break;
      }
    }

    // Generate report title based on slug patterns
    if (slug.includes('market-analysis')) {
      reportTitle = `${categoryInfo.title} Market Analysis & Forecasts 2025-2032`;
    } else if (slug.includes('trends')) {
      reportTitle = `${categoryInfo.title} Industry Trends & Opportunities 2025-2030`;
    } else if (slug.includes('segmentation')) {
      reportTitle = `${categoryInfo.title} Market Segmentation & Regional Analysis`;
    } else if (slug.includes('innovation')) {
      reportTitle = `${categoryInfo.title} Innovation & Technology Outlook 2025`;
    }

    return {
      title: reportTitle,
      category: categoryInfo.category,
      icon: categoryInfo.icon,
      summary: `Comprehensive market intelligence covering ${categoryInfo.title.toLowerCase()} adoption trends, competitive landscape, regional analysis, and strategic insights across key industry verticals.`,
      pages: Math.floor(Math.random() * 200) + 250,
      published_date: new Date('2024-12-01'),
      slug: slug
    };
  };

  const report = generateReportData(slug);

  // Sample data for the enhanced UI
  const reportData = {
    hero: {
      title: report.title,
      subtitle: "Growth Analysis & Forecasts 2025-2032",
      description: report.summary || "Comprehensive market intelligence covering adoption trends, competitive landscape, regional analysis, and strategic insights across key industry verticals.",
      badges: [
        { text: "Premium Report", variant: "secondary" as const },
        { text: `${report.pages || 450} Pages`, variant: "outline" as const },
        { text: `Published ${new Date(report.published_date || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`, variant: "outline" as const }
      ],
      breadcrumbs: [
        { label: 'Home', href: `/${locale}` },
        { label: 'Categories', href: `/${locale}/categories` },
        { label: report.category, href: `/${locale}/categories/${slug.split('-')[0]}` },
        { label: 'Report Details' }
      ],
      features: [
        { text: "Sample Available", color: "#10B981" },
        { text: "Interactive Preview", color: "#3B82F6" },
        { text: "Premium Content", color: "#8B5CF6" }
      ]
    },
    sidebar: {
      reportPreview: {
        image: "https://images.unsplash.com/photo-1693045181676-57199422ee66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHJlcG9ydCUyMGRvY3VtZW50JTIwcGRmJTIwcHJldmlld3xlbnwxfHx8fDE3NTc0Nzk5NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        alt: "Report Preview",
        sampleAvailable: true
      },
      pricing: {
        singleUser: 3500,
        multiUser: 5250,
        corporate: 7000,
        currency: "$"
      },
      reportDetails: {
        pages: report.pages || 450,
        published: new Date(report.published_date || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        coverage: "Global",
        format: "PDF, Excel",
        industryTags: [report.category, "Market Research", "Industry Analysis", "Strategic Insights"],
        languages: ["English", "Spanish"]
      },
      quickActions: [
        { label: "Request Sample PDF", icon: Download },
        { label: "Request Customization", icon: FileText },
        { label: "Talk to Analyst", icon: MessageCircle },
        { label: "Schedule Consultation", icon: Calendar }
      ],
      contactInfo: {
        phone: "+1 (555) 123-4567",
        hours: "Mon-Fri 9AM-6PM EST",
        liveChat: true
      }
    },
    content: {
      keyMetrics: [
        {
          label: "Market Size",
          value: "$847.3B",
          description: "By 2032",
          iconName: "TrendingUp",
          color: "from-indigo-50 to-purple-50 text-indigo-600"
        },
        {
          label: "CAGR",
          value: "22.5%",
          description: "2025-2032",
          iconName: "BarChart3",
          color: "from-green-50 to-emerald-50 text-green-600"
        },
        {
          label: "Key Players",
          value: "150+",
          description: "Companies",
          iconName: "Building",
          color: "from-purple-50 to-pink-50 text-purple-600"
        }
      ],
      keyFindings: [
        "The global AI market is experiencing unprecedented growth, driven by increasing adoption across healthcare, finance, and automotive sectors.",
        "Machine learning and deep learning technologies represent 65% of the total market value, with natural language processing showing the highest growth rate.",
        "Asia-Pacific region is emerging as the fastest-growing market, with China and India leading adoption initiatives."
      ],
      methodology: "This research combines primary interviews with 500+ industry experts, secondary data analysis from 200+ sources, and proprietary market modeling to provide comprehensive insights into the AI market landscape.",
      tableOfContents: [
        {
          chapter: "1",
          title: "Executive Summary",
          pages: "15-28",
          subsections: ["Market Overview", "Key Findings", "Strategic Recommendations"]
        },
        {
          chapter: "2",
          title: "Market Dynamics",
          pages: "29-85",
          subsections: ["Market Drivers", "Market Restraints", "Opportunities", "Challenges"]
        },
        {
          chapter: "3",
          title: "Technology Analysis",
          pages: "86-150",
          subsections: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Robotics"]
        },
        {
          chapter: "4",
          title: "Regional Analysis",
          pages: "151-280",
          subsections: ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"]
        },
        {
          chapter: "5",
          title: "Competitive Landscape",
          pages: "281-380",
          subsections: ["Market Share Analysis", "Company Profiles", "Strategic Initiatives"]
        },
        {
          chapter: "6",
          title: "Future Outlook",
          pages: "381-450",
          subsections: ["Market Forecasts", "Emerging Trends", "Investment Opportunities"]
        }
      ],
      sampleImages: [
        {
          title: "Market Growth Chart",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwZ3Jvd3RofGVufDF8fHx8MTc1NzQ3OTk0OXww&ixlib=rb-4.1.0&q=80&w=1080",
          alt: "Market Growth Chart"
        },
        {
          title: "Regional Analysis",
          image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXQlMjByZXNlYXJjaCUyMGFuYWx5dGljcyUyMGNoYXJ0c3xlbnwxfHx8fDE3NTc0Nzk5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
          alt: "Regional Analysis Chart"
        }
      ],
      relatedReports: [
        {
          title: "Machine Learning in Healthcare: Market Analysis 2025",
          price: "$2,850",
          pages: "285",
          image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXQlMjByZXNlYXJjaCUyMGFuYWx5dGljcyUyMGNoYXJ0c3xlbnwxfHx8fDE3NTc0Nzk5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Cloud Computing Market: Growth & Opportunities",
          price: "$3,200",
          pages: "320",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwZ3Jvd3RofGVufDF8fHx8MTc1NzQ3OTk0OXww&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "IoT Solutions: Industry Applications & Forecasts",
          price: "$2,950",
          pages: "265",
          image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXQlMjByZXNlYXJjaCUyMGFuYWx5dGljcyUyMGNoYXJ0c3xlbnwxfHx8fDE3NTc0Nzk5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ],
      reviews: [
        {
          rating: 5,
          text: "Exceptional depth of analysis. The AI market insights helped us make strategic decisions worth millions.",
          author: "Sarah Chen",
          company: "TechVenture Capital",
          logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGJ1c2luZXNzJTIwZ3Jvd3RofGVufDF8fHx8MTc1NzQ3OTk0OXww&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          rating: 5,
          text: "Comprehensive coverage with actionable insights. Best research report we've purchased.",
          author: "Michael Rodriguez",
          company: "InnovateCorp",
          logo: "https://images.unsplash.com/photo-1618044733300-9472054094ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXQlMjByZXNlYXJjaCUyMGFuYWx5dGljcyUyMGNoYXJ0c3xlbnwxfHx8fDE3NTc0Nzk5NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ]
    }
  };

  const handleRequestSample = () => {
    // Handle sample request
    console.log('Request sample for report:', report.title);
    alert('Sample request submitted! We will send you the sample PDF shortly.');
  };

  const handleRequestQuote = () => {
    // Handle custom quote request
    console.log('Request quote for report:', report.title);
    alert('Quote request submitted! Our sales team will contact you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ReportHero {...reportData.hero} />
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <ReportSidebar {...reportData.sidebar} />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ReportContent 
              {...reportData.content}
              onRequestSample={handleRequestSample}
              onRequestQuote={handleRequestQuote}
            />
          </div>
          
          {/* Mobile Sidebar - Shows at bottom on mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
            <div className="p-4">
              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium"
                  onClick={handleRequestQuote}
                >
                  Buy Now - ${reportData.sidebar.pricing.singleUser.toLocaleString()}
                </button>
                <button 
                  className="px-4 py-3 border border-gray-300 rounded-lg"
                  onClick={handleRequestSample}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile spacing to account for fixed bottom bar */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
}
