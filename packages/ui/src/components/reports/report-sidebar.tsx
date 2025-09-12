import { Eye, Download, MessageCircle, Calendar, CreditCard, Phone, HelpCircle, Star, Globe, Clock, FileText, Users, Building } from "lucide-react";
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
  reportDetails?: {
    pages?: number;
    published?: string;
    coverage?: string;
    format?: string;
    industryTags?: string[];
    languages?: string[];
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
}

export function ReportSidebar({
  reportPreview,
  pricing,
  reportDetails,
  quickActions = [],
  contactInfo
}: ReportSidebarProps) {
  return (
    <div className="w-80 space-y-6">
      {/* Report Preview */}
      {reportPreview && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Report Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative group cursor-pointer">
              <img
                src={reportPreview.image}
                alt={reportPreview.alt}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Eye className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">View Full Report</p>
                </div>
              </div>
              {reportPreview.sampleAvailable && (
                <Badge className="absolute top-3 left-3 bg-green-500">
                  Sample PDF Available
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Sample
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
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
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
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
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
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
      {quickActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="w-full justify-start"
                onClick={action.onClick}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Report Details */}
      {reportDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {reportDetails.pages && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Pages
                  </span>
                  <span className="font-medium">{reportDetails.pages}</span>
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
            </div>

            {reportDetails.industryTags && reportDetails.industryTags.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Industry Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {reportDetails.industryTags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {reportDetails.languages && reportDetails.languages.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Languages</h4>
                <div className="flex gap-2">
                  {reportDetails.languages.map((lang, index) => (
                    <Badge 
                      key={index} 
                      variant={index === 0 ? "secondary" : "outline"}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contact & Support */}
      {contactInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-indigo-600" />
                  <div>
                    <p className="font-medium">{contactInfo.phone}</p>
                    {contactInfo.hours && (
                      <p className="text-sm text-muted-foreground">{contactInfo.hours}</p>
                    )}
                  </div>
                </div>
              )}
              {contactInfo.liveChat && (
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Available now
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
