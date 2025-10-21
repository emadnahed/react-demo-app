import React, { useState, useTransition, useMemo } from 'react';
import './PerformanceOptimization.css';

// Generate large dataset
const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'][i % 5],
    price: Math.floor(Math.random() * 500) + 10,
    description: `This is a detailed description for item ${i + 1}. It contains various keywords and information.`,
  }));
};

// Component WITHOUT useTransition
const WithoutTransition = () => {
  const [query, setQuery] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  const items = useMemo(() => generateItems(8000), []);

  // Expensive filtering operation (runs on every keystroke)
  const filteredItems = useMemo(() => {
    setRenderCount(prev => prev + 1);
    // Simulate expensive computation
    const start = performance.now();
    while (performance.now() - start < 10) {
      // Busy wait to simulate expensive work
    }

    if (!query) return items.slice(0, 50);

    return items
      .filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 50);
  }, [query, items]);

  return (
    <div className="comparison-side without-optimization">
      <h3 className="comparison-title">❌ Without useTransition</h3>
      <br />

      <div className="profiler-metrics">
        <h4>Performance Metrics</h4>
        <div className="metric-card">
          <span className="metric-label">Input Lag:</span>
          <span className="metric-value-bad">High (Blocking)</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Filter Updates:</span>
          <span className="metric-value-bad">{renderCount}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Priority:</span>
          <span className="metric-phase">All Urgent</span>
        </div>
      </div>

      <div className="search-section">
        <label>
          <strong>Search (try typing fast):</strong>
          <input
            type="text"
            className="search-input"
            placeholder="Type 'Electronics' or 'Item 100'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="results-container">
        <h5>Results ({filteredItems.length}):</h5>
        <div className="transition-results-list">
          {filteredItems.map(item => (
            <div key={item.id} className="transition-result-item">
              <div className="result-header">
                <strong>{item.name}</strong>
                <span className="result-price">${item.price}</span>
              </div>
              <div className="result-category">{item.category}</div>
              <div className="result-description">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="warning-note">
        <h4>⚠️ Performance Issues:</h4>
        <ul>
          <li>Input feels laggy when typing fast</li>
          <li>Entire UI freezes during filtering</li>
          <li>Poor user experience</li>
          <li>All updates treated as urgent</li>
        </ul>
      </div>
    </div>
  );
};

// Component WITH useTransition
const WithTransition = () => {
  const [query, setQuery] = useState('');
  const [deferredQuery, setDeferredQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [renderCount, setRenderCount] = useState(0);
  const items = useMemo(() => generateItems(8000), []);

  // Expensive filtering operation (runs as low-priority transition)
  const filteredItems = useMemo(() => {
    setRenderCount(prev => prev + 1);
    // Simulate expensive computation
    const start = performance.now();
    while (performance.now() - start < 10) {
      // Busy wait to simulate expensive work
    }

    if (!deferredQuery) return items.slice(0, 50);

    return items
      .filter(item =>
        item.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(deferredQuery.toLowerCase())
      )
      .slice(0, 50);
  }, [deferredQuery, items]);

  const handleChange = (e) => {
    const value = e.target.value;
    // Update input immediately (urgent)
    setQuery(value);
    // Update filter as transition (non-urgent)
    startTransition(() => {
      setDeferredQuery(value);
    });
  };

  return (
    <div className="comparison-side with-optimization">
      <h3 className="comparison-title">✅ With useTransition</h3>
      <br />

      <div className="profiler-metrics">
        <h4>Performance Metrics</h4>
        <div className="metric-card">
          <span className="metric-label">Input Lag:</span>
          <span className="metric-value-good">None (Responsive)</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Filter Updates:</span>
          <span className="metric-value-good">{renderCount}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Status:</span>
          <span className={isPending ? "metric-value-bad" : "metric-value-good"}>
            {isPending ? 'Updating...' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="search-section">
        <label>
          <strong>Search (try typing fast):</strong>
          <input
            type="text"
            className="search-input"
            placeholder="Type 'Electronics' or 'Item 100'..."
            value={query}
            onChange={handleChange}
          />
        </label>
        {isPending && (
          <div className="searching-indicator">Filtering...</div>
        )}
      </div>

      <div className="results-container" style={{ opacity: isPending ? 0.7 : 1 }}>
        <h5>Results ({filteredItems.length}):</h5>
        <div className="transition-results-list">
          {filteredItems.map(item => (
            <div key={item.id} className="transition-result-item">
              <div className="result-header">
                <strong>{item.name}</strong>
                <span className="result-price">${item.price}</span>
              </div>
              <div className="result-category">{item.category}</div>
              <div className="result-description">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="optimization-note">
        <h4>✅ Performance Benefits:</h4>
        <ul>
          <li>Input stays responsive while typing</li>
          <li>UI doesn't freeze during filtering</li>
          <li>Excellent user experience</li>
          <li>Smart priority handling</li>
        </ul>
      </div>
    </div>
  );
};

const UseTransitionDemo = () => {
  return (
    <div className="demo-section">
      <h2>useTransition (React 18) Demo</h2>
      <p className="demo-intro">
        <code>useTransition</code> lets you mark state updates as non-urgent (transitions),
        keeping the UI responsive during expensive operations. Try typing rapidly in both
        search boxes to feel the difference!
        <br />
        <strong>Left: With useTransition</strong> vs <strong>Right: Without useTransition</strong>
      </p>

      <div className="comparison-container">
        <WithTransition />
        <WithoutTransition />
      </div>

      <div className="optimization-explanation">
        <h2>Understanding useTransition</h2>
        <div className="explanation-content">
          <h3>What is useTransition?</h3>
          <p>
            <code>useTransition</code> is a React 18 hook that lets you mark state updates
            as transitions (non-urgent). React can interrupt a transition to handle more
            urgent updates, like user input. This keeps the UI responsive even during
            expensive operations.
          </p>

          <h3>How It Works:</h3>
          <div className="visual-explanation">
            <div className="visual-box">
              <h4>Without useTransition:</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">User types 'e':</span>
                  <code>Update input → Filter 8000 items → Render (50ms) ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User types 'l' (fast):</span>
                  <code>Blocked! Must wait for previous update 🐌</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Result:</span>
                  <code>Laggy typing, frozen UI 😢</code>
                </div>
              </div>
            </div>

            <div className="visual-box">
              <h4>With useTransition:</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">User types 'e':</span>
                  <code>Update input (urgent) → Filter later (transition) ✅</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User types 'l' (fast):</span>
                  <code>Update input immediately! Interrupt filtering 🚀</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Result:</span>
                  <code>Smooth typing, responsive UI 🎉</code>
                </div>
              </div>
            </div>
          </div>

          <h3>Key Concepts:</h3>
          <ul>
            <li><strong>Urgent Updates:</strong> User input, clicks, typing (must be immediate)</li>
            <li><strong>Transitions:</strong> UI updates that can be delayed (filtering, sorting, rendering)</li>
            <li><strong>Interruptible:</strong> Transitions can be interrupted by urgent updates</li>
            <li><strong>isPending:</strong> Boolean indicating if transition is in progress</li>
          </ul>

          <div className="code-example">
            <h4>Code Implementation:</h4>
            <pre>
{`import { useState, useTransition } from 'react';

function SearchList() {
  const [query, setQuery] = useState('');
  const [deferredQuery, setDeferredQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // Update input immediately (urgent)
    setQuery(e.target.value);

    // Update filter as transition (non-urgent)
    startTransition(() => {
      setDeferredQuery(e.target.value);
    });
  };

  // Expensive filtering based on deferredQuery
  const results = items.filter(item =>
    item.name.includes(deferredQuery)
  );

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Filtering...</p>}
      <div style={{ opacity: isPending ? 0.7 : 1 }}>
        {results.map(item => <div key={item.id}>{item.name}</div>)}
      </div>
    </div>
  );
}`}
            </pre>
          </div>

          <div className="best-practices">
            <h4>When to use useTransition:</h4>
            <ul>
              <li>Search/filter inputs with large datasets</li>
              <li>Tab switching with heavy content</li>
              <li>Route transitions</li>
              <li>Complex data transformations</li>
              <li>Any slow UI update that shouldn't block user input</li>
            </ul>
            <h4>Best Practices:</h4>
            <ul>
              <li>Use for non-urgent UI updates only</li>
              <li>Show loading states with <code>isPending</code></li>
              <li>Combine with <code>useDeferredValue</code> for simpler cases</li>
              <li>Don't use for critical updates (payment, data submission)</li>
            </ul>
          </div>

          <div className="real-world-example">
            <h4>Real-World Example:</h4>
            <p>
              Imagine an e-commerce site with 10,000 products. When a user types in the
              search box, you need to filter products in real-time. Without useTransition,
              typing "laptop" (6 characters) would cause 6 expensive filter operations,
              making the input lag terribly. With useTransition, the input stays smooth,
              and the filter runs in the background without blocking!
            </p>
          </div>

          <div className="comparison-note">
            <h4>useTransition vs useDeferredValue:</h4>
            <ul>
              <li><strong>useTransition:</strong> When you control the state update (own setState)</li>
              <li><strong>useDeferredValue:</strong> When you receive a value from props/parent</li>
              <li>Both achieve similar results with different APIs</li>
              <li>useTransition provides isPending flag</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseTransitionDemo;
