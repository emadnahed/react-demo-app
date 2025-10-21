import React, { useState } from 'react';
import HeavyComponent from './HeavyComponent';
import './PerformanceOptimization.css';

// ❌ EAGER LOADING: Component is loaded immediately with the main bundle
const WithoutLazyDemo = () => {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div className="comparison-side without-optimization">
      <h3 className="comparison-title">❌ Without Code Splitting (Eager Loading)</h3>
      <br/>
      <div className="parent-component">
        <h4>Main Component</h4>

        <div className="render-info">
          <p className="bundle-info">
            <strong>Initial Bundle:</strong> <span className="size-large">~60KB</span>
            <span className="ref-badge changing">LARGE</span>
          </p>
          <p className="bundle-warning">
            ⚠️ Heavy component included in initial bundle
          </p>
        </div>

        <div className="info-box small warning">
          <p>
            <strong>⚠️ Initial load is slower!</strong>
          </p>
          <ul>
            <li>❌ Heavy component loaded immediately</li>
            <li>❌ Larger initial bundle size (60KB vs 10KB)</li>
            <li>❌ Slower initial page load</li>
            <li>❌ User downloads code they might not use</li>
          </ul>
        </div>

        <div className="counter-section">
          {!showHeavy ? (
            <button
              className="counter-btn"
              onClick={() => setShowHeavy(true)}
            >
              Show Heavy Component
            </button>
          ) : (
            <button
              className="counter-btn secondary-btn"
              onClick={() => setShowHeavy(false)}
            >
              Hide Component
            </button>
          )}
        </div>
      </div>

      {showHeavy && (
        <div className="eager-container">
          <HeavyComponent />
        </div>
      )}

      {showHeavy && (
        <div className="optimization-note warning-note">
          <h4>❌ Performance Issues:</h4>
          <ul>
            <li>Component code was downloaded on initial page load</li>
            <li>Increased initial bundle size by ~50KB</li>
            <li>No loading state needed (already loaded)</li>
            <li>Wasteful if user never clicks the button</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WithoutLazyDemo;
