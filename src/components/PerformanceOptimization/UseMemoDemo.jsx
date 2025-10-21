import React from 'react';
import WithMemoDemo from './WithMemoDemo';
import WithoutMemoDemo from './WithoutMemoDemo';
import './PerformanceOptimization.css';

const UseMemoDemo = () => {
  return (
    <div className="demo-section">
      <h2>useMemo Optimization Demo</h2>
      <p className="demo-intro">
        Watch the <strong>Expensive Calculation Runs</strong> counter to see when the fibonacci calculation executes.
        useMemo caches the result and only recalculates when dependencies change.
        <br />
        <strong>Each side is completely independent</strong> - test them separately!
      </p>

      <div className="comparison-container">
        {/* WITH useMemo - completely independent component */}
        <WithMemoDemo />

        {/* WITHOUT useMemo - completely independent component */}
        <WithoutMemoDemo />
      </div>

      <div className="optimization-explanation">
        <h2>Understanding useMemo</h2>
        <div className="explanation-content">
          <h3>The Problem:</h3>
          <p>
            React components re-render when state changes. During each render, all code in the component
            body executes again - including expensive calculations. If the calculation's inputs haven't
            changed, this is wasteful!
          </p>

          <div className="visual-explanation">
            <div className="visual-box">
              <h4>With useMemo:</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">Render 1 (count=5):</span>
                  <code>Calculate fibonacci(5) → 5 ✅ (cached)</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Render 2 (count=5, other changed):</span>
                  <code>Return cached result → 5 ✅ (NO calculation!)</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Render 3 (count=6):</span>
                  <code>Calculate fibonacci(6) → 8 ✅ (recalculate, cache new result)</code>
                </div>
              </div>
            </div>

            <div className="visual-box">
              <h4>Without useMemo (Every Render):</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">Render 1 (count=5):</span>
                  <code>Calculate fibonacci(5) → 5 ⚠️</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Render 2 (count=5, other changed):</span>
                  <code>Calculate fibonacci(5) → 5 ⚠️ (WASTEFUL!)</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Render 3 (count=6):</span>
                  <code>Calculate fibonacci(6) → 8 ⚠️</code>
                </div>
              </div>
            </div>
          </div>

          <h3>How useMemo Works:</h3>
          <p>
            <code>useMemo</code> takes two arguments: a calculation function and a dependency array.
            It runs the calculation on the first render and caches the result. On subsequent renders,
            it only recalculates if any dependency has changed - otherwise it returns the cached value.
          </p>

          <h3>Performance Impact:</h3>
          <ul>
            <li><strong>Skips Expensive Calculations:</strong> Cached results are returned instantly</li>
            <li><strong>Reduces CPU Usage:</strong> Especially important for complex computations</li>
            <li><strong>Improves Responsiveness:</strong> Components re-render faster</li>
            <li><strong>Smart Dependency Tracking:</strong> Only recalculates when needed</li>
          </ul>

          <div className="code-example">
            <h4>Code Implementation:</h4>
            <pre>
{`// WITHOUT useMemo - calculates on EVERY render
const ExpensiveComponent = ({ number }) => {
  const result = calculateFibonacci(number);
  // Fibonacci runs on every render, even if 'number' unchanged!

  return <div>{result}</div>;
};

// WITH useMemo - calculates only when dependency changes
const ExpensiveComponent = ({ number }) => {
  const result = useMemo(() => {
    return calculateFibonacci(number);
  }, [number]); // Only recalculate when 'number' changes

  return <div>{result}</div>;
};`}
            </pre>
          </div>

          <div className="best-practices">
            <h4>When to use useMemo:</h4>
            <ul>
              <li>Expensive calculations (data transformations, filtering, sorting large arrays)</li>
              <li>Complex object/array creation that's used as a dependency in other hooks</li>
              <li>Preventing unnecessary re-renders in child components (referential equality)</li>
              <li>Processing large datasets or running algorithms</li>
            </ul>
            <h4>When NOT to use useMemo:</h4>
            <ul>
              <li>Simple, fast calculations (overhead of memoization isn't worth it)</li>
              <li>Values that change on every render anyway</li>
              <li>Premature optimization - measure first, optimize later</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseMemoDemo;
