import Link from 'next/link';
import { Button } from '@tbi/ui';

export default function TestReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Test Report Navigation</h1>
        
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Test Routes</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Reports Listing Page</h3>
              <p className="text-gray-600 mb-2">View all reports with clickable cards</p>
              <Link href="/en/reports">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  View Reports Listing
                </Button>
              </Link>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold">Sample Individual Report</h3>
              <p className="text-gray-600 mb-2">Enhanced report page with rich UI</p>
              <Link href="/en/reports/global-artificial-intelligence-market-2025-2032">
                <Button className="bg-green-600 hover:bg-green-700">
                  View AI Market Report
                </Button>
              </Link>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold">Sample Cloud Computing Report</h3>
              <p className="text-gray-600 mb-2">Another sample with different content</p>
              <Link href="/en/reports/cloud-computing-market-2025-2030">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  View Cloud Report
                </Button>
              </Link>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold">Sample Healthcare IoT Report</h3>
              <p className="text-gray-600 mb-2">Healthcare industry focus</p>
              <Link href="/en/reports/healthcare-iot-solutions-2025">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  View Healthcare Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold mb-4">Features Tested</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-2">✅ Working Features</h3>
              <ul className="space-y-1 text-sm">
                <li>• Clickable report cards</li>
                <li>• Enhanced individual report pages</li>
                <li>• Responsive design</li>
                <li>• Dynamic routing</li>
                <li>• Sample data integration</li>
                <li>• Mobile optimization</li>
                <li>• Interactive components</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-2">🔧 Integration Notes</h3>
              <ul className="space-y-1 text-sm">
                <li>• Database integration ready</li>
                <li>• Fallback to sample data</li>
                <li>• Monorepo architecture maintained</li>
                <li>• All routes preserved</li>
                <li>• SEO optimized</li>
                <li>• TypeScript support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
