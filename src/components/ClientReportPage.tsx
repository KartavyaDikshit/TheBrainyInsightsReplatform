'use client';

import React from 'react';
import { 
  ReportHero, 
  ReportSidebar, 
  ReportContent,
} from '@tbi/ui';
import { Download, MessageCircle, Calendar, FileText, TrendingUp, BarChart3, Building } from 'lucide-react';
import { Header } from './Header';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';

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

  // Sample report summary text (this will come from database in production)
  const sampleReportText = `Report summary
CAGR - 7.50%, market size-USD 5.80 billion
The global Medical Isotopes market was valued at USD 5.80 billion in 2024 and growing at a CAGR of 7.50% from 2025 to 2034. The market is expected to reach USD 11.95 billion by 2034. Due to the increasing cases of cancer, neurological disorders and cardiovascular diseases, the demand for medical isotopes is increasing, which will also lead to market growth. Apart from this, the increasing population of elderly people is rapidly affected by chronic diseases, making it crucial to diagnose them promptly. Consequently, the demand for medical isotopes is rising. Apart from this, medical isotopes enhance the effectiveness of treatment, thereby increasing the treatment's success rate. Medical isotopes are a type of radioactive material used in nuclear medicine. These isotopes are used to diagnose various other diseases, including cancer. Due to early diagnosis of the disease, the patient receives the right treatment at the right time, and the disease can be stopped from progressing. Medical isotopes have very high efficiency. Due to this, it is used more because the medicines made using it target only the diseased tissue, thereby not affecting other cells of the body. With the help of medical isotopes, it is possible to plan specialized treatments. This is because, with the help of medical isotopes, the treatment can be easily monitored, and with this information, doctors can adjust the treatment accordingly. Apart from this, with the help of this monitoring, the likelihood of disease recurrence can also be calculated.

Get an overview of this study by requesting a free sample
Recent Development
* For Instance, on 22 October 2024, NorthStar Medical Radioisotopes, LLC announced that they had hosted an opening event at the state-of-the-art NorthStar Dose Manufacturing Center in Beloit, Wis., on October 3, 2024. This facility produces dose development services and manufacturing important medical radioisotopes, including Ac-225, Lu-177, Cu-64, Cu-67, and In-111, among others. Will provide services like capacity. NorthStar's additional facility will prove to be of great importance to biopharmaceutical and pharmaceutical companies. This facility will provide customized solutions to help easily understand the complexities involved in radioisotope research, development, and manufacturing. This facility has been designed after careful consideration to provide additional capacity for the industry. At the same time, Northstar can also offer services to meet the demands of customers and regulatory guidelines worldwide.
Market Dynamics
Drivers
Rising Chronic Disease and Ageing Population - The growing population often requires the healthcare industry's services as the ageing body's functions decline, necessitating medical support. Aged persons require a full body checkup every year so that it can be ascertained that all the organs of the body are functioning properly. Apart from this, there are no other changes in the body, and for this, isotopes can be used. The accuracy of these isotopes is high, which enables accurate results. Consequently, diseases can be diagnosed at an early stage, allowing treatment to commence at the optimal time. These, due to the changing lifestyle, the cases of cardiovascular diseases are increasing a lot in people these days, due to which the demand for medical isotopes is increasing because the correct diagnosis of cardiovascular disease is very important so that correct treatment can be planned.
Restraints
Short Half-Life of Isotopes- The short life span of isotopes impacts their market growth negatively. This short life span reduces the accuracy of diagnosis, resulting in most cases being cancelled, which leads to a delay in providing treatment to the patient. Apart from this, the cost of new isotopes must be borne by the patient, which increases the financial burden on them, and hence they are unable to afford it. To maintain its accuracy and shelf life, it is transported in specialized packaging. Due to this, its transportation cost also increases because it is delivered on the same day or in the shortest possible time. Sometimes, due to weather or political events, the delivery is delayed, and due to its short shelf life, the potency decreases, making it unusable.
Opportunities
Development of Nuclear Medicine Infrastructure- The accuracy of medical isotopes is very high, so their use is going to increase in the coming years. However, due to its short lifespan, there is a problem with its production and supply. To overcome this, it is necessary to strengthen its infrastructure, and manufacturing it locally is an even more efficient way to address the problem of its short lifespan without any technical changes. This can reduce the extra cost of diagnosis for the patient. Due to its local availability, the diagnosis process can be accelerated, allowing more patients to benefit from it. Due to its good infrastructure, production costs can also be controlled to some extent, and patients can receive more relief. Because the use of these medical isotopes is not limited to the diagnosis of new patients, they are also used for monitoring existing patients and providing proper guidance for their ongoing treatment.
Challenges
Competition from Alternative Imaging Modalities - Alternative imaging modalities, such as CT scans, ultrasound, and MRI, pose a challenge to the growth of medical isotopes. These technologies are readily available to patients at affordable prices through private or government organisations. Due to this, it will not be easy for the patient to appreciate the benefits of medical isotopes, as their price is very high and they are readily available everywhere. Apart from this, MRI and ultrasound modalities are non-radioactive, meaning there is no harm to the patient, which is why doctors also use these diagnostic methods. Apart from this, patients also have more trust in these traditional modalities, which is why they do not prefer new methods like medical isotopes.
Segment Analysis
Regional segmentation analysis
The regions analyzed for the market include North America, Europe, South America, Asia Pacific, the Middle East, and Africa. North America emerged as the largest market for the global medical isotopes market, with a 48% share of the market revenue in 2024.
North America is a developed region, and hence, every sector in this region is technologically and financially strong. In this region, new technologies are continually being developed to enhance consumer convenience, with ongoing improvements and advancements made possible through continuous investment in research and development. The healthcare infrastructure of the North American region is also financially and technologically strong. Many large companies in this region continuously develop new medicines and diagnostic methods, enabling the provision of the right treatment for patients and the cure of their diseases. Apart from this, the government of this region also ensures a strategic roadmap for the development of medical isotopes, which includes market growth and supply security so that manufacturers do not face any disruptions during production.
North America Region Medical Isotopes Market Share in 2024 - 48%

North America
48
www.thebrainyinsights.com
Check the geographical analysis of this market by requesting a free sample
Type Segment Analysis
The type segment is divided into stable isotopes and radioisotopes. The radioisotopes segment dominated the market, with a market share of 65% in 2024. Radioisotopes are used in both diagnostic imaging and therapeutic applications. This has doubled the demand and increased their market dominance. Radioisotopes precisely kill cancer cells while leaving healthy cells unharmed. This precision has made them in high demand. They are used in hospitals and imaging centres around the world.
Production Method Segment Analysis
The production method segment is divided into nuclear reactors based and cyclotron based. The nuclear reactors based segment dominated the market, with a market share of 58% in 2024. Nuclear reactor-based production enables large-scale production and maintains a consistent supply of isotopes. The demand for medical isotopes is increasing due to their efficiency and precision, so nuclear reactor-based production methods are necessary to maintain a steady supply. Apart from this, isotopes produced through this method are compatible with hospitals, making them easy to use.
Application Segment Analysis
The application segment is divided into diagnostic and nuclear therapy. The diagnostic segment dominated the market, with a market share of 59% in 2024. Medical isotopes are used the most in diagnostics. The main reason for this is the high accuracy and non-invasive nature of medical isotopes. Many patients must undergo regular diagnostic tests, resulting in a high demand for diagnostic applications. Doctors also rely on the results obtained through mesial isotopes, which enable the early diagnosis of diseases and the initiation of their treatment. Apart from this, isotope-based diagnosis is non-invasive, which is why patients are also not afraid to adopt them.
End-User Segment Analysis
The end-user segment is divided into hospitals, diagnostic centers and research institutes. The hospitals segment dominated the market, with a market share of 45% in 2024. Hospitals use medical isotopes the most because they can provide these isotopes with patient volume and infrastructure that facilitates easy revenue generation. Both diagnosis and treatment services are provided in the hospital, which ensures consistent revenue generation from isotopes. Apart from this, the concern about the short shelf life of medical isotopes can also be overcome in the hospital. This is because there are many different patients in the hospital, allowing medical isotopes to be used on one or more patients.
Some of the Key Market Players
* NorthStar Medical Radioisotopes, LLC
* TerraPower Isotopes
* Shine Technologies
* SpectronRx
* IBA Radiopharma Solution
* GE Healthcare
* Nordion Inc
* Isotopen Technologien München
* Jubilant Radiopharma
* Eckert & Ziegler
* Lantheus
* General Atomics
* ASP Isotopes`;

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
        { text: report.category, color: "#10B981" },
        { text: report.title, color: "#3B82F6" }
      ],
      reportDetails: {
        pages: report.pages || 450,
        published: new Date(report.published_date || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        coverage: "Global",
        format: "PDF, Excel"
      }
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
        }
      ],
      keyFindings: [
        "The global AI market is experiencing unprecedented growth, driven by increasing adoption across healthcare, finance, and automotive sectors.",
        "Machine learning and deep learning technologies represent 65% of the total market value, with natural language processing showing the highest growth rate.",
        "Asia-Pacific region is emerging as the fastest-growing market, with China and India leading adoption initiatives."
      ],
      methodology: "This research combines primary interviews with 500+ industry experts, secondary data analysis from 200+ sources, and proprietary market modeling to provide comprehensive insights into the AI market landscape.",
      // Uncomment this to test with Table of Contents data
      // tableOfContents: [
      //   {
      //     chapter: "1",
      //     title: "Executive Summary",
      //     pages: "15-28",
      //     subsections: ["Market Overview", "Key Findings", "Strategic Recommendations"]
      //   },
      //   {
      //     chapter: "2",
      //     title: "Market Dynamics",
      //     pages: "29-85",
      //     subsections: ["Market Drivers", "Market Restraints", "Opportunities", "Challenges"]
      //   },
      //   {
      //     chapter: "3",
      //     title: "Technology Analysis",
      //     pages: "86-150",
      //     subsections: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Robotics"]
      //   },
      //   {
      //     chapter: "4",
      //     title: "Regional Analysis",
      //     pages: "151-280",
      //     subsections: ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"]
      //   },
      //   {
      //     chapter: "5",
      //     title: "Competitive Landscape",
      //     pages: "281-380",
      //     subsections: ["Market Share Analysis", "Company Profiles", "Strategic Initiatives"]
      //   },
      //   {
      //     chapter: "6",
      //     title: "Future Outlook",
      //     pages: "381-450",
      //     subsections: ["Market Forecasts", "Emerging Trends", "Investment Opportunities"]
      //   }
      // ],
      tableOfContents: [], // Empty to show "Request Table of Contents" CTA
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
    // Redirect to contact page with report information
    const params = new URLSearchParams({
      request: 'sample-pdf',
      reportTitle: report.title,
      reportSlug: report.slug
    });
    window.location.href = `/${locale}/contact?${params.toString()}`;
  };

  const handleRequestQuote = () => {
    // Redirect to contact page with report information
    const params = new URLSearchParams({
      request: 'customization',
      reportTitle: report.title,
      reportSlug: report.slug
    });
    window.location.href = `/${locale}/contact?${params.toString()}`;
  };

  const handleRequestTableOfContents = () => {
    // Redirect to contact page with report information
    const params = new URLSearchParams({
      request: 'table-of-contents',
      reportTitle: report.title,
      reportSlug: report.slug
    });
    window.location.href = `/${locale}/contact?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <ReportHero {...reportData.hero} />
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Report Preview on left */}
          <div className="flex-1 min-w-0">
            <ReportContent 
              {...reportData.content}
              onRequestSample={handleRequestSample}
              onRequestQuote={handleRequestQuote}
              onRequestTableOfContents={handleRequestTableOfContents}
              reportSummaryText={sampleReportText}
            />
          </div>
          
          {/* Sidebar - Choose Your License on right */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <ReportSidebar 
              {...reportData.sidebar} 
              locale={locale} 
              reportTitle={report.title}
              reportSlug={report.slug}
            />
          </div>
          
          {/* Mobile Sidebar - Shows at bottom on mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
            <div className="p-4">
              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-bold shadow-lg"
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
      
      {/* Client Testimonials Section */}
      <Testimonials />
      
      {/* Footer */}
      <Footer />
      
      {/* Mobile spacing to account for fixed bottom bar */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
}
