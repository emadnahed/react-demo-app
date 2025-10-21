import React, { useState, useRef, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import './PerformanceOptimization.css';

// Mock database of items
const mockData = [
  'React', 'Redux', 'React Router', 'React Query', 'React Hook Form',
  'Next.js', 'Gatsby', 'Remix', 'Vite', 'Webpack',
  'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Sass',
  'Tailwind CSS', 'Material-UI', 'Ant Design', 'Chakra UI',
  'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'GraphQL'
];

const WithDebounceDemo = ({ debouncingTime }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchCount = useRef(0);


  

  // ✅ Debounce the search term with ${debouncingTime} delay
  const debouncedSearchTerm = useDebounce(searchTerm, debouncingTime);

  // Perform search when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  const performSearch = (term) => {
    setIsSearching(true);
    searchCount.current += 1;

    // Simulate API call delay
    setTimeout(() => {
      const filtered = mockData.filter(item =>
        item.toLowerCase().includes(term.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value && !isSearching) {
      setIsSearching(true);
    }
  };

  return (
    <div className="comparison-side with-optimization">
      <h3 className="comparison-title">✅ With Debouncing</h3>
      <br />
      <div className="parent-component">
        <h4>Search Component</h4>

        <div className="render-info">
          <p className="search-count">
            <strong>API Calls Made:</strong>
            <span className="count-small">{searchCount.current}</span>
            <span className="ref-badge stable">OPTIMIZED</span>
          </p>
          <p className="debounce-info">
            <strong>Debounce Delay:</strong> <span className="delay">{debouncingTime}ms</span>
          </p>
        </div>

        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search technologies..."
              value={searchTerm}
              onChange={handleInputChange}
            />
            {isSearching && <div className="searching-indicator">Searching...</div>}
          </div>
        </div>

        <div className="info-box small">
          <p>
            <strong>✅ Optimized behavior:</strong>
          </p>
          <ul>
            <li>Waits {debouncingTime}ms after you stop typing</li>
            <li>Only searches when typing pauses</li>
            <li>Reduces API calls significantly</li>
            <li>Type "react" and watch the counter</li>
          </ul>
        </div>

        {results.length > 0 && (
          <div className="results-container">
            <h5>Results ({results.length}):</h5>
            <div className="results-list">
              {results.map((result, index) => (
                <div key={index} className="result-item">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {searchTerm && results.length === 0 && !isSearching && (
          <div className="no-results">No results found</div>
        )}
      </div>

      <div className="optimization-note">
        <h4>✅ Performance Benefits:</h4>
        <ul>
          <li>Significantly fewer API calls</li>
          <li>Reduced server load</li>
          <li>Better user experience (no lag)</li>
          <li>Lower bandwidth usage</li>
        </ul>
      </div>
    </div>
  );
};

export default WithDebounceDemo;
