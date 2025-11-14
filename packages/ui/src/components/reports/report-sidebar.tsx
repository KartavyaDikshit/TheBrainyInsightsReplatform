"use client";

import { useState } from "react";
import { CreditCard, Download, FileText, Calendar, Phone, DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

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
  // State for selected license type
  const [selectedLicense, setSelectedLicense] = useState<'singleUser' | 'multiUser' | 'corporate'>('multiUser');
  
  // Helper function to build contact URL with report information
  const buildContactUrl = (requestType: string) => {
    const params = new URLSearchParams({ request: requestType });
    if (reportTitle) params.append('reportTitle', reportTitle);
    if (reportSlug) params.append('reportSlug', reportSlug);
    return `/${locale}/contact?${params.toString()}`;
  };
  
  // Get selected license price
  const getSelectedPrice = () => {
    if (!pricing) return 0;
    switch (selectedLicense) {
      case 'singleUser':
        return pricing.singleUser;
      case 'multiUser':
        return pricing.multiUser;
      case 'corporate':
        return pricing.corporate;
      default:
        return pricing.singleUser;
    }
  };
  return (
    <div className="w-80 sticky top-[58px] space-y-6">
      {/* Pricing Section */}
      {pricing && (
        <Card>
          <CardHeader className="!pt-4 !pb-2">
            <CardTitle className="text-lg">Choose Your License</CardTitle>
          </CardHeader>
          <CardContent className="!pt-2 !pb-4 space-y-3">
            <RadioGroup 
              value={selectedLicense} 
              onValueChange={(value) => setSelectedLicense(value as 'singleUser' | 'multiUser' | 'corporate')}
              className="space-y-2"
            >
              {/* Single User */}
              <div className="flex items-center space-x-3 p-2 border rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
                <RadioGroupItem value="singleUser" id="singleUser" />
                <Label htmlFor="singleUser" className="flex-1 flex justify-between items-center cursor-pointer">
                  <span className="font-medium">Single User</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {pricing.currency || '$'}{pricing.singleUser.toLocaleString()}
                  </span>
                </Label>
              </div>

              {/* Multi-User */}
              <div className="flex items-center space-x-3 p-2 border rounded-lg hover:border-indigo-500 transition-colors cursor-pointer bg-indigo-50/50">
                <RadioGroupItem value="multiUser" id="multiUser" />
                <Label htmlFor="multiUser" className="flex-1 flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Multi-User</span>
                    <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                  </div>
                  <span className="text-lg font-bold text-indigo-600">
                    {pricing.currency || '$'}{pricing.multiUser.toLocaleString()}
                  </span>
                </Label>
              </div>

              {/* Corporate */}
              <div className="flex items-center space-x-3 p-2 border rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
                <RadioGroupItem value="corporate" id="corporate" />
                <Label htmlFor="corporate" className="flex-1 flex justify-between items-center cursor-pointer">
                  <span className="font-medium">Corporate</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {pricing.currency || '$'}{pricing.corporate.toLocaleString()}
                  </span>
                </Label>
              </div>
            </RadioGroup>

            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all text-lg py-6"
              onClick={() => window.location.href = buildContactUrl('quote')}
            >
              Buy Now - {pricing.currency || '$'}{getSelectedPrice().toLocaleString()}
            </Button>

            <div className="flex items-center justify-center gap-2 pt-3">
              <CreditCard className="h-3 w-3 text-gray-400" />
              <div className="text-xs text-gray-400">
                Visa, Mastercard, PayPal
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent className="!pt-4 !pb-4 space-y-2">
          <Button 
            className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm h-9 transition-all"
            onClick={() => window.location.href = buildContactUrl('sample-pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Request Sample PDF
          </Button>
          <Button 
            className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm h-9 transition-all"
            onClick={() => window.location.href = buildContactUrl('customization')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Request Customization
          </Button>
          <Button 
            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm h-9 transition-all"
            onClick={() => window.location.href = buildContactUrl('talk-to-analyst')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Talk to Analyst
          </Button>
          <Button 
            className="w-full justify-start bg-green-600 hover:bg-green-700 text-white font-medium text-sm h-9 transition-all"
            onClick={() => window.location.href = buildContactUrl('consultation')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Consultation
          </Button>
          <Button 
            className="w-full justify-start bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm h-9 transition-all"
            onClick={() => window.location.href = buildContactUrl('custom-pricing')}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Custom Pricing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
