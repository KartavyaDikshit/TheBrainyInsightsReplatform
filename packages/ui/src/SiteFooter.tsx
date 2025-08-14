import React from 'react';
import Link from 'next/link';

const SiteFooter = () => {
  return (
    <footer className="bg-gray-800 text-white p-8 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} The Brainy Insights. All rights reserved.</p>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gray-300">Terms of Service</Link></li>
            <li><Link href="/sitemap" className="hover:text-gray-300">Sitemap</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default SiteFooter;
