import { ChevronRight, FileText, Clock, Globe, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
  reportDetails?: {
    pages?: number;
    published?: string;
    coverage?: string;
    format?: string;
  };
}

export function ReportHero({
  title,
  subtitle,
  description,
  badges = [],
  breadcrumbs = [],
  features = [],
  reportDetails
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
      
      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          {/* Report Title and Description */}
          <div className="flex-1 text-left flex items-center min-h-[200px]">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-left">
              {title}
              {subtitle && (
                <span className="block text-indigo-200 text-lg md:text-xl lg:text-2xl mt-4 font-normal text-left">{subtitle}</span>
              )}
            </h1>
          </div>

          {/* Report Details Card */}
          {reportDetails && (
            <div className="w-full lg:w-80 flex-shrink-0">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Report Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reportDetails.pages && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Pages
                      </span>
                      <span className="font-medium">150+</span>
                    </div>
                  )}
                  {reportDetails.published && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Published
                      </span>
                      <span className="font-medium">{reportDetails.published}</span>
                    </div>
                  )}
                  {reportDetails.coverage && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Coverage
                      </span>
                      <span className="font-medium">{reportDetails.coverage}</span>
                    </div>
                  )}
                  {reportDetails.format && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Format
                      </span>
                      <span className="font-medium">{reportDetails.format}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
