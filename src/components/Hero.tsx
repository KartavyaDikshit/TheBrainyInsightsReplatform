import { Search, Shield, Download, CreditCard } from 'lucide-react';
import { Button } from './ui/button';

interface HeroProps {
  categoryCount: number;
  reportCount: number;
}

export function Hero({ categoryCount, reportCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 py-20 lg:py-32">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Hero Content */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              The Global Leader in
              <span className="block bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent">
                Market Research
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Access comprehensive market intelligence across {categoryCount.toLocaleString()}+ industries. 
              Make informed decisions with {reportCount.toLocaleString()}+ premium research reports.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Search className="mr-2 h-5 w-5" />
              Explore Reports
            </Button>
            <Button variant="outline" size="lg" className="border-indigo-200 text-indigo-100 hover:bg-indigo-700/20 hover:text-white px-8 py-4 text-lg font-semibold backdrop-blur transition-all duration-300">
              <Shield className="mr-2 h-5 w-5" />
              View Categories
            </Button>
          </div>

          {/* Key Features - Made Smaller */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg mb-2 mx-auto">
                <Download className="h-4 w-4 text-purple-200" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Instant Access</h3>
              <p className="text-indigo-200 text-xs">Download reports immediately</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-lg mb-2 mx-auto">
                <Shield className="h-4 w-4 text-indigo-200" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Premium Quality</h3>
              <p className="text-indigo-200 text-xs">Expert research & verified data</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg mb-2 mx-auto">
                <CreditCard className="h-4 w-4 text-purple-200" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Flexible Pricing</h3>
              <p className="text-indigo-200 text-xs">Multiple license options</p>
            </div>
          </div>

          {/* Professional accent line */}
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-300 mx-auto rounded-full mt-12"></div>
        </div>
      </div>
    </section>
  );
}
