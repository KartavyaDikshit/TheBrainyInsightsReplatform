"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Star, Building, TrendingUp, BarChart3, Eye, MessageCircle, Settings, Phone, FileText } from "lucide-react";

// Icon lookup for dynamic rendering
const iconMap = {
  TrendingUp,
  BarChart3, 
  Building,
};
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";

interface TableOfContentsItem {
  chapter: string;
  title: string;
  pages: string;
  subsections: string[];
}

interface RelatedReport {
  title: string;
  price: string;
  pages: string;
  image: string;
  slug?: string;
}

interface Review {
  rating: number;
  text: string;
  author: string;
  company: string;
  logo: string;
}

interface KeyMetric {
  label: string;
  value: string;
  description: string;
  iconName: string;
  color: string;
}

interface ReportContentProps {
  tableOfContents?: TableOfContentsItem[];
  keyMetrics?: KeyMetric[];
  relatedReports?: RelatedReport[];
  reviews?: Review[];
  keyFindings?: string[];
  methodology?: string;
  sampleImages?: Array<{
    title: string;
    image: string;
    alt: string;
  }>;
  onRequestSample?: () => void;
  onRequestQuote?: () => void;
  onRequestTableOfContents?: () => void;
  // NEW: Add optional preview data prop
  previewData?: ReportPreviewData;
  // Dynamic text-based preview
  reportSummaryText?: string;
}

// ============================================================================
// DATABASE-READY TYPES - This structure will come from your database later
// ============================================================================

type SectionType = 
  | 'summary' 
  | 'recent_development' 
  | 'driver' 
  | 'restraint' 
  | 'opportunity' 
  | 'challenge' 
  | 'regional' 
  | 'segment' 
  | 'companies';

interface PreviewSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  highlight?: string;
  subsections?: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
}

interface ReportPreviewData {
  reportTitle?: string;
  marketMetrics?: {
    marketSize2024?: string;
    marketSize2034?: string;
    cagr?: string;
  };
  sections?: PreviewSection[];
  keyPlayers?: string[];
}

// ============================================================================
// SAMPLE DATA - Replace this with database query later
// ============================================================================

const DEFAULT_PREVIEW_DATA: ReportPreviewData = {
  reportTitle: "Medical Isotopes Market Report",
  marketMetrics: {
    marketSize2024: "$5.80B",
    marketSize2034: "$11.95B",
    cagr: "7.50%"
  },
  sections: [
    {
      id: "summary-1",
      type: "summary",
      title: "Report Summary",
      highlight: "CAGR - 7.50% | Market Size - USD 5.80 billion (2024)",
      content: "The global Medical Isotopes market was valued at <strong class='text-indigo-700'>USD 5.80 billion in 2024</strong> and growing at a CAGR of <strong class='text-green-700'>7.50%</strong> from 2025 to 2034. The market is expected to reach <strong class='text-indigo-700'>USD 11.95 billion by 2034</strong>. Due to the increasing cases of cancer, neurological disorders and cardiovascular diseases, the demand for medical isotopes is increasing, which will also lead to market growth. Apart from this, the increasing population of elderly people is rapidly affected by chronic diseases, making it crucial to diagnose them promptly."
    },
    {
      id: "dev-1",
      type: "recent_development",
      title: "Recent Development",
      content: "<strong class='text-blue-800'>October 22, 2024:</strong> NorthStar Medical Radioisotopes, LLC hosted an opening event at their state-of-the-art <strong>NorthStar Dose Manufacturing Center in Beloit, Wisconsin</strong>. This facility produces important medical radioisotopes, including <span class='font-mono text-blue-700'>Ac-225, Lu-177, Cu-64, Cu-67, and In-111</span>, providing customized solutions for biopharmaceutical and pharmaceutical companies."
    },
    {
      id: "driver-1",
      type: "driver",
      title: "Drivers",
      content: "<strong>Rising Chronic Disease and Ageing Population:</strong> The growing population often requires healthcare services as aging body functions decline. Isotopes enable accurate early-stage diagnosis, allowing treatment to commence at the optimal time. The accuracy of these isotopes is high, enabling precise results for cardiovascular diseases and other conditions."
    },
    {
      id: "restraint-1",
      type: "restraint",
      title: "Restraints",
      content: "<strong>Short Half-Life of Isotopes:</strong> The short lifespan impacts market growth negatively, reducing diagnostic accuracy and causing delays in treatment. Specialized packaging and same-day delivery increase transportation costs. Weather or political events can delay delivery, making isotopes unusable due to decreased potency."
    },
    {
      id: "opportunity-1",
      type: "opportunity",
      title: "Opportunities",
      content: "<strong>Development of Nuclear Medicine Infrastructure:</strong> Local manufacturing is an efficient way to address the short lifespan problem. This can reduce extra diagnostic costs for patients and accelerate the diagnosis process, allowing more patients to benefit from medical isotopes."
    },
    {
      id: "challenge-1",
      type: "challenge",
      title: "Challenges",
      content: "<strong>Competition from Alternative Imaging Modalities:</strong> CT scans, ultrasound, and MRI pose challenges. These technologies are readily available at affordable prices. MRI and ultrasound are non-radioactive, meaning no harm to patients, which is why doctors prefer these diagnostic methods."
    },
    {
      id: "regional-1",
      type: "regional",
      title: "Regional Analysis",
      highlight: "North America - 48% Market Share (2024)",
      content: "North America emerged as the <strong>largest market</strong> with strong healthcare infrastructure and continuous R&D investment. Large companies continuously develop new medicines and diagnostic methods. The government ensures a strategic roadmap for medical isotopes development, including market growth and supply security."
    },
    {
      id: "segment-1",
      type: "segment",
      title: "Segment Analysis",
      content: "",
      subsections: [
        {
          label: "Type: Radioisotopes",
          value: "65%",
          description: "Used in both diagnostic imaging and therapeutic applications with precision in killing cancer cells."
        },
        {
          label: "Production: Nuclear Reactors",
          value: "58%",
          description: "Enables large-scale production and maintains consistent supply with hospital compatibility."
        },
        {
          label: "Application: Diagnostic",
          value: "59%",
          description: "High accuracy and non-invasive nature enables early disease diagnosis and treatment initiation."
        },
        {
          label: "End-User: Hospitals",
          value: "45%",
          description: "Patient volume and infrastructure facilitate consistent revenue generation and overcome short shelf-life concerns."
        }
      ]
    }
  ],
  keyPlayers: [
    "NorthStar Medical Radioisotopes",
    "TerraPower Isotopes",
    "Shine Technologies",
    "GE Healthcare",
    "Nordion Inc",
    "Jubilant Radiopharma",
    "Lantheus",
    "Eckert & Ziegler",
    "ASP Isotopes"
  ]
};

// ============================================================================
// TEXT PARSER - Parses raw text into structured sections
// ============================================================================

interface ParsedSection {
  id: string;
  title: string;
  content: string;
  type: 'summary' | 'highlight' | 'section' | 'subsection' | 'list' | 'group';
  highlight?: string;
  items?: string[];
  subtitle?: string; // For content with prefix like "Rising Chronic Disease - content"
}

function parseReportSummaryText(text: string): ParsedSection[] {
  if (!text) return [];
  
  const sections: ParsedSection[] = [];
  const lines = text.split('\n');
  
  let currentSection: ParsedSection | null = null;
  let sectionCounter = 0;
  
  // Lines to skip (CTAs, URLs, standalone numbers)
  const skipPatterns = [
    /requesting a free sample/i,
    /www\./i,
    /^Check the geographical/i,
    /^Get an overview/i,
    /^[\d\s]+$/  // Lines with only numbers and spaces
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and promotional content
    if (!line || skipPatterns.some(pattern => pattern.test(line))) continue;
    
    // Detect "Market Dynamics" as a group header (just visual separator, no container)
    if (line.match(/^Market Dynamics$/i)) {
      if (currentSection && (currentSection.content || (currentSection.items && currentSection.items.length > 0))) {
        sections.push(currentSection);
      }
      currentSection = null;
      sections.push({
        id: `group-${sectionCounter++}`,
        title: line,
        content: '',
        type: 'group'
      });
      continue;
    }
    
    // Detect "Segment Analysis" as a group header
    if (line.match(/^Segment Analysis$/i)) {
      if (currentSection && (currentSection.content || (currentSection.items && currentSection.items.length > 0))) {
        sections.push(currentSection);
      }
      currentSection = null;
      sections.push({
        id: `group-${sectionCounter++}`,
        title: line,
        content: '',
        type: 'group'
      });
      continue;
    }
    
    // Detect section headers
    const isHeader = line.match(/^(Report [Ss]ummary|Recent Development|Drivers?|Restraints?|Opportunities|Challenges?|Regional segmentation analysis|Type Segment Analysis|Production Method Segment Analysis|Application Segment Analysis|End-User Segment Analysis|Some of the Key Market Players)$/i);
    
    if (isHeader) {
      // Save previous section if it has content
      if (currentSection && (currentSection.content || (currentSection.items && currentSection.items.length > 0))) {
        sections.push(currentSection);
      }
      
      // Determine section type
      let type: ParsedSection['type'] = 'section';
      if (line.match(/^Report [Ss]ummary/i)) {
        type = 'summary';
      } else if (line.match(/^(Drivers?|Restraints?|Opportunities|Challenges?)$/i)) {
        type = 'subsection';
      } else if (line.match(/Key Market Players/i)) {
        type = 'list';
      }
      
      currentSection = {
        id: `section-${sectionCounter++}`,
        title: line,
        content: '',
        type: type
      };
    } else if (line.startsWith('*')) {
      // List item
      if (currentSection) {
        if (!currentSection.items) currentSection.items = [];
        currentSection.items.push(line.replace(/^\*\s*/, ''));
      } else {
        // Start a new list section if no current section
        currentSection = {
          id: `section-${sectionCounter++}`,
          title: 'Items',
          content: '',
          type: 'list',
          items: [line.replace(/^\*\s*/, '')]
        };
      }
    } else if (line.match(/CAGR.*market size.*USD/i)) {
      // Highlight metrics line
      if (currentSection && currentSection.content) {
        sections.push(currentSection);
        currentSection = null;
      } else {
        // If current section has no content, discard it
        currentSection = null;
      }
      sections.push({
        id: `highlight-${sectionCounter++}`,
        title: '',
        content: '',
        type: 'highlight',
        highlight: line
      });
    } else {
      // Regular content line
      // Check if it has a subtitle pattern (e.g., "Rising Chronic Disease - content")
      const subtitleMatch = line.match(/^([^-]+)\s*[-–—]\s*(.+)$/);
      
      if (subtitleMatch && currentSection && currentSection.type === 'subsection' && !currentSection.content) {
        // This is the first content line with a subtitle
        currentSection.subtitle = subtitleMatch[1].trim();
        currentSection.content = subtitleMatch[2].trim();
      } else if (currentSection) {
        // Append to existing content
        currentSection.content += (currentSection.content ? ' ' : '') + line;
      } else {
        // Orphan content - create a section for it
        currentSection = {
          id: `section-${sectionCounter++}`,
          title: '',
          content: line,
          type: 'section'
        };
      }
    }
  }
  
  // Add last section if it has content
  if (currentSection && (currentSection.content || (currentSection.items && currentSection.items.length > 0))) {
    sections.push(currentSection);
  }
  
  return sections;
}

// ============================================================================
// DYNAMIC SECTION RENDERER - Renders parsed text sections
// ============================================================================

const DynamicSectionRenderer = ({ section, reportTitle }: { section: ParsedSection; reportTitle?: string }) => {
  // Group headers - just titles without containers
  if (section.type === 'group') {
    return (
      <div className="mt-6 mb-3">
        <h3 className="font-bold text-xl text-gray-900 border-b-2 border-indigo-200 pb-2">
          {section.title}
        </h3>
      </div>
    );
  }
  
  // Summary section
  if (section.type === 'summary') {
    return (
      <div>
        <h4 className="font-bold text-lg text-gray-900 mb-3">{section.title}</h4>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100 shadow-sm">
          <p className="text-base text-gray-700 leading-relaxed">{section.content}</p>
        </div>
      </div>
    );
  }
  
  // Highlight metrics - Parse CAGR and Market Size into separate boxes
  if (section.type === 'highlight') {
    // Parse CAGR and Market Size from the highlight text
    const highlightText = section.highlight || '';
    const cagrMatch = highlightText.match(/CAGR\s*[-–—]\s*([\d.]+%)/i);
    const marketSizeMatch = highlightText.match(/market size\s*[-–—]?\s*USD\s*([\d.]+\s*billion)/i);
    
    const cagrValue = cagrMatch ? cagrMatch[1] : null;
    const marketSizeValue = marketSizeMatch ? `USD ${marketSizeMatch[1]}` : null;
    
    // If we successfully parsed both values, show them in separate boxes
    if (cagrValue && marketSizeValue) {
      return (
        <div className="space-y-4">
          {reportTitle && (
            <h3 className="font-bold text-2xl text-gray-900">
              {reportTitle}
            </h3>
          )}
          <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <h5 className="font-semibold text-gray-700 text-sm">CAGR</h5>
            </div>
            <p className="text-green-900 font-bold text-2xl">{cagrValue}</p>
            <p className="text-green-700 text-xs mt-1">Compound Annual Growth Rate</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h5 className="font-semibold text-gray-700 text-sm">Market Size</h5>
            </div>
            <p className="text-indigo-900 font-bold text-2xl">{marketSizeValue}</p>
            <p className="text-indigo-700 text-xs mt-1">Current Market Valuation</p>
          </div>
          </div>
        </div>
      );
    }
    
    // Fallback to original single-box display if parsing fails
    return (
      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
        <p className="text-green-900 font-semibold text-lg">{section.highlight}</p>
      </div>
    );
  }
  
  // List sections (Key Market Players)
  if (section.type === 'list') {
    return (
      <div>
        {section.title && <h5 className="font-bold text-lg text-gray-900 mb-3">{section.title}</h5>}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
          {section.items && section.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {section.items.map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded border border-slate-200 text-base flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base text-gray-700 leading-relaxed">{section.content}</p>
          )}
        </div>
      </div>
    );
  }
  
  // Subsections (Drivers, Restraints, Opportunities, Challenges)
  if (section.type === 'subsection') {
    return (
      <div>
        <h6 className="font-semibold text-base text-gray-900 mb-2">{section.title}</h6>
        <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
          {section.subtitle && (
            <p className="font-semibold text-base text-amber-900 mb-2">{section.subtitle}</p>
          )}
          <p className="text-base text-gray-700 leading-relaxed">{section.content}</p>
        </div>
      </div>
    );
  }
  
  // Default section style (Recent Development, Regional segmentation, Segment Analysis items)
  return (
    <div>
      {section.title && <h5 className="font-bold text-lg text-gray-900 mb-3">{section.title}</h5>}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        {section.content && <p className="text-base text-gray-700 leading-relaxed">{section.content}</p>}
        {section.items && section.items.length > 0 && (
          <div className={section.content ? "mt-4 space-y-3" : "space-y-3"}>
            {section.items.map((item, idx) => (
              <p key={idx} className="text-base text-gray-700 leading-relaxed">
                {item}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PREVIEW SECTION RENDERER - Simple, clean design with unified styling
// ============================================================================

const PreviewSectionRenderer = ({ section }: { section: PreviewSection }) => {
  // Special rendering for segments with subsections
  if (section.type === 'segment' && section.subsections && section.subsections.length > 0) {
    return (
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h5 className="font-bold text-lg text-gray-900 mb-4">{section.title}</h5>
        <div className="grid md:grid-cols-2 gap-4">
          {section.subsections.map((sub, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <p className="font-bold text-base text-indigo-900 mb-1">{sub.label}</p>
              <p className="font-semibold text-base text-indigo-700">{sub.value}</p>
              {sub.description && (
                <p className="text-base text-gray-600 mt-2 leading-relaxed">{sub.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render summary section with gradient highlight
  if (section.type === 'summary') {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
        <h4 className="font-bold text-lg text-indigo-900 mb-3">{section.title}</h4>
        {section.highlight && (
          <p className="text-base text-indigo-900 font-semibold mb-3">{section.highlight}</p>
        )}
        <p className="text-base text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
      </div>
    );
  }

  // All other sections use clean, simple styling
  return (
    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
      <h5 className="font-bold text-lg text-gray-900 mb-3">
        {section.title}
      </h5>
      {section.highlight && (
        <p className="font-semibold text-base text-indigo-800 mb-2">{section.highlight}</p>
      )}
      <p className="text-base text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
    </div>
  );
};

export function ReportContent({
  tableOfContents = [],
  keyMetrics = [],
  relatedReports = [],
  reviews = [],
  keyFindings = [],
  methodology,
  sampleImages = [],
  onRequestSample,
  onRequestQuote,
  onRequestTableOfContents,
  previewData, // NEW: Accept preview data from props
  reportSummaryText // Dynamic text-based preview
}: ReportContentProps) {
  const [samplesOpen, setSamplesOpen] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  
  // Parse the report summary text if provided
  const parsedSections = reportSummaryText ? parseReportSummaryText(reportSummaryText) : [];
  
  // Use provided preview data or fall back to default sample data
  const reportPreview = previewData || DEFAULT_PREVIEW_DATA;

  return (
    <div className="flex-1 space-y-8">
      {/* Report Preview Frame */}
      <div className="space-y-6">
              {/* Header - Navigation tabs */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex gap-4 items-center flex-wrap">
                  <button 
                    onClick={() => setShowTableOfContents(false)}
                    className={`font-bold text-2xl transition-colors text-left ${
                      !showTableOfContents 
                        ? 'text-indigo-900' 
                        : 'text-gray-500 hover:text-indigo-700'
                    }`}
                  >
                    Summary
                  </button>
                  <button 
                    onClick={() => setShowTableOfContents(true)}
                    className={`font-bold text-2xl transition-colors border-l-2 border-gray-300 pl-4 ${
                      showTableOfContents 
                        ? 'text-indigo-900' 
                        : 'text-gray-500 hover:text-indigo-700'
                    }`}
                  >
                    Table of Contents
                  </button>
                </div>
              </div>
              
              {/* Dynamic Report Content - Renders from text or structured data */}
              <div className="space-y-6">
                {!showTableOfContents ? (
                  <>
                    {/* Report Summary Content */}
                    {/* If reportSummaryText is provided, use dynamic parser */}
                    {parsedSections.length > 0 ? (
                      <>
                        {parsedSections.map((section) => (
                          <DynamicSectionRenderer 
                            key={section.id} 
                            section={section} 
                            reportTitle={reportPreview.reportTitle}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        {/* Fallback to structured preview data */}
                        {reportPreview.sections && reportPreview.sections.length > 0 && (
                          <>
                            {/* Render sections dynamically */}
                            {reportPreview.sections.filter(s => !['driver', 'restraint', 'opportunity', 'challenge'].includes(s.type)).map((section) => (
                              <PreviewSectionRenderer key={section.id} section={section} />
                            ))}
                            
                            {/* Group Market Dynamics sections if they exist */}
                            {reportPreview.sections.some(s => ['driver', 'restraint', 'opportunity', 'challenge'].includes(s.type)) && (
                              <div>
                                <h5 className="font-bold text-lg text-gray-900 mb-4">Market Dynamics</h5>
                                <div className="space-y-4">
                                  {reportPreview.sections
                                    .filter(s => ['driver', 'restraint', 'opportunity', 'challenge'].includes(s.type))
                                    .map((section) => (
                                      <PreviewSectionRenderer key={section.id} section={section} />
                                    ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Key Market Players */}
                        {reportPreview.keyPlayers && reportPreview.keyPlayers.length > 0 && (
                          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                            <h5 className="font-bold text-lg text-gray-900 mb-3">Key Market Players</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-base">
                              {reportPreview.keyPlayers.map((player, idx) => (
                                <div key={idx} className="bg-white p-2 rounded border border-slate-200 shadow-sm">
                                  • {player}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Table of Contents Section - Always shown in report summary */}
                    {tableOfContents && tableOfContents.length > 0 ? (
                      <div id="table-of-contents-section" className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                        <h5 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                          Table of Contents
                        </h5>
                        <div className="space-y-3">
                          {tableOfContents.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:border-indigo-300 transition-colors">
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                  {item.chapter}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h6 className="font-semibold text-base text-gray-900 mb-1">{item.title}</h6>
                                  <p className="text-sm text-gray-600 mb-2">Pages {item.pages}</p>
                                  {item.subsections && item.subsections.length > 0 && (
                                    <ul className="space-y-1 mt-2">
                                      {item.subsections.map((sub, subIdx) => (
                                        <li key={subIdx} className="text-sm text-gray-600 flex items-start">
                                          <span className="text-indigo-600 mr-2 mt-1">•</span>
                                          <span>{sub}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div id="table-of-contents-section" className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-lg border-2 border-dashed border-amber-300 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-gray-900 mb-4">
                              Get detailed chapter breakdown and page-by-page content structure
                            </p>
                          </div>
                          <Button 
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-lg"
                            onClick={onRequestTableOfContents}
                          >
                            <FileText className="h-5 w-5 mr-2" />
                            Request Table of Contents
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Table of Contents Section - Shown when TOC button is clicked */}
                    {tableOfContents && tableOfContents.length > 0 ? (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                        <h5 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                          Table of Contents
                        </h5>
                        <div className="space-y-3">
                          {tableOfContents.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:border-indigo-300 transition-colors">
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                  {item.chapter}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h6 className="font-semibold text-base text-gray-900 mb-1">{item.title}</h6>
                                  <p className="text-sm text-gray-600 mb-2">Pages {item.pages}</p>
                                  {item.subsections && item.subsections.length > 0 && (
                                    <ul className="space-y-1 mt-2">
                                      {item.subsections.map((sub, subIdx) => (
                                        <li key={subIdx} className="text-sm text-gray-600 flex items-start">
                                          <span className="text-indigo-600 mr-2 mt-1">•</span>
                                          <span>{sub}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-lg border-2 border-dashed border-amber-300 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-gray-900 mb-4">
                              Get detailed chapter breakdown and page-by-page content structure
                            </p>
                          </div>
                          <Button 
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-lg"
                            onClick={onRequestTableOfContents}
                          >
                            <FileText className="h-5 w-5 mr-2" />
                            Request Table of Contents
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
      </div>

      {/* Executive Summary with Key Metrics */}
      {(keyMetrics.length > 0 || keyFindings.length > 0 || methodology) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {keyMetrics.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                {keyMetrics.map((metric, index) => {
                  const IconComponent = iconMap[metric.iconName as keyof typeof iconMap];
                  return (
                    <div key={index} className={`p-4 bg-gradient-to-br rounded-lg ${metric.color}`}>
                      {IconComponent && <IconComponent className="h-8 w-8 mb-3" />}
                      <h4 className="font-medium mb-2">{metric.label}</h4>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {keyFindings.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Key Findings</h4>
                <ul className="space-y-3">
                  {keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2"></span>
                      <p>{finding}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {methodology && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">Research Methodology</h4>
                <div 
                  className="text-sm text-amber-700"
                  dangerouslySetInnerHTML={{ __html: methodology }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Access This Report?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Get instant access to comprehensive market intelligence and strategic insights 
              that will drive your business decisions forward.
            </p>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={onRequestQuote}
            >
              <Phone className="h-4 w-4 mr-2" />
              Request Callback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
