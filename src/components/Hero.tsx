import { Search, Download, CreditCard } from 'lucide-react';

interface HeroProps {
  categoryCount?: number;
  reportCount?: number;
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
        <div className="text-center max-w-4xl mx-auto w-full">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Buy Customer Insight Reports With Confidence
          </h1>
          
          {/* Description */}
          <p className="text-base md:text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
            Access premium market research from leading analysts to make data-driven decisions that accelerate your business growth.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search reports by industry, topic, or company..."
                  className="w-full pl-10 h-12 text-base rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                Search reports
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-indigo-200" />
              <span>Instant download</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-200" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
