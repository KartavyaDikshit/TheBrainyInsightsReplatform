'use client'; // Mark as client component

import React from 'react';
import { signOut } from 'next-auth/react'; // Import signOut

const SiteHeader = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <div>{/* Header content goes here */}</div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })} // Redirect to home after logout
        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </header>
  );
};

export default SiteHeader;
