import React, { useState, useRef, useEffect } from 'react';
import './PerformanceOptimization.css';

// Mock database of items
const mockData = [
  'React', 'Redux', 'React Router', 'React Query', 'React Hook Form',
  'Next.js', 'Gatsby', 'Remix', 'Vite', 'Webpack',
  'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Sass',
  'Tailwind CSS', 'Material-UI', 'Ant Design', 'Chakra UI',
  'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'GraphQL'
];

const WithoutDebounceDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchCount = useRef(0);

  // ❌ Search on EVERY keystroke (no debouncing)
  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [searchTerm]); // Runs on every change!

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
    if (e.target.value) {
      setIsSearching(true);
    }
  };

  return (
    <div className="comparison-side without-optimization">
      <h3 className="comparison-title">❌ Without Debouncing</h3>
      <br />
      <div className="parent-component">
        <h4>Search Component</h4>

        <div className="render-info">
          <p className="search-count">
            <strong>API Calls Made:</strong>
            <span className="count-large">{searchCount.current}</span>
            <span className="ref-badge changing">WASTEFUL</span>
          </p>
          <p className="debounce-info">
            <strong>Debounce Delay:</strong> <span className="delay-none">None (0ms)</span>
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
            {isSearching && <div className="searching-indicator warning">Searching...</div>}
          </div>
        </div>

        <div className="info-box small warning">
          <p>
            <strong>❌ Inefficient behavior:</strong>
          </p>
          <ul>
            <li>Searches on EVERY keystroke</li>
            <li>Creates excessive API calls</li>
            <li>Wastes server resources</li>
            <li>Type "react" and watch the counter spike!</li>
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

      <div className="optimization-note warning-note">
        <h4>❌ Performance Problems:</h4>
        <ul>
          <li>One API call per keystroke!</li>
          <li>Typing "react" = 5 API calls</li>
          <li>Increased server costs</li>
          <li>Potential rate limiting issues</li>
        </ul>
      </div>
    </div>
  );
};

export default WithoutDebounceDemo;
