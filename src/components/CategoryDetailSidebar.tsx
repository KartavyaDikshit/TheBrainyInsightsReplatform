"use client";

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Textarea } from '@tbi/ui';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: ''
      });
      
      alert("Thank you for your request! We'll call you back within 24 hours.");
      setIsDialogOpen(false);
    } catch (error) {
      alert("There was an error sending your message. Please try again.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Request Callback */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Request Callback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Get personalized insights and custom research solutions from our industry experts.
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" 
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Request Callback
          </Button>
        </CardContent>
      </Card>

      {/* Request Callback Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-indigo-600">
              Request Callback
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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

            <Button 
              type="submit" 
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
            >
              Request Callback
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
