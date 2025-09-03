"use client";

import { useState } from 'react';
import { Eye, Download, Heart, Share2, Calendar, FileText, MapPin, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter } from './ui/card';
import { ImageWithFallback } from './ImageWithFallback';
import Link from 'next/link';

interface CategoryReportCardProps {
  id: string;
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  publicationDate?: Date | string;
  pageCount?: number;
  singlePrice?: number;
  multiPrice?: number;
  corporatePrice?: number;
  downloadCount?: number;
  viewCount?: number;
  tags?: string[];
  geography?: string;
  reportType?: string;
  isNew?: boolean;
  isTrending?: boolean;
  locale?: string;
}

export function CategoryReportCard({
  id,
  title,
  description,
  slug,
  coverImage,
  publicationDate,
  pageCount,
  singlePrice,
  multiPrice,
  corporatePrice,
  downloadCount,
  viewCount,
  tags = [],
  geography,
  reportType,
  isNew,
  isTrending,
  locale = 'en'
}: CategoryReportCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formattedDate = publicationDate 
    ? new Date(publicationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Cover Image */}
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
          <ImageWithFallback
            src={coverImage || "https://images.unsplash.com/photo-1586864387507-c7761c02bc37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHJlcG9ydCUyMGNvdmVyJTIwZG9jdW1lbnRzfGVufDF8fHx8MTc1Njg3NjUxM3ww&ixlib=rb-4.1.0&q=80&w=1080"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay with badges */}
          <div className="absolute top-2 left-2 flex space-x-1">
            {isNew && <Badge className="bg-green-500 text-white">New</Badge>}
            {isTrending && <Badge className="bg-orange-500 text-white">Trending</Badge>}
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-2 right-2 flex space-x-1 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                // Handle share functionality
              }}
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Report Type & Geography */}
        <div className="flex items-center justify-between mb-2">
          {reportType && (
            <Badge variant="outline" className="text-xs">
              {reportType}
            </Badge>
          )}
          {geography && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {geography}
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`/${locale}/report/${slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            {formattedDate && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formattedDate}
              </div>
            )}
            {pageCount && (
              <div className="flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                {pageCount} pages
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {viewCount && (
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {viewCount.toLocaleString()}
              </div>
            )}
            {downloadCount && (
              <div className="flex items-center">
                <Download className="h-3 w-3 mr-1" />
                {downloadCount.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="space-y-2">
          {singlePrice && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Single User</span>
              <span className="font-semibold text-gray-900">${singlePrice.toLocaleString()}</span>
            </div>
          )}
          {multiPrice && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Multi User</span>
              <span className="font-semibold text-gray-900">${multiPrice.toLocaleString()}</span>
            </div>
          )}
          {corporatePrice && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Corporate</span>
              <span className="font-semibold text-gray-900">${corporatePrice.toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          <Button variant="outline" className="flex-1" size="sm">
            View Sample
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" 
            size="sm"
          >
            Buy Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
