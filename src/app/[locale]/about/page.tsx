import React from 'react';
import { Card, CardContent } from '@tbi/ui';
import { Button } from '@tbi/ui';
import { Badge } from '@tbi/ui';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@tbi/ui';
import { Input } from '@tbi/ui';
import { Label } from '@tbi/ui';
import { Textarea } from '@tbi/ui';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  Globe, 
  TrendingUp,
  BarChart3,
  Shield,
  Heart,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Search,
  Database,
  Brain,
  PieChart,
  FileText,
  Presentation,
  Star,
  Quote
} from "lucide-react";

interface Props {
  params: Promise<{
    locale: string
  }>
}

const stats = [
  { number: "15+", label: "Years in Business" },
  { number: "2,500+", label: "Reports Published" },
  { number: "10,000+", label: "Clients Served" },
  { number: "50+", label: "Industries Covered" }
];

const methodologies = [
  {
    icon: Search,
    title: "Primary Research",
    description: "Direct data collection through surveys, interviews, focus groups, and observational studies to gather first-hand insights.",
    techniques: ["Consumer Surveys", "In-depth Interviews", "Focus Groups", "Mystery Shopping"]
  },
  {
    icon: Database,
    title: "Secondary Research", 
    description: "Comprehensive analysis of existing data sources, industry reports, and published studies for broader market context.",
    techniques: ["Industry Analysis", "Competitive Intelligence", "Market Sizing", "Trend Analysis"]
  },
  {
    icon: Brain,
    title: "AI & Analytics",
    description: "Advanced machine learning algorithms and predictive modeling to uncover hidden patterns and forecast trends.",
    techniques: ["Predictive Modeling", "Sentiment Analysis", "Pattern Recognition", "Behavioral Analytics"]
  },
  {
    icon: PieChart,
    title: "Mixed Methods",
    description: "Integrated approach combining quantitative and qualitative methodologies for comprehensive market understanding.",
    techniques: ["Triangulation", "Sequential Analysis", "Concurrent Studies", "Meta-Analysis"]
  }
];

const testimonials = [
  {
    quote: "TheBrainyInsights provided us with actionable market intelligence that directly contributed to our 40% revenue growth this year. Their research methodology is unparalleled.",
    author: "Sarah Mitchell",
    title: "Chief Marketing Officer",
    company: "TechVision Corp",
    rating: 5
  },
  {
    quote: "The depth and accuracy of their consumer behavior analysis helped us identify new market segments we never knew existed. Truly transformative insights.",
    author: "Michael Rodriguez",
    title: "VP of Strategy", 
    company: "Global Retail Solutions",
    rating: 5
  },
  {
    quote: "Working with TheBrainyInsights was a game-changer for our product launch strategy. Their predictive analytics were spot-on and saved us millions in potential losses.",
    author: "Emily Chen",
    title: "Product Director",
    company: "Innovation Labs",
    rating: 5
  }
];

const values = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "We serve businesses across the globe, providing them with the insights they need to succeed in international markets."
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Your data is safe with us. We adhere to strict security protocols to protect your information."
  },
  {
    icon: Heart,
    title: "Customer Satisfaction",
    description: "Our goal is to exceed your expectations and provide you with the best possible service."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously innovate to stay ahead of the curve and offer cutting-edge solutions."
  }
];

const clients = [
  { name: "TechVision", industry: "Technology" },
  { name: "GlobalRetail", industry: "Retail" },
  { name: "InnovationLabs", industry: "R&D" },
  { name: "HealthcarePro", industry: "Healthcare" },
  { name: "FinanceGroup", industry: "Financial Services" },
  { name: "StartupSuccess", industry: "Startup" }
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white hover:bg-white/30">
              Leading Market Research Since 2009
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforming Data Into 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                Actionable Insights
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              At TheBrainyInsights, we empower businesses to make informed decisions through comprehensive market research, data analytics, and strategic consulting services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                Our Services <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape how we serve our clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 bg-indigo-600/10 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research Methodology */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Research Methodology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven research methodologies combine traditional techniques with cutting-edge technology to deliver comprehensive market intelligence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {methodologies.map((method, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <method.icon className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 mb-3">Key Techniques:</h4>
                    <div className="flex flex-wrap gap-2">
                      {method.techniques.map((technique, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-indigo-600 border-indigo-600/20">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how TheBrainyInsights has helped businesses across industries achieve remarkable growth through data-driven insights.
            </p>
          </div>
          
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-6 w-max">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="w-96 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, starIndex) => (
                        <Star key={starIndex} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <Quote className="h-8 w-8 text-indigo-600/20 mb-4" />
                    
                    <p className="text-gray-600 leading-relaxed mb-6 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-bold text-gray-900 mb-1">
                        {testimonial.author}
                      </h4>
                      <p className="text-indigo-600 font-medium mb-1">
                        {testimonial.title}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Presentation Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-indigo-600/10 to-indigo-700/10 rounded-2xl p-8">
            <FileText className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Corporate Presentation
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get access to our comprehensive corporate presentation showcasing our capabilities, case studies, and research methodologies.
            </p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  <Presentation className="mr-2 h-5 w-5" />
                  Request Presentation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Corporate Presentation</DialogTitle>
                  <DialogDescription>
                    Please provide your details to receive our corporate presentation package.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Your Company Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" placeholder="Marketing Director" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your specific requirements or areas of interest..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Send Request
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business Strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Partner with TheBrainyInsights to unlock actionable market intelligence that drives growth and competitive advantage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              <TrendingUp className="mr-2 h-5 w-5" />
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <BarChart3 className="mr-2 h-5 w-5" />
              View Sample Reports
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-300" />
                  <span className="text-blue-100">Free Consultation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-300" />
                  <span className="text-blue-100">Custom Solutions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-300" />
                  <span className="text-blue-100">24/7 Support</span>
                </div>
              </div>
              
              <div className="text-blue-100">
                Contact: <span className="text-white font-medium">hello@thebrainyinsights.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
      <Footer />
    </>
  );
}
