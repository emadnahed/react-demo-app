import React, { useState, Suspense, lazy } from 'react';
import './PerformanceOptimization.css';

// ✅ LAZY LOADING: Component is only loaded when needed
const HeavyComponent = lazy(() => {
  // Simulate network delay to show loading state
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(import('./HeavyComponent'));
    }, 1500); // 1.5 second delay to simulate loading
  });
});

const WithLazyDemo = () => {
  const [showHeavy, setShowHeavy] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState(null);
  const [loadEndTime, setLoadEndTime] = useState(null);

  const handleLoadComponent = () => {
    setLoadStartTime(Date.now());
    setShowHeavy(true);
  };

  const handleComponentLoaded = () => {
    setLoadEndTime(Date.now());
  };

  const loadTime = loadStartTime && loadEndTime ? ((loadEndTime - loadStartTime) / 1000).toFixed(2) : null;

  return (
    <div className="comparison-side with-optimization">
      <h3 className="comparison-title">✅ With Code Splitting (React.lazy)</h3>
      <br/>
      <div className="parent-component">
        <h4>Main Component</h4>

        <div className="render-info">
          <p className="bundle-info">
            <strong>Initial Bundle:</strong> <span className="size-small">~10KB</span>
            <span className="ref-badge stable">SMALL</span>
          </p>
          {showHeavy && (
            <p className="bundle-info">
              <strong>Loaded on Demand:</strong> <span className="size-medium">+50KB</span>
              <span className="ref-badge">LAZY</span>
            </p>
          )}
          {loadTime && (
            <p className="load-time">
              <strong>Load Time:</strong> <span className="time">{loadTime}s</span>
            </p>
          )}
        </div>

        {!showHeavy && (
          <div className="info-box small">
            <p>
              <strong>🚀 Initial load is fast!</strong>
            </p>
            <ul>
              <li>✅ Heavy component NOT loaded yet</li>
              <li>✅ Smaller initial bundle size</li>
              <li>✅ Faster initial page load</li>
              <li>✅ Component loaded only when needed</li>
            </ul>
          </div>
        )}

        <div className="counter-section">
          {!showHeavy ? (
            <button
              className="counter-btn"
              onClick={handleLoadComponent}
            >
              Load Heavy Component
            </button>
          ) : (
            <button
              className="counter-btn secondary-btn"
              onClick={() => {
                setShowHeavy(false);
                setLoadStartTime(null);
                setLoadEndTime(null);
              }}
            >
              Unload Component
            </button>
          )}
        </div>
      </div>

      {showHeavy && (
        <div className="lazy-container">
          <Suspense
            fallback={
              <div className="loading-fallback">
                <div className="spinner"></div>
                <p>Loading component...</p>
                <small>Downloading and parsing JavaScript bundle</small>
              </div>
            }
          >
            <div onLoad={handleComponentLoaded}>
              <HeavyComponent />
            </div>
          </Suspense>
        </div>
      )}

      {showHeavy && (
        <div className="optimization-note">
          <h4>✅ Optimization Benefits:</h4>
          <ul>
            <li>Component code downloaded only when clicked</li>
            <li>Initial page load was faster (smaller bundle)</li>
            <li>User sees loading state during download</li>
            <li>Better for infrequently used features</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WithLazyDemo;
