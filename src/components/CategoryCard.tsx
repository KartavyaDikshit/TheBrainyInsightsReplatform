"use client";

import { Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ImageWithFallback";
import Link from "next/link";

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  icon?: string;
  reportCount: number;
  viewCount: number;
  isFeatured?: boolean;
  industry?: string;
  slug: string;
  locale?: string;
}

export function CategoryCard({
  title,
  description,
  icon,
  reportCount,
  viewCount,
  isFeatured = false,
  industry,
  slug,
  locale = "en",
}: CategoryCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-indigo-300 cursor-pointer">
      <CardContent className="p-6">
        {/* Category Icon */}
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 p-3 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors">
            {icon ? (
              <ImageWithFallback
                src={icon}
                alt={`${title} icon`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {isFeatured && (
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Category Content */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            {industry && (
              <Badge variant="secondary" className="text-xs">
                {industry}
              </Badge>
            )}
          </div>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {description}
          </p>
        </div>


        {/* Action Button */}
        <Link href={`/${locale}/category/${slug}`}>
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white group-hover:shadow-lg transition-all">
            View All Reports
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
