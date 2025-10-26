import { MessageCircle, CreditCard, Download, FileText, Calendar, Phone } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface ReportSidebarProps {
  reportPreview?: {
    image: string;
    alt: string;
    sampleAvailable?: boolean;
  };
  pricing?: {
    singleUser: number;
    multiUser: number;
    corporate: number;
    currency?: string;
  };
  quickActions?: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
  }>;
  contactInfo?: {
    phone?: string;
    hours?: string;
    liveChat?: boolean;
  };
  locale?: string;
  reportTitle?: string;
  reportSlug?: string;
}

export function ReportSidebar({
  reportPreview,
  pricing,
  quickActions = [],
  contactInfo,
  locale = 'en',
  reportTitle,
  reportSlug
}: ReportSidebarProps) {
  // Helper function to build contact URL with report information
  const buildContactUrl = (requestType: string) => {
    const params = new URLSearchParams({ request: requestType });
    if (reportTitle) params.append('reportTitle', reportTitle);
    if (reportSlug) params.append('reportSlug', reportSlug);
    return `/${locale}/contact?${params.toString()}`;
  };
  return (
    <div className="w-80 space-y-6">
      {/* Pricing Section */}
      {pricing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Your License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Single User</h4>
                  <span className="text-2xl font-bold text-indigo-600">
                    {pricing.currency || '$'}{pricing.singleUser.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Perfect for individual researchers and analysts
                </p>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Buy Now
                </Button>
              </div>

              <div className="p-4 border rounded-lg hover:border-indigo-500 transition-colors cursor-pointer bg-indigo-50/50">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium">Multi-User</h4>
                    <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">
                    {pricing.currency || '$'}{pricing.multiUser.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Share with up to 5 team members
                </p>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Buy Now
                </Button>
              </div>

              <div className="p-4 border rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Corporate</h4>
                  <span className="text-2xl font-bold text-indigo-600">
                    {pricing.currency || '$'}{pricing.corporate.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Enterprise-wide access with additional benefits
                </p>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Buy Now
                </Button>
              </div>
            </div>

            <Separator />

            <Button variant="outline" className="w-full">
              Request Custom Quote
            </Button>

            <div className="flex justify-center gap-4 pt-2">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                Visa, Mastercard, PayPal, Bank Transfer
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <Button 
            className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => window.location.href = buildContactUrl('sample-pdf')}
          >
            <Download className="h-5 w-5 mr-2" />
            Request Sample PDF
          </Button>
          <Button 
            className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => window.location.href = buildContactUrl('customization')}
          >
            <FileText className="h-5 w-5 mr-2" />
            Request Customization
          </Button>
          <Button 
            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => window.location.href = buildContactUrl('talk-to-analyst')}
          >
            <Phone className="h-5 w-5 mr-2" />
            Talk to Analyst
          </Button>
          <Button 
            className="w-full justify-start bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => window.location.href = buildContactUrl('consultation')}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Consultation
          </Button>
        </CardContent>
      </Card>

      {/* Contact Us */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Send us an email</p>
              <a 
                href="mailto:info@thebrainyinsights.com" 
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
              >
                info@thebrainyinsights.com
              </a>
            </div>
          </div>
          
          <Button 
            variant="default" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            onClick={() => window.location.href = buildContactUrl('general')}
          >
            Go to Contact Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
