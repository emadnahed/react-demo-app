import React, { useState, useRef, useCallback } from 'react';
import { useThrottle } from './useThrottle';
import './PerformanceOptimization.css';

// Component WITHOUT throttling
const WithoutThrottle = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [updateCount, setUpdateCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const boxRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setEventCount(prev => prev + 1);
    setUpdateCount(prev => prev + 1);
    setPosition({ x, y });
  }, []);

  return (
    <div className="comparison-side without-optimization">
      <h3 className="comparison-title">❌ Without Throttling</h3>
      <br />

      <div className="profiler-metrics">
        <h4>Performance Metrics</h4>
        <div className="metric-card">
          <span className="metric-label">Events Fired:</span>
          <span className="metric-value-bad">{eventCount}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Updates:</span>
          <span className="metric-value-bad">{updateCount}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Throttle:</span>
          <span className="metric-phase">None</span>
        </div>
      </div>

      <div
        ref={boxRef}
        className="throttle-interaction-box"
        onMouseMove={handleMouseMove}
      >
        <div className="interaction-label">Move your mouse here</div>
        <div
          className="position-tracker"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
        />
        <div className="position-display">
          X: {Math.round(position.x)}px, Y: {Math.round(position.y)}px
        </div>
      </div>

      <div className="warning-note">
        <h4>⚠️ Performance Issues:</h4>
        <ul>
          <li>Updates on EVERY mouse move event</li>
          <li>Can fire 100+ times per second</li>
          <li>Excessive re-renders</li>
          <li>Wasted CPU and battery</li>
          <li>May cause jank on slower devices</li>
        </ul>
      </div>
    </div>
  );
};

// Component WITH throttling
const WithThrottle = ({ throttleDelay }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [updateCount, setUpdateCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const boxRef = useRef(null);

  const updatePosition = useCallback((x, y) => {
    setUpdateCount(prev => prev + 1);
    setPosition({ x, y });
  }, []);

  const throttledUpdate = useThrottle(updatePosition, throttleDelay);

  const handleMouseMove = useCallback((e) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setEventCount(prev => prev + 1);
    throttledUpdate(x, y);
  }, [throttledUpdate]);

  return (
    <div className="comparison-side with-optimization">
      <h3 className="comparison-title">✅ With Throttling</h3>
      <br />

      <div className="profiler-metrics">
        <h4>Performance Metrics</h4>
        <div className="metric-card">
          <span className="metric-label">Events Fired:</span>
          <span className="metric-value-good">{eventCount}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Updates:</span>
          <span className="metric-value-good">{updateCount}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Throttle:</span>
          <span className="metric-phase">{throttleDelay}ms</span>
        </div>
      </div>

      <div
        ref={boxRef}
        className="throttle-interaction-box"
        onMouseMove={handleMouseMove}
      >
        <div className="interaction-label">Move your mouse here</div>
        <div
          className="position-tracker"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
        />
        <div className="position-display">
          X: {Math.round(position.x)}px, Y: {Math.round(position.y)}px
        </div>
      </div>

      <div className="optimization-note">
        <h4>✅ Performance Benefits:</h4>
        <ul>
          <li>Updates at most once per {throttleDelay}ms</li>
          <li>Reduces updates by 80-95%</li>
          <li>Smoother performance</li>
          <li>Lower CPU usage</li>
          <li>Better battery life</li>
        </ul>
      </div>
    </div>
  );
};

const ThrottlingDemo = () => {
  const throttleTime = 100; // 100ms = max 10 updates per second

  return (
    <div className="demo-section">
      <h2>Throttling Optimization Demo</h2>
      <p className="demo-intro">
        Throttling limits how often a function can execute. Unlike debouncing (which waits
        for events to stop), throttling ensures execution at regular intervals. Perfect for
        scroll, resize, and mouse move handlers!
        <br />
        <strong>Move your mouse in both boxes</strong> and watch the update counters!
      </p>

      <div className="comparison-container">
        <WithThrottle throttleDelay={throttleTime} />
        <WithoutThrottle />
      </div>

      <div className="optimization-explanation">
        <h2>Understanding Throttling</h2>
        <div className="explanation-content">
          <h3>The Problem:</h3>
          <p>
            Events like mouse movement, scrolling, and window resizing can fire dozens or
            hundreds of times per second. Processing every single event can cause performance
            issues, especially if each event triggers expensive operations like calculations,
            API calls, or DOM updates.
          </p>

          <div className="visual-explanation">
            <div className="visual-box">
              <h4>With Throttling ({throttleTime}ms):</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">t=0ms: Mouse moves:</span>
                  <code>Handler executes ✅</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">t=50ms: Mouse moves:</span>
                  <code>Blocked (too soon) ⏸️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">t=100ms: Mouse moves:</span>
                  <code>Handler executes ✅</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">t=150ms: Mouse moves:</span>
                  <code>Blocked (too soon) ⏸️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Result:</span>
                  <code>Max 10 calls/second (from ~100+) 🎉</code>
                </div>
              </div>
            </div>

            <div className="visual-box">
              <h4>Without Throttling:</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">t=0ms: Mouse moves:</span>
                  <code>Handler executes ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">t=10ms: Mouse moves:</span>
                  <code>Handler executes ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">t=20ms: Mouse moves:</span>
                  <code>Handler executes ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">...continues...</span>
                  <code>100+ calls per second! 💀</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Result:</span>
                  <code>Excessive updates, poor performance 🐌</code>
                </div>
              </div>
            </div>
          </div>

          <h3>How Throttling Works:</h3>
          <p>
            Throttling ensures a function runs at most once per specified time period.
            When the function is called, it executes immediately if enough time has passed
            since the last execution. If not enough time has passed, the call is ignored
            or scheduled for later.
          </p>

          <h3>Performance Impact:</h3>
          <ul>
            <li><strong>Event Reduction:</strong> 80-95% fewer function calls</li>
            <li><strong>CPU Usage:</strong> Significantly lower processing load</li>
            <li><strong>Battery Life:</strong> Less power consumption on mobile</li>
            <li><strong>Frame Rate:</strong> Maintains smooth 60fps animations</li>
            <li><strong>Responsiveness:</strong> Prevents UI freezing</li>
          </ul>

          <div className="code-example">
            <h4>Code Implementation:</h4>
            <pre>
{`function useThrottle(callback, delay) {
  const lastRun = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();

    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]);
}

// Usage in component
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const updatePosition = useCallback((x, y) => {
    setPosition({ x, y });
  }, []);

  const throttledUpdate = useThrottle(updatePosition, 100);

  const handleMouseMove = (e) => {
    // This fires 100+ times/sec, but update runs max 10 times/sec
    throttledUpdate(e.clientX, e.clientY);
  };

  return <div onMouseMove={handleMouseMove}>...</div>;
}`}
            </pre>
          </div>

          <div className="best-practices">
            <h4>When to use Throttling:</h4>
            <ul>
              <li>Scroll event handlers (infinite scroll, parallax)</li>
              <li>Mouse move tracking (tooltips, drag operations)</li>
              <li>Window resize handlers (responsive layouts)</li>
              <li>Game loop updates (animation frames)</li>
              <li>Live drawing/canvas operations</li>
              <li>Real-time analytics tracking</li>
            </ul>
            <h4>Common throttle delays:</h4>
            <ul>
              <li><strong>Mouse/Touch:</strong> 50-100ms (10-20 fps)</li>
              <li><strong>Scroll:</strong> 100-200ms (5-10 fps)</li>
              <li><strong>Resize:</strong> 150-300ms</li>
              <li><strong>Analytics:</strong> 1000-5000ms</li>
            </ul>
          </div>

          <div className="real-world-example">
            <h4>Real-World Example:</h4>
            <p>
              Google Maps uses throttling for map panning. When you drag the map:
            </p>
            <ul>
              <li><strong>Without throttling:</strong> Mouse move fires 100+ times/sec, causing choppy rendering</li>
              <li><strong>With throttling (16ms):</strong> Updates at 60fps, smooth panning experience</li>
              <li><strong>Result:</strong> Silky smooth map navigation on all devices!</li>
            </ul>
          </div>

          <div className="comparison-note">
            <h4>Throttling vs Debouncing:</h4>
            <ul>
              <li><strong>Throttling:</strong> Guarantees execution at regular intervals (enforces rate limit)</li>
              <li><strong>Debouncing:</strong> Executes after events stop (waits for quiet period)</li>
              <li><strong>Use throttling for:</strong> Continuous events where you need regular updates (scroll, drag, resize)</li>
              <li><strong>Use debouncing for:</strong> Events where you only care about the final state (search input, auto-save)</li>
              <li><strong>Key difference:</strong> Throttle = "at most once per X ms", Debounce = "X ms after events stop"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThrottlingDemo;
