import React from 'react';
const SearchResultsList = ({ results }) => {
    if (!results || results.length === 0) {
        return <p>No results found.</p>;
    }
    return (<div>
      <h2>Search Results</h2>
      <ul>
        {results.map((report) => {
            var _a, _b;
            return (<li key={report.id}>
            <h3>{((_a = report.translations[0]) === null || _a === void 0 ? void 0 : _a.title) || report.slug}</h3>
            <p>{(_b = report.translations[0]) === null || _b === void 0 ? void 0 : _b.summary}</p>
            {/* Add more details as needed */}
          </li>);
        })}
      </ul>
    </div>);
};
export default SearchResultsList;
