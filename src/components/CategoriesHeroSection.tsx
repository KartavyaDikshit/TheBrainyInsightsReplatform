export function CategoriesHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 py-20">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Research Categories
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed">
            Explore comprehensive market research across various industries and sectors. 
            Discover insights that drive informed business decisions.
          </p>
        </div>
        
        {/* Professional accent line */}
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-300 mx-auto rounded-full"></div>
      </div>
    </section>
  );
}
