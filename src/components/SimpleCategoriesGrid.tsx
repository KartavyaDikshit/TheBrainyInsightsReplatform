"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@tbi/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@tbi/ui";
import { Input } from "@tbi/ui";
import { Label } from "@tbi/ui";
import { Textarea } from "@tbi/ui";
import { getCategoryIcon } from "./icons/CategoryIcons";

interface CategoryData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  reportCount: number;
  viewCount: number;
  isFeatured: boolean;
  industry?: string;
  slug: string;
}

interface SimpleCategoriesGridProps {
  categories: CategoryData[];
  locale: string;
}

export function SimpleCategoriesGrid({ categories, locale }: SimpleCategoriesGridProps) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Categories</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore comprehensive market research across all major industries and sectors
        </p>
      </div>

      {/* Categories Container */}
      <div className="p-6 mb-12 border border-black/30 rounded-lg" style={{ backgroundColor: '#303F9F' }}>
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/categories/${category.slug}`}
              className="group block bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-black/20"
            >
              <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors duration-300">
                <div className="text-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                  {getCategoryIcon(category.title, "w-16 h-16")}
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                    {category.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                    {category.industry}
                  </span>
                  <div className="flex items-center text-indigo-600 text-xs font-medium group-hover:text-indigo-700">
                    Explore
                    <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Request Custom Report Button Section */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Need a Custom Report?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Request a customized market research report tailored to your specific needs.
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
          >
            Request Customised Report
          </Button>
        </div>
      </div>

      {/* Custom Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-indigo-600">
              Request Custom Report
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
