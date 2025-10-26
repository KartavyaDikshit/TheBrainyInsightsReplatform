import { Search, Shield, Download, CreditCard } from 'lucide-react';
import { Button } from './ui/button';

interface HeroProps {
  categoryCount: number;
  reportCount: number;
}

export function Hero({ categoryCount, reportCount }: HeroProps) {
  return (
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
          {/* Main Hero Content */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-2.5xl lg:text-3xl font-bold text-white mb-3 tracking-tight leading-tight">
              <span className="block bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent">
                Welcome to The Brainy Insights
              </span>
            </h1>
            <p className="text-base md:text-lg text-indigo-100 max-w-4xl mx-auto leading-relaxed mb-4">
              Access comprehensive market intelligence across industries. 
              Make informed decisions with premium research reports.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Button size="lg" className="text-white px-4 py-2 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" style={{ backgroundColor: '#303F9F' }}>
              <Search className="mr-2 h-5 w-5" />
              Explore Reports
            </Button>
          </div>

          {/* Key Features - Made Smaller */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-center w-5 h-5 rounded-lg mb-1 mx-auto" style={{ backgroundColor: 'rgba(48, 63, 159, 0.2)' }}>
                <Download className="h-3 w-3 text-indigo-200" />
              </div>
              <h3 className="text-xs font-semibold text-white mb-0">Instant Access</h3>
              <p className="text-indigo-200 text-[10px]">Download reports immediately</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-center w-5 h-5 rounded-lg mb-1 mx-auto" style={{ backgroundColor: 'rgba(48, 63, 159, 0.2)' }}>
                <Shield className="h-3 w-3 text-indigo-200" />
              </div>
              <h3 className="text-xs font-semibold text-white mb-0">Premium Quality</h3>
              <p className="text-indigo-200 text-[10px]">Expert research & verified data</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-center w-5 h-5 rounded-lg mb-1 mx-auto" style={{ backgroundColor: 'rgba(48, 63, 159, 0.2)' }}>
                <CreditCard className="h-3 w-3 text-indigo-200" />
              </div>
              <h3 className="text-xs font-semibold text-white mb-0">Flexible Pricing</h3>
              <p className="text-indigo-200 text-[10px]">Multiple license options</p>
            </div>
          </div>

          {/* Professional accent line */}
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-300 mx-auto rounded-full mt-4"></div>
        </div>
      </div>
    </section>
  );
}
