"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from '@tbi/ui';
import { Input } from '@tbi/ui';
import { Label } from '@tbi/ui';
import { Textarea } from '@tbi/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@tbi/ui';
import { Search, X } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  slug: string;
  category: string;
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const requestType = searchParams.get('request');
  const reportTitle = searchParams.get('reportTitle');
  const reportSlug = searchParams.get('reportSlug');
  const formRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    reportTitle: reportTitle || '',
    reportSlug: reportSlug || '',
    additionalReportId: ''
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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

  // Fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoadingReports(true);
      try {
        const response = await fetch('/api/reports?locale=en&limit=100');
        const data = await response.json();
        if (data.success) {
          setReports(data.reports);
          setFilteredReports(data.reports);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoadingReports(false);
      }
    };
    
    fetchReports();
  }, []);

  // Filter reports based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = reports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
    } else {
      setFilteredReports(reports);
    }
  }, [searchTerm, reports]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      // Include report information in the submission
      const additionalReport = formData.additionalReportId 
        ? reports.find(r => r.id === formData.additionalReportId)
        : null;

      const submissionData = {
        ...formData,
        requestType,
        reportTitle: formData.reportTitle,
        reportSlug: formData.reportSlug,
        additionalReport: additionalReport ? {
          id: additionalReport.id,
          title: additionalReport.title,
          slug: additionalReport.slug,
          category: additionalReport.category
        } : null
      };
      
      console.log('Form submission data:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
        reportTitle: reportTitle || '',
        reportSlug: reportSlug || '',
        additionalReportId: ''
      });
      setSearchTerm('');
      
      // Show success message
      alert("Thank you for your request! We'll call you back within 24 hours.");
    } catch (error) {
      alert("There was an error sending your message. Please try again.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="bg-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="bg-white"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                    className="bg-white"
                    placeholder="Enter your phone number"
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

                {/* Optional: Add Another Report */}
                <div className="space-y-2" ref={dropdownRef}>
                  <Label htmlFor="additionalReport">
                    Additional Report of Interest (Optional)
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Search and select another report you&apos;re interested in
                  </p>
                  
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="reportSearch"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Search for a report..."
                      className="bg-white pl-10 pr-10"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setFormData(prev => ({ ...prev, additionalReportId: '' }));
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Results */}
                  {showDropdown && filteredReports.length > 0 && (
                    <div className="relative">
                      <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                        {isLoadingReports ? (
                          <div className="p-4 text-center text-gray-500">
                            Loading reports...
                          </div>
                        ) : filteredReports.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No reports found
                          </div>
                        ) : (
                          filteredReports.slice(0, 10).map((report) => (
                            <button
                              key={report.id}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  additionalReportId: report.id 
                                }));
                                setSearchTerm(report.title);
                                setShowDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="font-medium text-gray-900">
                                {report.title}
                              </div>
                              {report.category && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {report.category}
                                </div>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selected Report Display */}
                  {formData.additionalReportId && searchTerm && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-green-800 font-medium">
                          Selected: {searchTerm}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setFormData(prev => ({ ...prev, additionalReportId: '' }));
                        }}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                >
                  Request Callback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
