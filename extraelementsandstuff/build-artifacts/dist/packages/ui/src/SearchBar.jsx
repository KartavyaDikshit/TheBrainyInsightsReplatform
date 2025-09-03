'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
const SearchBar = ({ initialQuery = '', locale }) => {
    const router = useRouter();
    const [query, setQuery] = React.useState(initialQuery);
    const handleSubmit = (e) => {
        e.preventDefault();
        router.push(`/${locale}/search?q=${query}`);
    };
    return (<form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-4">
      <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Search
      </button>
    </form>);
};
export default SearchBar;
