import React from 'react';
import WithLazyDemo from './WithLazyDemo';
import WithoutLazyDemo from './WithoutLazyDemo';
import './PerformanceOptimization.css';

const CodeSplittingDemo = () => {
  return (
    <div className="demo-section">
      <h2>Code Splitting Optimization Demo</h2>
      <p className="demo-intro">
        Watch the <strong>Initial Bundle Size</strong> and <strong>Load Time</strong> to see the impact of code splitting.
        React.lazy() allows you to load components on-demand, reducing initial bundle size.
        <br />
        <strong>Each side is completely independent</strong> - test them separately!
      </p>

      <div className="comparison-container">
        {/* WITH React.lazy - completely independent component */}
        <WithLazyDemo />

        {/* WITHOUT React.lazy - completely independent component */}
        <WithoutLazyDemo />
      </div>

      <div className="optimization-explanation">
        <h2>Understanding Code Splitting</h2>
        <div className="explanation-content">
          <h3>The Problem:</h3>
          <p>
            Modern web apps bundle all JavaScript into a single file. As your app grows, this bundle
            becomes huge, causing slow initial page loads. Users download code for features they might
            never use!
          </p>

          <div className="visual-explanation">
            <div className="visual-box">
              <h4>With Code Splitting (React.lazy):</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">Initial Load:</span>
                  <code>main.js (10KB) ✅ Fast!</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User clicks button:</span>
                  <code>Loading... (Suspense fallback shown)</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Component loads:</span>
                  <code>HeavyComponent.chunk.js (50KB) downloaded ✅</code>
                </div>
              </div>
            </div>

            <div className="visual-box">
              <h4>Without Code Splitting (Eager):</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">Initial Load:</span>
                  <code>main.js (60KB) ⚠️ Slow!</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">User clicks button:</span>
                  <code>Component shows instantly (already loaded)</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Problem:</span>
                  <code>User waited longer initially for code they might not use ❌</code>
                </div>
              </div>
            </div>
          </div>

          <h3>How React.lazy Works:</h3>
          <p>
            <code>React.lazy()</code> takes a function that dynamically imports a component.
            React bundles this component separately and only loads it when needed. Combined with
            <code>Suspense</code>, you can show a loading state while the component downloads.
          </p>

          <h3>Performance Impact:</h3>
          <ul>
            <li><strong>Smaller Initial Bundle:</strong> Only load what's needed upfront (10KB vs 60KB)</li>
            <li><strong>Faster Initial Load:</strong> Users see content sooner</li>
            <li><strong>Better Caching:</strong> Separate bundles cache independently</li>
            <li><strong>Improved UX:</strong> Loading states keep users informed</li>
          </ul>

          <div className="code-example">
            <h4>Code Implementation:</h4>
            <pre>
{`// WITHOUT Code Splitting - eager import
import HeavyComponent from './HeavyComponent';
// Component bundled with main app immediately

function App() {
  return <HeavyComponent />;
}

// WITH Code Splitting - lazy import
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));
// Component bundled separately, loaded on demand

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}`}
            </pre>
          </div>

          <div className="best-practices">
            <h4>When to use Code Splitting:</h4>
            <ul>
              <li>Route-based splitting (load each page separately)</li>
              <li>Modal dialogs and popups (load when opened)</li>
              <li>Tabs or accordion content (load when selected)</li>
              <li>Heavy libraries (charts, editors, 3D graphics)</li>
              <li>Admin panels or authenticated-only features</li>
            </ul>
            <h4>When NOT to use Code Splitting:</h4>
            <ul>
              <li>Small, frequently-used components</li>
              <li>Components needed immediately on page load</li>
              <li>When the loading state would hurt UX</li>
              <li>Components smaller than ~10KB</li>
            </ul>
          </div>

          <div className="real-world-example">
            <h4>Real-World Example:</h4>
            <p>
              Imagine a dashboard app with a data visualization feature. The Chart.js library
              is ~200KB. Most users just view text data. With code splitting:
            </p>
            <ul>
              <li>Initial load: 50KB (dashboard without charts)</li>
              <li>User clicks "View Chart": +200KB (chart library loads)</li>
              <li><strong>Result:</strong> 75% of users who never view charts save 200KB!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSplittingDemo;
