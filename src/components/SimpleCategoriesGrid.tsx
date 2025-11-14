"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@tbi/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@tbi/ui";
import { Input } from "@tbi/ui";
import { Label } from "@tbi/ui";
import { Textarea } from "@tbi/ui";
import { Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });

  // Filter categories based on search
  const filteredCategories = categories.filter(category => {
    const matchesSearch = searchTerm === "" || 
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
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
    <>
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore comprehensive market research across all major industries and sectors
          </p>
        </div>

        {/* Gradient Container wrapping the Categories Grid */}
        <div className="bg-indigo-600/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/30 shadow-lg mb-12">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-white border-gray-300"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/categories/${category.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="mb-3 text-indigo-600">
                  {getCategoryIcon(category.title, "w-12 h-12")}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>

          {/* No Results Message */}
          {filteredCategories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No categories found matching your search</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            </div>
          )}
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
      </div>
    </section>

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
    </>
  );
}
