"use client";

import { useState } from "react";
import { Button } from '@tbi/ui';
import { Input } from '@tbi/ui';
import { Label } from '@tbi/ui';
import { Textarea } from '@tbi/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tbi/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@tbi/ui';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real application, you would send this to your contact API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Show success message
      alert("Thank you for your inquiry! We'll get back to you within 24 hours.");
    } catch (error) {
      alert("There was an error sending your message. Please try again.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact-form" className="py-20 bg-gray-50">
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
                Contact Our Research Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select the type of research you need" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market-analysis">Market Analysis</SelectItem>
                      <SelectItem value="competitor-research">Competitor Research</SelectItem>
                      <SelectItem value="consumer-insights">Consumer Insights</SelectItem>
                      <SelectItem value="industry-trends">Industry Trends</SelectItem>
                      <SelectItem value="custom-research">Custom Research</SelectItem>
                      <SelectItem value="consultation">General Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Project Details *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                    rows={5}
                    placeholder="Please describe your research needs, timeline, and any specific requirements..."
                    className="bg-white"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
