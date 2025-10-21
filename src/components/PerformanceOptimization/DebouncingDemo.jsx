import React from 'react';
import WithDebounceDemo from './WithDebounceDemo';
import WithoutDebounceDemo from './WithoutDebounceDemo';
import './PerformanceOptimization.css';

const DebouncingDemo = () => {
  const debouncingTime = 1200;
  return (
    <div className="demo-section">
      <h2>Debouncing Optimization Demo</h2>
      <p className="demo-intro">
        Watch the <strong>API Calls Made</strong> counter to see the dramatic difference.
        Debouncing delays function execution until after a pause in events, preventing excessive calls.
        <br />
        <strong>Type "react" in both search boxes</strong> and compare the API call counts!
      </p>

      <div className="comparison-container">
        {/* WITH Debouncing - completely independent component */}
        <WithDebounceDemo debouncingTime={debouncingTime} />

        {/* WITHOUT Debouncing - completely independent component */}
        <WithoutDebounceDemo />
      </div>

      <div className="optimization-explanation">
        <h2>Understanding Debouncing</h2>
        <div className="explanation-content">
          <h3>The Problem:</h3>
          <p>
            When users type in a search box, every keystroke can trigger an expensive operation
            like an API call. Typing "react" (5 characters) would cause 5 separate API calls
            without debouncing. This wastes resources and can cause performance issues.
          </p>

          <div className="visual-explanation">
            <div className="visual-box">
              <h4>With Debouncing (${debouncingTime}ms delay):</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">User types "r":</span>
                  <code>Timer starts... (no API call yet)</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User types "e" (50ms later):</span>
                  <code>Timer resets... (still no API call)</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User types "act" (fast):</span>
                  <code>Timer keeps resetting... (no calls)</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User stops typing (${debouncingTime}ms passes):</span>
                  <code>API call made with "react" ✅ (1 call total!)</code>
                </div>
              </div>
            </div>

            <div className="visual-box">
              <h4>Without Debouncing:</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">User types "r":</span>
                  <code>API call #1 with "r" ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User types "e":</span>
                  <code>API call #2 with "re" ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User types "a":</span>
                  <code>API call #3 with "rea" ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User types "c":</span>
                  <code>API call #4 with "reac" ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User types "t":</span>
                  <code>API call #5 with "react" ⚠️ (5 calls total!)</code>
                </div>
              </div>
            </div>
          </div>

          <h3>How Debouncing Works:</h3>
          <p>
            Debouncing delays the execution of a function until after a specified time has passed
            since the last invocation. If the function is called again before the timer expires,
            the timer resets. This ensures the function only runs once after the user stops the
            rapid sequence of events.
          </p>

          <h3>Performance Impact:</h3>
          <ul>
            <li><strong>Fewer API Calls:</strong> 1 call instead of 5+ for "react" (80-90% reduction)</li>
            <li><strong>Reduced Server Load:</strong> Fewer requests = lower server costs</li>
            <li><strong>Better UX:</strong> Prevents UI lag from excessive updates</li>
            <li><strong>Bandwidth Savings:</strong> Less data transferred</li>
            <li><strong>Prevents Rate Limiting:</strong> Avoid hitting API rate limits</li>
          </ul>

          <div className="code-example">
            <h4>Code Implementation:</h4>
            <pre>
{`// Custom useDebounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // Cleanup
  }, [value, delay]);

  return debouncedValue;
}

// Usage in component
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // This only runs 500ms after user stops typing
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}`}
            </pre>
          </div>

          <div className="best-practices">
            <h4>When to use Debouncing:</h4>
            <ul>
              <li>Search inputs with live results (autocomplete)</li>
              <li>Form field validation with API calls</li>
              <li>Window resize handlers</li>
              <li>Scroll event handlers</li>
              <li>Auto-save functionality</li>
            </ul>
            <h4>Common debounce delays:</h4>
            <ul>
              <li><strong>Search:</strong> 300-500ms</li>
              <li><strong>Resize/Scroll:</strong> 150-250ms</li>
              <li><strong>Auto-save:</strong> 1000-2000ms</li>
              <li><strong>Form validation:</strong> 500ms</li>
            </ul>
          </div>

          <div className="real-world-example">
            <h4>Real-World Example:</h4>
            <p>
              Google's search autocomplete uses debouncing. When you type a search query:
            </p>
            <ul>
              <li><strong>Without debouncing:</strong> Typing "javascript tutorial" (20 chars) = 20 API calls</li>
              <li><strong>With debouncing (500ms):</strong> Same search = 1-3 API calls</li>
              <li><strong>Result:</strong> Google saves millions of dollars in server costs daily!</li>
            </ul>
          </div>

          <div className="comparison-note">
            <h4>Debouncing vs Throttling:</h4>
            <ul>
              <li><strong>Debouncing:</strong> Executes after events stop (waits for quiet period)</li>
              <li><strong>Throttling:</strong> Executes at most once per time period (enforces rate limit)</li>
              <li><strong>Use debouncing for:</strong> Search, form validation, auto-save</li>
              <li><strong>Use throttling for:</strong> Scroll handlers, mouse movement, drag events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebouncingDemo;
