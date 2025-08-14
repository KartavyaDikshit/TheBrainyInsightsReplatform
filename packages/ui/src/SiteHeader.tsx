'use client'; // Mark as client component

import React from 'react';
import { signOut, useSession } from 'next-auth/react'; // Import signOut and useSession
import Link from 'next/link'; // Import Link for navigation

const SiteHeader = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          The Brainy Insights
        </Link>
        <nav className="ml-10 hidden md:block">
          <ul className="flex space-x-6">
            <li><Link href="/reports" className="hover:text-gray-300">Reports</Link></li>
            <li><Link href="/categories" className="hover:text-gray-300">Categories</Link></li>
            <li><Link href="/about" className="hover:text-gray-300">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
          </ul>
        </nav>
      </div>
      {status === 'authenticated' && (
        <button
          onClick={() => signOut({ callbackUrl: '/' })} // Redirect to home after logout
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      )}
    </header>
  );
};

export default SiteHeader;
