import { ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";

interface ReportHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  badges?: Array<{
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }>;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  features?: Array<{
    text: string;
    color: string;
  }>;
}

export function ReportHero({
  title,
  subtitle,
  description,
  badges = [],
  breadcrumbs = [],
  features = []
}: ReportHeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-white/5 rounded-lg transform rotate-12" />
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-purple-300/10 rounded-full" />
      <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-indigo-300/10 rounded-full" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 mb-8">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <ChevronRight className="h-4 w-4 text-indigo-300" />}
                {item.href ? (
                  <a href={item.href} className="text-indigo-200 hover:text-white transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-white">{item.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Report Title and Description */}
        <div className="max-w-4xl">
          {badges.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  variant={badge.variant || "secondary"} 
                  className={badge.variant === "secondary" ? "bg-white/20 text-white border-white/30" : "border-indigo-300 text-indigo-100"}
                >
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
            {subtitle && (
              <span className="block text-indigo-200">{subtitle}</span>
            )}
          </h1>
          
          <p className="text-xl text-indigo-100 leading-relaxed max-w-3xl">
            {description}
          </p>
          
          {features.length > 0 && (
            <div className="flex items-center gap-6 mt-8 text-indigo-200">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: feature.color }}
                  ></span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
