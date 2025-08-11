import React from 'react';

interface SearchResultsListProps {
  results: any[]; // Replace 'any' with actual Report type if available
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((report) => (
          <li key={report.id}>
            <h3>{report.translations[0]?.title || report.slug}</h3>
            <p>{report.translations[0]?.summary}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsList;
