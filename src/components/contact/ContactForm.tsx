"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from '@tbi/ui';
import { Input } from '@tbi/ui';
import { Label } from '@tbi/ui';
import { Textarea } from '@tbi/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@tbi/ui';

// Country data with codes
const countries = [
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "Australia", code: "+61" },
  { name: "India", code: "+91" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Italy", code: "+39" },
  { name: "Spain", code: "+34" },
  { name: "Netherlands", code: "+31" },
  { name: "Belgium", code: "+32" },
  { name: "Switzerland", code: "+41" },
  { name: "Austria", code: "+43" },
  { name: "Sweden", code: "+46" },
  { name: "Norway", code: "+47" },
  { name: "Denmark", code: "+45" },
  { name: "Finland", code: "+358" },
  { name: "Poland", code: "+48" },
  { name: "Ireland", code: "+353" },
  { name: "Portugal", code: "+351" },
  { name: "Greece", code: "+30" },
  { name: "Czech Republic", code: "+420" },
  { name: "Hungary", code: "+36" },
  { name: "Romania", code: "+40" },
  { name: "China", code: "+86" },
  { name: "Japan", code: "+81" },
  { name: "South Korea", code: "+82" },
  { name: "Singapore", code: "+65" },
  { name: "Malaysia", code: "+60" },
  { name: "Thailand", code: "+66" },
  { name: "Indonesia", code: "+62" },
  { name: "Philippines", code: "+63" },
  { name: "Vietnam", code: "+84" },
  { name: "Hong Kong", code: "+852" },
  { name: "Taiwan", code: "+886" },
  { name: "New Zealand", code: "+64" },
  { name: "Brazil", code: "+55" },
  { name: "Mexico", code: "+52" },
  { name: "Argentina", code: "+54" },
  { name: "Chile", code: "+56" },
  { name: "Colombia", code: "+57" },
  { name: "Peru", code: "+51" },
  { name: "South Africa", code: "+27" },
  { name: "Egypt", code: "+20" },
  { name: "Nigeria", code: "+234" },
  { name: "Kenya", code: "+254" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Israel", code: "+972" },
  { name: "Turkey", code: "+90" },
  { name: "Russia", code: "+7" },
  { name: "Ukraine", code: "+380" },
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const requestType = searchParams.get('request');
  const reportTitle = searchParams.get('reportTitle');
  const reportSlug = searchParams.get('reportSlug');
  const formRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    businessEmail: '',
    country: '',
    countryCode: '',
    phoneNumber: '',
    company: '',
    designation: '',
    description: '',
    reportTitle: reportTitle || '',
    reportSlug: reportSlug || ''
  });

  // Get the dynamic heading based on request type
  const getFormHeading = () => {
    switch (requestType) {
      case 'sample-pdf':
        return 'Request Sample PDF';
      case 'customization':
        return 'Request Customization';
      case 'talk-to-analyst':
        return 'Talk to Analyst';
      case 'consultation':
        return 'Schedule Consultation';
      case 'table-of-contents':
        return 'Request Table of Contents';
      default:
        return 'Contact Our Research Team';
    }
  };

  // Auto-scroll to form when arriving from a button click
  useEffect(() => {
    if (requestType && formRef.current) {
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        formRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [requestType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real application, you would send this to your contact API
      const submissionData = {
        ...formData,
        requestType,
        reportTitle: formData.reportTitle,
        reportSlug: formData.reportSlug
      };
      
      console.log('Form submission data:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        fullName: '',
        businessEmail: '',
        country: '',
        countryCode: '',
        phoneNumber: '',
        company: '',
        designation: '',
        description: '',
        reportTitle: reportTitle || '',
        reportSlug: reportSlug || ''
      });
      
      // Show success message
      alert("Thank you for your request! We'll call you back within 24 hours.");
    } catch (error) {
      alert("There was an error sending your message. Please try again.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    setFormData(prev => ({
      ...prev,
      country: countryName,
      countryCode: selectedCountry?.code || ''
    }));
  };

  return (
    <section id="contact-form" className="py-20 bg-gray-50" ref={formRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tell us about your project and we&apos;ll provide you with a customized proposal and timeline.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-600">
                {getFormHeading()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Display report information if available */}
                {reportTitle && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Report:</p>
                    <p className="font-semibold text-gray-900">{reportTitle}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    required
                    className="bg-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => handleChange('businessEmail', e.target.value)}
                    required
                    className="bg-white"
                    placeholder="Enter your business email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={formData.countryCode}
                      disabled
                      className="bg-gray-100 w-20 text-center font-semibold"
                      placeholder="+00"
                    />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      required
                      className="bg-white flex-1"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    required
                    className="bg-white"
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    type="text"
                    value={formData.designation}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    required
                    className="bg-white"
                    placeholder="Enter your job title/designation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    placeholder="Tell us more about your needs..."
                    className="bg-white"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                >
                  Submit Your Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
