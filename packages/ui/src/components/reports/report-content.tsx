"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Download, ExternalLink, Star, Building, TrendingUp, BarChart3, Eye, Maximize2, ZoomIn, ZoomOut, MessageCircle, Settings } from "lucide-react";

// Icon lookup for dynamic rendering
const iconMap = {
  TrendingUp,
  BarChart3, 
  Building,
};
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";

interface TableOfContentsItem {
  chapter: string;
  title: string;
  pages: string;
  subsections: string[];
}

interface RelatedReport {
  title: string;
  price: string;
  pages: string;
  image: string;
  slug?: string;
}

interface Review {
  rating: number;
  text: string;
  author: string;
  company: string;
  logo: string;
}

interface KeyMetric {
  label: string;
  value: string;
  description: string;
  iconName: string;
  color: string;
}

interface ReportContentProps {
  tableOfContents?: TableOfContentsItem[];
  keyMetrics?: KeyMetric[];
  relatedReports?: RelatedReport[];
  reviews?: Review[];
  keyFindings?: string[];
  methodology?: string;
  sampleImages?: Array<{
    title: string;
    image: string;
    alt: string;
  }>;
  onRequestSample?: () => void;
  onRequestQuote?: () => void;
}

export function ReportContent({
  tableOfContents = [],
  keyMetrics = [],
  relatedReports = [],
  reviews = [],
  keyFindings = [],
  methodology,
  sampleImages = [],
  onRequestSample,
  onRequestQuote
}: ReportContentProps) {
  const [samplesOpen, setSamplesOpen] = useState(false);

  return (
    <div className="flex-1 space-y-8">
      {/* Expert Analysis & Custom Options Buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" className="bg-blue-50 border-blue-200 hover:bg-blue-100">
          <MessageCircle className="h-4 w-4 mr-2" />
          Expert Analysis
        </Button>
        <Button variant="outline" className="bg-purple-50 border-purple-200 hover:bg-purple-100">
          <Settings className="h-4 w-4 mr-2" />
          Custom Options
        </Button>
      </div>

      {/* Report Preview Frame */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Report Preview</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[600px]">
            {/* Simulated PDF Preview */}
            <div className="absolute inset-4 bg-white shadow-lg rounded">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-bold text-lg">Report Preview</h3>
                    <p className="text-sm text-muted-foreground">Interactive Report Content</p>
                  </div>
                  <Badge className="bg-indigo-600">Sample Preview</Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Executive Summary</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This comprehensive report provides detailed analysis of market trends, competitive landscape, 
                      and future opportunities. The content is dynamically loaded from the database.
                    </p>
                  </div>
                  
                  {keyMetrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {keyMetrics.slice(0, 2).map((metric, index) => (
                        <div key={index} className="p-3 bg-indigo-50 rounded">
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <p className="text-lg font-bold text-indigo-600">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Interactive Chart Preview</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview Overlay */}
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">Click to view interactive preview</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={onRequestSample}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Full Report Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary with Key Metrics */}
      {keyMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {keyMetrics.map((metric, index) => {
                const IconComponent = iconMap[metric.iconName as keyof typeof iconMap];
                return (
                  <div key={index} className={`p-4 bg-gradient-to-br rounded-lg ${metric.color}`}>
                    {IconComponent && <IconComponent className="h-8 w-8 mb-3" />}
                    <h4 className="font-medium mb-2">{metric.label}</h4>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                );
              })}
            </div>

            {keyFindings.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Key Findings</h4>
                <ul className="space-y-3">
                  {keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2"></span>
                      <p>{finding}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {methodology && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">Research Methodology</h4>
                <div 
                  className="text-sm text-amber-700"
                  dangerouslySetInnerHTML={{ __html: methodology }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Report Details & Contents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Report Details & Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Key Features</TabsTrigger>
              <TabsTrigger value="contents">Table of Contents</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">What's Included</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Comprehensive market sizing and forecasts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Detailed competitive landscape analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Regional market breakdowns and opportunities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Technology trend analysis and roadmaps</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Strategic recommendations for market entry</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Executive dashboards and key metrics</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="contents" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Complete Chapter Breakdown</h4>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Full TOC
                  </Button>
                </div>
                <div className="space-y-4">
                  {tableOfContents.map((chapter) => (
                    <div key={chapter.chapter} className="border-l-2 border-indigo-100 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">
                          Chapter {chapter.chapter}: {chapter.title}
                        </h5>
                        <Badge variant="outline">Pages {chapter.pages}</Badge>
                      </div>
                      <ul className="space-y-1">
                        {chapter.subsections.map((subsection, index) => (
                          <li key={index} className="text-muted-foreground text-sm flex items-center">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                            {subsection}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sources" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">Research Methodology & Sources</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Primary research with 500+ industry leaders</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Government and regulatory databases</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Company financial reports and SEC filings</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Industry association publications</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Proprietary market intelligence platform</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Patent and trademark databases</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sample Content Preview */}
      {sampleImages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Sample Content Preview</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setSamplesOpen(!samplesOpen)}>
                {samplesOpen ? "Hide Samples" : "View More Samples"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {sampleImages.slice(0, 2).map((sample, index) => (
                <div key={index}>
                  <h4 className="font-medium mb-3">{sample.title}</h4>
                  <img
                    src={sample.image}
                    alt={sample.alt}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>

            <Collapsible open={samplesOpen} onOpenChange={setSamplesOpen}>
              <CollapsibleContent className="mt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {sampleImages.slice(2).map((sample, index) => (
                    <div key={index}>
                      <h5 className="font-medium mb-2">{sample.title}</h5>
                      <img
                        src={sample.image}
                        alt={sample.alt}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      )}

      {/* Related Reports */}
      {relatedReports.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Related Reports</CardTitle>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View All in Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedReports.map((report, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img
                      src={report.image}
                      alt={report.title}
                      className="w-full h-32 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-indigo-600">
                      {report.pages} pages
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 line-clamp-2">{report.title}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-indigo-600">{report.price}</span>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Customer Reviews</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.9 ({reviews.length} reviews)</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-l-4 border-indigo-200 pl-4">
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={review.logo}
                      alt={review.company}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <p className="text-sm text-muted-foreground">{review.company}</p>
                      <div className="flex mt-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{review.text}"</p>
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <Button variant="outline">
                Read All Reviews
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Access This Report?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get instant access to comprehensive market intelligence and strategic insights 
            that will drive your business decisions forward.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={onRequestSample}
            >
              Download Sample
            </Button>
            <Button variant="outline" onClick={onRequestQuote}>
              Request Custom Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
