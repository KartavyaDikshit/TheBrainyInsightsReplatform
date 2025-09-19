"use client";

import { Button } from '@tbi/ui';

export function HeroSection() {
  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Get Expert Market Research Insights
            </h1>
            <p className="text-xl mb-8 text-indigo-100 leading-relaxed">
              Partner with industry-leading analysts to unlock actionable insights that drive your business forward. Our team of experts delivers comprehensive market intelligence tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToContact}
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3"
              >
                Start Your Project
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-2xl w-full h-64 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Professional Business Office</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#4f46e5]/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
