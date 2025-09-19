"use client";

import { Card, CardContent } from '@tbi/ui';
import { MapPin, Navigation } from "lucide-react";

export function AddressSection() {
  const handleMapClick = () => {
    // Mock map interaction - in a real app this would open Google Maps or similar
    const address = "450 Lexington Ave, Suite 1200, New York, NY 10017";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Address Information */}
          <div>
            <div className="flex items-center mb-6">
              <MapPin className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Visit Our Office</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">TheBrainyInsights</p>
                <p>450 Lexington Avenue</p>
                <p>Suite 1200</p>
                <p>New York, NY 10017</p>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">Office Hours:</p>
                <p className="text-sm">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleMapClick}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div 
                onClick={handleMapClick}
                className="bg-gray-100 h-64 cursor-pointer relative group transition-all duration-300 hover:bg-gray-200"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-gray-700 font-semibold">Click to Open Map</p>
                    <p className="text-sm text-gray-500 mt-1">450 Lexington Ave, NYC</p>
                  </div>
                </div>
                
                {/* Mock map grid pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-300"></div>
                    ))}
                  </div>
                </div>
                
                {/* Location pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full animate-pulse shadow-lg"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
