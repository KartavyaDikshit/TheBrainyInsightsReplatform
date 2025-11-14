import React from 'react';
import { Card, CardContent } from '@tbi/ui';
import { Button } from '@tbi/ui';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  Globe, 
  Shield,
  Heart,
  Lightbulb,
  ArrowRight,
  Search,
  Database,
  Brain,
  PieChart,
  Star,
  Quote
} from "lucide-react";

interface Props {
  params: Promise<{
    locale: string
  }>
}

const methodologies = [
  {
    icon: Search,
    title: "Comprehensive Data Procurement",
    description: "We gather reliable market data through primary and secondary sources, including expert interviews, surveys, and trusted databases like Bloomberg, Statista, and Factiva to ensure accurate market insights."
  },
  {
    icon: Database,
    title: "Robust Data Analysis & Synthesis", 
    description: "Our team employs advanced statistical tools and systematic screening, integration, and validation techniques to ensure precision and consistency in every dataset."
  },
  {
    icon: Brain,
    title: "Balanced Qualitative & Quantitative Insights",
    description: "We combine qualitative research (understanding customer behavior and perceptions) with quantitative research (surveys, statistical validation, and trend estimation) for a complete market view."
  },
  {
    icon: PieChart,
    title: "Expert Validation & Forecasting",
    description: "Final insights are validated by CXOs, industry specialists, and key opinion leaders, followed by data interpolation and trend forecasting to deliver accurate, actionable market intelligence."
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
    icon: Shield,
    title: "Integrity & Reliability",
    description: "We are committed to delivering accurate, validated, and dependable data through rigorous quality control and ethical research practices."
  },
  {
    icon: Heart,
    title: "Client-Centric Approach",
    description: "Client satisfaction drives everything we do — from tailored solutions and proactive support to long-term partnerships built on trust and transparency."
  },
  {
    icon: Globe,
    title: "Expertise & Excellence",
    description: "Our experienced analysts and senior researchers personally oversee every project, ensuring insightful analysis and consistent high-quality outcomes."
  },
  {
    icon: Lightbulb,
    title: "Innovation & Agility",
    description: "We continuously track global market trends, adapt swiftly to industry dynamics, and ensure fast, efficient project delivery without compromising quality."
  }
];

const clients = [
  { name: "TechVision Corp", logo: "TV", industry: "Technology" },
  { name: "GlobalRetail Solutions", logo: "GR", industry: "Retail" },
  { name: "Innovation Labs", logo: "IL", industry: "R&D" },
  { name: "HealthcarePro", logo: "HP", industry: "Healthcare" },
  { name: "FinanceGroup International", logo: "FG", industry: "Financial Services" },
  { name: "StartupSuccess", logo: "SS", industry: "Startup" },
  { name: "Energy Dynamics", logo: "ED", industry: "Energy" },
  { name: "AutoTech Industries", logo: "AT", industry: "Automotive" },
  { name: "Pharma Innovations", logo: "PI", industry: "Pharmaceutical" },
  { name: "Digital Marketing Pro", logo: "DM", industry: "Marketing" },
  { name: "Manufacturing Elite", logo: "ME", industry: "Manufacturing" },
  { name: "Food & Beverage Co", logo: "FB", industry: "Food & Beverage" }
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
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <method.icon className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by industry leaders worldwide for data-driven insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 min-h-[220px]">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-3 h-full flex flex-col">
                  <div className="mb-2">
                    <Quote className="h-4 w-4 text-indigo-600 opacity-20" />
                  </div>

                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-2.5 w-2.5 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-gray-700 mb-3 flex-grow leading-relaxed text-xs">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center mt-auto">
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-[10px]">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="ml-2">
                      <p className="text-[10px] font-semibold text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-[10px] text-gray-600">
                        {testimonial.title}
                      </p>
                      <p className="text-[10px] text-indigo-600 font-medium">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients Section - Horizontal Cycling */}
      <section className="py-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Trusted by Industry Leaders
            </h2>
          </div>

          {/* Horizontal Scrolling Clients */}
          <div className="relative">
            <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
              <div className="flex gap-6 w-max">
                {clients.map((client, index) => (
                  <div key={index} className="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 min-w-[140px]">
                    <div className="w-12 h-12 mb-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{client.logo}</span>
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900 text-center">
                      {client.name}
                    </h3>
                  </div>
                ))}
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
