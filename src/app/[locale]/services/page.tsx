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

  const handleRequestCustomization = () => {
    console.log("Requesting customization");
  };

  const handleTalkToAnalyst = () => {
    console.log("Talk to analyst");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* SOLID BLUE HERO SECTION - NO IMAGES */}
        <div style={{
          backgroundColor: '#3730a3',
          background: '#3730a3',
          backgroundImage: 'none',
          padding: '80px 16px',
          width: '100%'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              Our Services
            </h1>
            <p style={{ 
              color: '#c7d2fe', 
              fontSize: '20px', 
              maxWidth: '768px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Unlock the power of AI-driven market research with TheBrainyInsights. 
              Our comprehensive suite of services delivers actionable intelligence 
              that transforms data into strategic advantage.
            </p>
          </div>
        </div>
        
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
              
              <div className="space-y-6">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl p-8"
                  >
                    <h3 className="mb-4 text-slate-900 text-xl font-semibold">{service.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons Section */}
              <div className="mt-16 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                <div className="text-center">
                  <h3 className="mb-4 text-slate-900 text-2xl">
                    Get Expert Guidance
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                    Ready to leverage our expertise? Connect with our specialists to customize 
                    your research approach or speak directly with our analysts.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Button 
                      onClick={handleRequestCustomization}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white border-none px-8 py-3 rounded-lg"
                    >
                      Request Customization
                    </Button>
                    <Button 
                      onClick={handleTalkToAnalyst}
                      variant="outline" 
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 px-8 py-3 rounded-lg"
                    >
                      Talk to Analyst
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