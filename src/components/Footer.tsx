import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">TheBrainyInsights</h3>
            <p className="text-gray-400 mb-4">
              Leading market research platform providing comprehensive business intelligence globally.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/en/reports" className="hover:text-white transition-colors">Market Reports</a></li>
              <li><a href="/en/categories" className="hover:text-white transition-colors">Industry Categories</a></li>
              <li><a href="/en/services" className="hover:text-white transition-colors">Custom Research</a></li>
              <li><a href="/en/services" className="hover:text-white transition-colors">Services</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/en/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/en/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/en/clients" className="hover:text-white transition-colors">Our Clients</a></li>
              <li><a href="/en/reports" className="hover:text-white transition-colors">Featured Reports</a></li>
            </ul>
          </div>

          {/* Request Callback */}
          <div>
            <h4 className="font-semibold mb-4">Request Callback</h4>
            <p className="text-gray-400 text-sm mb-4">
              Our experts are ready to help you make informed business decisions.
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">
              Request a Callback
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TheBrainyInsights. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/en/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/en/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/sitemap.xml" className="text-gray-400 hover:text-white text-sm transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
