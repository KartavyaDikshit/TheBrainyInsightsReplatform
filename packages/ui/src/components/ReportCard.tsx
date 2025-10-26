"use client";

import { Star, Calendar, FileText, Download, Eye } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { getCategoryIcon } from "./icons/CategoryIcons";

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

  return (
    <Link href={`/${locale}/reports/${slug}`} className="block h-full">
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-200 bg-white cursor-pointer h-full flex flex-col">
        {/* Category Icon with Gradient Background */}
        <div className="relative w-[90%] mx-auto mt-2 rounded-md overflow-hidden" style={{ aspectRatio: '4/1.2' }}>
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
            {getCategoryIcon(category, "w-10 h-10")}
          </div>
          
          {/* Minimalistic Category Badge */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            <Badge className="bg-white/90 backdrop-blur-sm text-indigo-600 text-[9px] font-medium px-2 py-0.5 border border-indigo-100">
              {category}
            </Badge>
          </div>
        </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[2.5rem]">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[2rem]">
          {description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center mb-3 text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5" />
            <span>{publishDate}</span>
          </div>
        </div>

        {/* Pricing Information */}
        {!isFree && (
          <div className="mb-3 p-2 bg-gray-50 rounded-md">
            <div className="text-[10px] text-gray-500 mb-1">Pricing Options:</div>
            <div className="space-y-0.5 text-[10px]">
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
        <div className="flex gap-2 mt-auto" onClick={(e) => e.preventDefault()}>
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/${locale}/reports/${slug}`;
            }}
          >
            <Eye className="h-3 w-3 mr-1.5" />
            View Report
          </Button>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
