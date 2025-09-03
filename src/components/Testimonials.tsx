"use client";

import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  avatar?: string;
  rating: number;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    position: "Senior Market Analyst",
    company: "TechVenture Capital",
    rating: 5,
    content: "TheBrainyInsights has been instrumental in our investment decisions. Their comprehensive market research reports provide the depth and accuracy we need."
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    position: "Strategy Director",
    company: "Global Manufacturing Inc.",
    rating: 5,
    content: "The quality of research and the speed of delivery are exceptional. We've been able to enter three new markets successfully using their insights."
  },
  {
    id: 3,
    name: "Emma Thompson",
    position: "Chief Innovation Officer",
    company: "HealthTech Solutions",
    rating: 5,
    content: "What sets TheBrainyInsights apart is their forward-looking analysis. Their reports helped us pivot our strategy and increase market share by 40%."
  },
  {
    id: 4,
    name: "David Kim",
    position: "Business Development Manager",
    company: "Energy Dynamics Corp",
    rating: 5,
    content: "The renewable energy market reports have been game-changers for our business planning. The data accuracy and projections exceed expectations."
  },
  {
    id: 5,
    name: "Lisa Anderson",
    position: "VP of Marketing",
    company: "Consumer Brands Ltd",
    rating: 5,
    content: "Their consumer behavior insights and retail analysis have transformed our go-to-market strategies. The ROI on these reports has been remarkable."
  },
  {
    id: 6,
    name: "James Wilson",
    position: "Financial Analyst",
    company: "Investment Partners LLC",
    rating: 5,
    content: "The financial sector reports provide comprehensive analysis that our clients rely on. The market forecasts and competitive landscape analysis are invaluable."
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-cycle through testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 3 >= testimonials.length ? 0 : prevIndex + 3
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= testimonials.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.floor((testimonials.length - 1) / 3) * 3 : prevIndex - 3
    );
  };

  const currentTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Made Smaller */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            What Our Clients Say
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Trusted by industry leaders worldwide for data-driven insights.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-center items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              className="mr-4 hover:bg-indigo-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 3)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / 3) === index 
                      ? 'bg-indigo-600' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              className="ml-4 hover:bg-indigo-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Testimonials Grid - Always 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px]">
            {currentTestimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id} 
                className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-4 h-full flex flex-col">
                  {/* Quote Icon */}
                  <div className="mb-3">
                    <Quote className="h-6 w-6 text-indigo-600 opacity-20" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-gray-700 mb-4 flex-grow leading-relaxed text-sm">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center mt-auto">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {testimonial.position}
                      </p>
                      <p className="text-xs text-indigo-600 font-medium">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators - Made Smaller */}
        <div className="text-center mt-8">
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-indigo-600">500+</div>
              <div className="text-xs text-gray-600">Clients</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-indigo-600">98%</div>
              <div className="text-xs text-gray-600">Satisfaction</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-indigo-600">24/7</div>
              <div className="text-xs text-gray-600">Support</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-indigo-600">200+</div>
              <div className="text-xs text-gray-600">Industries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
