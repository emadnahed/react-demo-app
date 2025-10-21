import React, { useState, useRef, useEffect, Profiler, useCallback } from 'react';
import './PerformanceOptimization.css';

// Simple virtual list implementation
const VirtualList = ({ items, itemHeight, containerHeight }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  // Calculate which items are visible
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="virtual-scroll-container"
      style={{ height: containerHeight, overflow: 'auto', position: 'relative' }}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, idx) => (
            <div
              key={startIndex + idx}
              className="virtual-list-item"
              style={{ height: itemHeight }}
            >
              <div className="item-content">
                <span className="item-index">#{item.id}</span>
                <span className="item-title">{item.title}</span>
                <span className="item-value">${item.value.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Regular list without virtualization
const RegularList = ({ items, containerHeight }) => {
  return (
    <div
      className="regular-scroll-container"
      style={{ height: containerHeight, overflow: 'auto' }}
    >
      {items.map((item, idx) => (
        <div key={idx} className="virtual-list-item">
          <div className="item-content">
            <span className="item-index">#{item.id}</span>
            <span className="item-title">{item.title}</span>
            <span className="item-value">${item.value.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const VirtualScrollingDemo = () => {
  const [itemCount, setItemCount] = useState(1000);
  const [regularRenderedCount, setRegularRenderedCount] = useState(0);
  const [, forceUpdate] = useState({});

  // Use refs to store render times to avoid infinite loop
  const virtualRenderTimeRef = useRef(null);
  const regularRenderTimeRef = useRef(null);

  const itemHeight = 60;
  const containerHeight = 400;

  // Generate large dataset
  const items = Array.from({ length: itemCount }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1} - ${['Product', 'Service', 'Task', 'User', 'Order'][i % 5]}`,
    value: Math.random() * 1000,
    description: `Description for item ${i + 1}`
  }));

  // Profiler callback for virtual list - use refs to avoid infinite loop
  const onRenderVirtual = useCallback((id, phase, actualDuration) => {
    virtualRenderTimeRef.current = actualDuration.toFixed(2);
    // Defer UI update to next tick to avoid infinite loop
    setTimeout(() => forceUpdate({}), 0);
  }, []);

  // Profiler callback for regular list - use refs to avoid infinite loop
  const onRenderRegular = useCallback((id, phase, actualDuration) => {
    regularRenderTimeRef.current = actualDuration.toFixed(2);
    // Defer UI update to next tick to avoid infinite loop
    setTimeout(() => forceUpdate({}), 0);
  }, []);

  useEffect(() => {
    setRegularRenderedCount(items.length);
  }, [items.length]);

  const handleItemCountChange = (newCount) => {
    setItemCount(newCount);
    // Clear previous measurements when changing count
    virtualRenderTimeRef.current = null;
    regularRenderTimeRef.current = null;
  };

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight) + 1;

  return (
    <div className="demo-section">
      <h2>Virtual Scrolling (Windowing) Demo</h2>
      <p className="demo-intro">
        Virtual scrolling only renders items that are visible in the viewport, dramatically
        improving performance for large lists. Try scrolling through both lists and notice
        the difference!
        <br />
        <strong>Left: With Virtual Scrolling</strong> vs <strong>Right: Without Virtual Scrolling</strong>
      </p>

      <div className="virtualization-controls">
        <label>
          <strong>Number of items:</strong>
          <div className="button-group" style={{ marginTop: '0.5rem' }}>
            <button
              className={`counter-btn ${itemCount === 100 ? 'secondary-btn' : ''}`}
              onClick={() => handleItemCountChange(100)}
            >
              100 items
            </button>
            <button
              className={`counter-btn ${itemCount === 1000 ? 'secondary-btn' : ''}`}
              onClick={() => handleItemCountChange(1000)}
            >
              1,000 items
            </button>
            <button
              className={`counter-btn ${itemCount === 5000 ? 'secondary-btn' : ''}`}
              onClick={() => handleItemCountChange(5000)}
            >
              5,000 items
            </button>
            <button
              className={`counter-btn ${itemCount === 10000 ? 'secondary-btn' : ''}`}
              onClick={() => handleItemCountChange(10000)}
            >
              10,000 items
            </button>
          </div>
        </label>
      </div>

      <div className="comparison-container">
        {/* WITH Virtual Scrolling */}
        <div className="comparison-side with-optimization">
          <h3 className="comparison-title">✅ With Virtual Scrolling</h3>
          <br />

          <div className="profiler-metrics">
            <h4>Performance Metrics</h4>
            <div className="metric-card">
              <span className="metric-label">Total Items:</span>
              <span className="metric-value-good">{itemCount.toLocaleString()}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">DOM Nodes:</span>
              <span className="metric-value-good">{visibleItemsCount}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Render Time:</span>
              <span className="metric-value-good">
                {virtualRenderTimeRef.current ? `${virtualRenderTimeRef.current}ms` : 'Calculating...'}
              </span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Memory:</span>
              <span className="metric-phase">Low</span>
            </div>
          </div>

          <Profiler id="virtual-list" onRender={onRenderVirtual}>
            <VirtualList
              items={items}
              itemHeight={itemHeight}
              containerHeight={containerHeight}
            />
          </Profiler>

          <div className="optimization-note">
            <h4>✅ Performance Benefits:</h4>
            <ul>
              <li>Only renders ~{visibleItemsCount} visible items</li>
              <li>Constant DOM size regardless of data</li>
              <li>Smooth scrolling even with 10,000+ items</li>
              <li>Low memory footprint</li>
              <li>Fast initial render</li>
            </ul>
          </div>
        </div>

        {/* WITHOUT Virtual Scrolling */}
        <div className="comparison-side without-optimization">
          <h3 className="comparison-title">❌ Without Virtual Scrolling</h3>
          <br />

          <div className="profiler-metrics">
            <h4>Performance Metrics</h4>
            <div className="metric-card">
              <span className="metric-label">Total Items:</span>
              <span className="metric-value-bad">{itemCount.toLocaleString()}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">DOM Nodes:</span>
              <span className="metric-value-bad">{regularRenderedCount.toLocaleString()}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Render Time:</span>
              <span className="metric-value-bad">
                {regularRenderTimeRef.current ? `${regularRenderTimeRef.current}ms` : 'Calculating...'}
              </span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Memory:</span>
              <span className="metric-phase">High</span>
            </div>
          </div>

          {itemCount <= 1000 ? (
            <Profiler id="regular-list" onRender={onRenderRegular}>
              <RegularList items={items} containerHeight={containerHeight} />
            </Profiler>
          ) : (
            <div className="warning-message">
              <h4>⚠️ Performance Warning</h4>
              <p>
                Rendering {itemCount.toLocaleString()} items without virtualization could freeze your browser.
                This demo is disabled for your safety with {'>'}1000 items.
              </p>
              <p>
                In a real app, this would create {itemCount.toLocaleString()} DOM nodes,
                causing severe performance issues!
              </p>
            </div>
          )}

          {itemCount <= 1000 && (
            <div className="warning-note">
              <h4>⚠️ Performance Issues:</h4>
              <ul>
                <li>Renders ALL {regularRenderedCount.toLocaleString()} items at once</li>
                <li>Creates {regularRenderedCount.toLocaleString()} DOM nodes</li>
                <li>Laggy scrolling with large datasets</li>
                <li>High memory consumption</li>
                <li>Slow initial render</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="optimization-explanation">
        <h2>Understanding Virtual Scrolling</h2>
        <div className="explanation-content">
          <h3>What is Virtual Scrolling?</h3>
          <p>
            Virtual scrolling (also called windowing) is a technique that only renders items
            visible in the viewport. As the user scrolls, items outside the view are removed
            from the DOM, and new visible items are added. This keeps the DOM size constant
            regardless of the total number of items.
          </p>

          <h3>How It Works:</h3>
          <div className="visual-explanation">
            <div className="visual-box">
              <h4>Traditional List:</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">10,000 items in data:</span>
                  <code>Renders 10,000 DOM nodes ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User sees ~7 items:</span>
                  <code>But all 10,000 are in DOM 💀</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Browser struggles:</span>
                  <code>Layout, painting, memory issues 🐌</code>
                </div>
              </div>
            </div>

            <div className="visual-box">
              <h4>Virtual Scrolling:</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">10,000 items in data:</span>
                  <code>Renders only ~{visibleItemsCount} DOM nodes ✅</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User scrolls down:</span>
                  <code>Top items removed, bottom items added 🔄</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Browser happy:</span>
                  <code>Constant DOM size, smooth performance ⚡</code>
                </div>
              </div>
            </div>
          </div>

          <h3>Performance Impact:</h3>
          <ul>
            <li><strong>Initial Render:</strong> 50-100x faster for large lists</li>
            <li><strong>Memory Usage:</strong> 95%+ reduction in DOM nodes</li>
            <li><strong>Scrolling:</strong> Smooth 60fps even with 100k+ items</li>
            <li><strong>Interactions:</strong> Instant response times</li>
          </ul>

          <div className="code-example">
            <h4>Code Implementation:</h4>
            <pre>
{`function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = startIndex + Math.ceil(containerHeight / itemHeight);

  // Only render visible items
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return (
    <div onScroll={(e) => setScrollTop(e.target.scrollTop)}>
      <div style={{ height: items.length * itemHeight }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map(item => (
            <div key={item.id} style={{ height: itemHeight }}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`}
            </pre>
          </div>

          <div className="best-practices">
            <h4>When to use Virtual Scrolling:</h4>
            <ul>
              <li>Lists with 100+ items</li>
              <li>Data tables with thousands of rows</li>
              <li>Chat message histories</li>
              <li>Social media feeds</li>
              <li>File explorers</li>
              <li>Any infinitely scrolling content</li>
            </ul>
            <h4>Popular Libraries:</h4>
            <ul>
              <li><strong>react-window:</strong> Lightweight, modern (recommended)</li>
              <li><strong>react-virtualized:</strong> Feature-rich, mature</li>
              <li><strong>TanStack Virtual:</strong> Headless, framework-agnostic</li>
            </ul>
          </div>

          <div className="real-world-example">
            <h4>Real-World Example:</h4>
            <p>
              Twitter's timeline uses virtual scrolling to handle thousands of tweets.
              Without it, scrolling through 1,000 tweets would require rendering 1,000+
              DOM nodes, causing lag and high memory usage. With virtual scrolling, only
              ~10-15 tweets are in the DOM at any time, keeping the feed buttery smooth!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualScrollingDemo;
