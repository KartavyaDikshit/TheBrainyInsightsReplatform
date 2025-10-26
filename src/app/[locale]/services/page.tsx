"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Props {
  params: Promise<{
    locale: string
  }>
}

const services = [
  {
    title: "Consulting Services",
    description: "Strategic advisory services that leverage our deep industry expertise to help you navigate complex market challenges and identify growth opportunities."
  },
  {
    title: "Tailored Insights",
    description: "Custom research solutions designed specifically for your business needs, delivering actionable intelligence that drives informed decision-making."
  },
  {
    title: "Emerging Technologies",
    description: "Stay ahead of the curve with comprehensive analysis of breakthrough technologies and their potential impact on your industry and business model."
  },
  {
    title: "Syndicated Market Reports",
    description: "Comprehensive industry reports covering market size, trends, competitive landscape, and forecasts across various sectors and geographies."
  },
  {
    title: "Competitive Intelligence",
    description: "Deep-dive analysis of your competitive landscape, providing strategic insights into competitor strategies, market positioning, and opportunities."
  },
  {
    title: "Customer Research",
    description: "Comprehensive customer behavior analysis, satisfaction surveys, and consumer preference studies to optimize your customer engagement strategies."
  },
  {
    title: "Market Intelligence",
    description: "Real-time market monitoring and intelligence gathering that keeps you informed of market shifts, opportunities, and emerging trends."
  },
  {
    title: "Industry Development",
    description: "Track industry evolution, regulatory changes, and development patterns that shape your business environment and strategic planning."
  }
];

export default function ServicesPage({ params }: Props) {
  const { locale } = React.use(params);

  const handleRequestCallback = () => {
    console.log("Request callback");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section - Matching Homepage Style */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800" style={{ height: '323.75px' }}>
          {/* Professional Background Pattern */}
          <div className="absolute inset-0">
            {/* Geometric overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-indigo-700/95 to-purple-800/90"></div>
            
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            
            {/* Floating geometric shapes */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute top-32 right-20 w-32 h-32 bg-purple-300/10 rounded-lg rotate-45 blur-lg"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-300/10 rounded-full blur-lg"></div>
            <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/5 rounded-lg rotate-12 blur-xl"></div>
            
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-transparent"></div>
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-center w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                <span className="block bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent">
                  Our Services
                </span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 max-w-4xl mx-auto leading-relaxed">
                Unlock the power of AI-driven market research with TheBrainyInsights. 
                Our comprehensive suite of services delivers actionable intelligence 
                that transforms data into strategic advantage.
              </p>
              
              {/* Professional accent line */}
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-300 mx-auto rounded-full mt-6"></div>
            </div>
          </div>
        </section>
        
        {/* Services Section - NO IMAGES */}
        <div className="bg-gray-50">
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="mb-4 text-slate-900 text-3xl md:text-4xl">
                  Comprehensive Market Research Solutions
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  From strategic consulting to detailed market intelligence, 
                  we provide the insights you need to make informed business decisions.
                </p>
              </div>
              
              <div className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: '#303F9F' }}>
                <div className="space-y-6">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300 rounded-lg p-8"
                    >
                      <h3 className="mb-4 text-white text-xl font-semibold">{service.title}</h3>
                      <p className="text-indigo-100 leading-relaxed">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="mt-16 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                <div className="text-center">
                  <h3 className="mb-4 text-slate-900 text-2xl">
                    Get Expert Guidance
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                    Ready to leverage our expertise? Our specialists are here to help you 
                    with customized research solutions tailored to your needs.
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleRequestCallback}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white border-none px-8 py-3 rounded-lg"
                    >
                      Request Callback
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}