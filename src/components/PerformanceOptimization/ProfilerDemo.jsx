import React, { useState, Profiler, useCallback, useRef, useMemo } from 'react';
import './PerformanceOptimization.css';

// Slow component - intentionally inefficient
const SlowListItem = ({ item, onClick }) => {
  // Simulate expensive rendering
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Busy wait for 1ms per item
  }

  return (
    <div className="list-item" onClick={() => onClick(item.id)}>
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </div>
  );
};

// Optimized component with React.memo
const FastListItem = React.memo(({ item, onClick }) => {
  // Same simulated work, but memoized
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Busy wait for 1ms per item
  }

  return (
    <div className="list-item" onClick={() => onClick(item.id)}>
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </div>
  );
});

// Separate component for slow profiled list - memoized to prevent re-renders from parent
const SlowProfiledList = React.memo(({ items, onRender, onClick, count }) => {
  return (
    <div className="profiled-list">
      <Profiler id="slow-list" onRender={onRender}>
        {items.slice(0, 10).map(item => (
          <SlowListItem
            key={item.id}
            item={item}
            onClick={onClick}
          />
        ))}
      </Profiler>
    </div>
  );
});

// Separate component for fast profiled list - memoized to prevent re-renders from parent
const FastProfiledList = React.memo(({ items, onRender, onClick, count }) => {
  return (
    <div className="profiled-list">
      <Profiler id="fast-list" onRender={onRender}>
        {items.slice(0, 10).map(item => (
          <FastListItem
            key={item.id}
            item={item}
            onClick={onClick}
          />
        ))}
      </Profiler>
    </div>
  );
});

const ProfilerDemo = () => {
  const [slowCount, setSlowCount] = useState(0);
  const [fastCount, setFastCount] = useState(0);

  // Use refs to store metrics to avoid re-renders
  const slowMetricsRef = useRef([]);
  const fastMetricsRef = useRef([]);
  const [, forceUpdate] = useState({});

  // Generate dummy data - memoized to prevent new array on each render
  const items = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`
  })), []);

  // Profiler callback - captures rendering metrics using refs
  const onRenderSlow = useCallback((
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    slowMetricsRef.current = [
      ...slowMetricsRef.current.slice(-4), // Keep last 5 measurements
      {
        phase,
        actualDuration: actualDuration.toFixed(2),
        baseDuration: baseDuration.toFixed(2),
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    // Force update only if needed (using a trick to update without causing infinite loop)
    setTimeout(() => forceUpdate({}), 0);
  }, []);

  const onRenderFast = useCallback((
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    fastMetricsRef.current = [
      ...fastMetricsRef.current.slice(-4),
      {
        phase,
        actualDuration: actualDuration.toFixed(2),
        baseDuration: baseDuration.toFixed(2),
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    // Force update only if needed
    setTimeout(() => forceUpdate({}), 0);
  }, []);

  // Handlers with useCallback to prevent unnecessary re-renders of memoized lists
  const handleSlowClick = useCallback((id) => {
    console.log('Slow clicked:', id);
  }, []);

  const handleFastClick = useCallback((id) => {
    console.log('Fast clicked:', id);
  }, []);

  const getAverageDuration = (metrics) => {
    if (metrics.length === 0) return '0';
    const avg = metrics.reduce((sum, m) => sum + parseFloat(m.actualDuration), 0) / metrics.length;
    return avg.toFixed(2);
  };

  const slowMetrics = slowMetricsRef.current;
  const fastMetrics = fastMetricsRef.current;

  return (
    <div className="demo-section">
      <h2>React Profiler Demo</h2>
      <p className="demo-intro">
        The React <code>Profiler</code> API measures component render performance.
        Click the counters to trigger re-renders and watch the metrics update in real-time.
        <br />
        <strong>Left: Unoptimized</strong> vs <strong>Right: Optimized with React.memo</strong>
      </p>

      <div className="comparison-container">
        {/* WITHOUT Optimization */}
        <div className="comparison-side without-optimization">
          <h3 className="comparison-title">❌ Without Optimization</h3>
          <br />

          <div className="profiler-metrics">
            <h4>Performance Metrics</h4>
            <div className="metric-card">
              <span className="metric-label">Renders:</span>
              <span className="metric-value-bad">{slowMetrics.length}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Avg Duration:</span>
              <span className="metric-value-bad">{getAverageDuration(slowMetrics)}ms</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Latest Phase:</span>
              <span className="metric-phase">{slowMetrics[slowMetrics.length - 1]?.phase || 'N/A'}</span>
            </div>
          </div>

          <div className="counter-section">
            <p className="counter-display">Counter: <strong>{slowCount}</strong></p>
            <button
              className="counter-btn"
              onClick={() => setSlowCount(slowCount + 1)}
            >
              Trigger Re-render
            </button>
          </div>

          <SlowProfiledList
            items={items}
            onRender={onRenderSlow}
            onClick={handleSlowClick}
            count={slowCount}
          />

          {slowMetrics.length > 0 && (
            <div className="metrics-history">
              <h5>Render History:</h5>
              {slowMetrics.map((metric, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-time">{metric.timestamp}</span>
                  <span className="history-phase">{metric.phase}</span>
                  <span className="history-duration">{metric.actualDuration}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WITH Optimization */}
        <div className="comparison-side with-optimization">
          <h3 className="comparison-title">✅ With Optimization (React.memo)</h3>
          <br />

          <div className="profiler-metrics">
            <h4>Performance Metrics</h4>
            <div className="metric-card">
              <span className="metric-label">Renders:</span>
              <span className="metric-value-good">{fastMetrics.length}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Avg Duration:</span>
              <span className="metric-value-good">{getAverageDuration(fastMetrics)}ms</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Latest Phase:</span>
              <span className="metric-phase">{fastMetrics[fastMetrics.length - 1]?.phase || 'N/A'}</span>
            </div>
          </div>

          <div className="counter-section">
            <p className="counter-display">Counter: <strong>{fastCount}</strong></p>
            <button
              className="counter-btn"
              onClick={() => setFastCount(fastCount + 1)}
            >
              Trigger Re-render
            </button>
          </div>

          <FastProfiledList
            items={items}
            onRender={onRenderFast}
            onClick={handleFastClick}
            count={fastCount}
          />

          {fastMetrics.length > 0 && (
            <div className="metrics-history">
              <h5>Render History:</h5>
              {fastMetrics.map((metric, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-time">{metric.timestamp}</span>
                  <span className="history-phase">{metric.phase}</span>
                  <span className="history-duration">{metric.actualDuration}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="optimization-explanation">
        <h2>Understanding React Profiler</h2>
        <div className="explanation-content">
          <h3>What is the Profiler?</h3>
          <p>
            The React <code>Profiler</code> is a built-in component that measures the "cost" of rendering.
            It tracks how long components take to render and why they rendered. This data helps identify
            performance bottlenecks in your application.
          </p>

          <h3>Profiler Metrics Explained:</h3>
          <ul>
            <li><strong>actualDuration:</strong> Time spent rendering the component and its children</li>
            <li><strong>baseDuration:</strong> Estimated time to render without memoization</li>
            <li><strong>phase:</strong> "mount" (first render) or "update" (re-render)</li>
            <li><strong>startTime:</strong> When React began rendering</li>
            <li><strong>commitTime:</strong> When React committed the changes</li>
          </ul>

          <div className="code-example">
            <h4>Code Implementation:</h4>
            <pre>
{`import { Profiler } from 'react';

function MyComponent() {
  const onRenderCallback = (
    id,                    // Profiler id
    phase,                 // "mount" or "update"
    actualDuration,        // Time to render
    baseDuration,          // Time without memoization
    startTime,             // When render started
    commitTime             // When changes committed
  ) => {
    console.log(\`\${id} took \${actualDuration}ms to render\`);
  };

  return (
    <Profiler id="MyComponent" onRender={onRenderCallback}>
      <ExpensiveComponent />
    </Profiler>
  );
}`}
            </pre>
          </div>

          <div className="best-practices">
            <h4>When to use the Profiler:</h4>
            <ul>
              <li>Identifying slow components in development</li>
              <li>Measuring the impact of optimizations</li>
              <li>Production monitoring (with caution - adds overhead)</li>
              <li>Comparing before/after performance</li>
            </ul>
            <h4>Performance Tips:</h4>
            <ul>
              <li>Only use in development or specific production scenarios</li>
              <li>Wrap specific components, not the entire app</li>
              <li>Use with Chrome DevTools for deeper insights</li>
              <li>Combine with React.memo, useMemo, useCallback</li>
            </ul>
          </div>

          <div className="real-world-example">
            <h4>Real-World Use Case:</h4>
            <p>
              A team noticed their dashboard was slow. Using the Profiler, they discovered
              a DataTable component was rendering 500ms on every state change. After adding
              React.memo and useCallback, render time dropped to 50ms - a 10x improvement!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilerDemo;
