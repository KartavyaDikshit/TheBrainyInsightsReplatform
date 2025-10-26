"use client";

import { Card, CardContent } from '@tbi/ui';
import { Button } from '@tbi/ui';
import { Phone, Mail } from "lucide-react";

export function ContactMethods() {

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Multiple Ways to Reach Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the communication method that works best for you. Our team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Phone Contact */}
          <Card className="text-center group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-700 transition-colors duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Phone Support
              </h3>
              <p className="text-gray-600 mb-6">
                Speak directly with our research consultants for immediate assistance and project discussions.
              </p>
              <div className="space-y-2 mb-6">
                <p className="font-semibold text-indigo-600">+1 (212) 555-0123</p>
                <p className="text-sm text-gray-500">Monday - Friday, 9 AM - 6 PM EST</p>
              </div>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => window.location.href = 'tel:+12125550123'}
              >
                Call Now
              </Button>
            </CardContent>
          </Card>

          {/* Email Contact */}
          <Card className="text-center group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-700 transition-colors duration-300">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Email Us
              </h3>
              <p className="text-gray-600 mb-6">
                Send us detailed information about your project requirements and we&apos;ll respond within 24 hours.
              </p>
              <div className="space-y-2 mb-6">
                <p className="font-semibold text-indigo-600">hello@thebrainyinsights.com</p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => window.location.href = 'mailto:hello@thebrainyinsights.com'}
              >
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
