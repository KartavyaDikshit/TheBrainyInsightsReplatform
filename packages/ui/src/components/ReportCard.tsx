"use client";

import { useState } from "react";
import { Star, Calendar, FileText, Download, Eye } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  publishDate: string;
  pages: number;
  rating: number;
  priceInfo: {
    singleUser: string;
    multiUser: string;
    corporate: string;
  };
  badges: string[];
  isFree?: boolean;
  slug: string;
  locale: string;
}

export function ReportCard({
  title,
  description,
  category,
  coverImage,
  publishDate,
  pages,
  rating,
  priceInfo,
  badges,
  isFree = false,
  slug,
  locale
}: ReportCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link href={`/${locale}/reports/${slug}`} className="block">
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-200 bg-white cursor-pointer">
        {/* Cover Image with Overlay Badges */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={coverImage}
          alt={title}
          fill
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <Badge className="bg-indigo-600 text-white text-xs font-medium">
            {category}
          </Badge>
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-white/90 text-gray-900 text-xs font-medium"
            >
              {badge}
            </Badge>
          ))}
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          {isFree ? (
            <Badge className="bg-green-500 text-white text-xs font-medium">
              FREE
            </Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium">
              From {priceInfo.singleUser}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{pages} pages</span>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs ml-1">({rating})</span>
          </div>
        </div>

        {/* Pricing Information */}
        {!isFree && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Pricing Options:</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Single User:</span>
                <span className="font-medium text-gray-900">{priceInfo.singleUser}</span>
              </div>
              <div className="flex justify-between">
                <span>Multi User:</span>
                <span className="font-medium text-gray-900">{priceInfo.multiUser}</span>
              </div>
              <div className="flex justify-between">
                <span>Corporate:</span>
                <span className="font-medium text-gray-900">{priceInfo.corporate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
          <Button 
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/${locale}/reports/${slug}`;
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Report
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
            onClick={(e) => {
              e.stopPropagation();
              // Handle sample download
              console.log('Download sample for:', title);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Sample
          </Button>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
