import { MessageCircle, Phone, Download, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface CategoryDetailSidebarProps {
  categoryName: string;
  popularReports?: Array<{
    title: string;
    price: number;
    isNew?: boolean;
    slug: string;
  }>;
  relatedCategories?: Array<{
    name: string;
    reportCount: number;
    slug: string;
  }>;
  locale?: string;
}

export function CategoryDetailSidebar({ 
  categoryName, 
  popularReports = [],
  relatedCategories = [],
  locale = 'en'
}: CategoryDetailSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Popular Reports */}
      {popularReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Popular in {categoryName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularReports.slice(0, 3).map((report, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1 hover:text-indigo-600 cursor-pointer">
                      {report.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>${report.price.toLocaleString()}</span>
                      {report.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4" size="sm">
              View All Popular Reports
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedCategories.slice(0, 4).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    {category.name}
                  </h4>
                  <p className="text-xs text-gray-500">{category.reportCount} reports</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Category Overview Download */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Category Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Download a comprehensive overview of the {categoryName} market research category.
          </p>
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </CardContent>
      </Card>

      {/* Speak to Analyst */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Speak to Analyst
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Get personalized insights and custom research solutions from our industry experts.
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
