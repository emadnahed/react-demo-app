import React from 'react';
import WithCallbackDemo from './WithCallbackDemo';
import WithoutCallbackDemo from './WithoutCallbackDemo';
import './PerformanceOptimization.css';

const UseCallbackDemo = () => {
  return (
    <div className="demo-section">
      <h2>useCallback Optimization Demo</h2>
      <p className="demo-intro">
        Watch the <strong>Function Reference ID</strong> to see when new functions are created.
        The ID changes every time a new function instance is created in memory.
        <br />
        <strong>Each side is completely independent</strong> - test them separately!
      </p>

      <div className="comparison-container">
        {/* WITH useCallback - completely independent component */}
        <WithCallbackDemo />

        {/* WITHOUT useCallback - completely independent component */}
        <WithoutCallbackDemo />
      </div>

      <div className="optimization-explanation">
        <h2>Understanding Function References</h2>
        <div className="explanation-content">
          <h3>The Problem:</h3>
          <p>
            In JavaScript, functions are objects. Every time a component re-renders,
            functions defined inside are recreated as NEW objects in memory - even if
            they do the exact same thing!
          </p>

          <div className="visual-explanation">
            <div className="visual-box">
              <h4>With useCallback:</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">Render 1:</span>
                  <code>useCallback(() => {'{ }'}, []) // Reference ID: #1</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Render 2:</span>
                  <code>// Returns SAME function // Reference ID: #1 ✅</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Render 3:</span>
                  <code>// Returns SAME function // Reference ID: #1 ✅</code>
                </div>
              </div>
            </div>

            <div className="visual-box">
              <h4>Without useCallback (Every Render):</h4>
              <div className="code-flow">
                <div className="flow-step">
                  <span className="flow-label">Render 1:</span>
                  <code>function handleClick() {'{ }'} // Reference ID: #1001</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Render 2:</span>
                  <code>function handleClick() {'{ }'} // Reference ID: #1002 ⚠️ NEW!</code>
                </div>
                <div className="flow-step">
                  <span className="flow-label">Render 3:</span>
                  <code>function handleClick() {'{ }'} // Reference ID: #1003 ⚠️ NEW!</code>
                </div>
              </div>
            </div>
          </div>

          <h3>Why This Matters for React.memo:</h3>
          <p>
            When a child component is wrapped in <code>React.memo</code>, React compares
            the props using shallow equality (===). If you pass a function that's recreated
            every render, React sees it as a "different" prop and re-renders the child.
          </p>

          <h3>Performance Impact:</h3>
          <ul>
            <li><strong>Stable References:</strong> Function identity remains constant across renders</li>
            <li><strong>Prevents Cascading Re-renders:</strong> Memoized children don't re-render unnecessarily</li>
            <li><strong>Essential for React.memo:</strong> Without useCallback, React.memo is useless for function props</li>
            <li><strong>Optimizes Dependencies:</strong> Prevents infinite loops in useEffect and other hooks</li>
          </ul>

          <div className="code-example">
            <h4>Code Implementation:</h4>
            <pre>
{`// WITHOUT useCallback - NEW function every render
const ParentComponent = () => {
  const [count, setCount] = useState(0);

  // This function is recreated on EVERY render
  const handleClick = () => {
    setCount(c => c + 1);
  };

  return <MemoizedChild onClick={handleClick} />;
  // Child re-renders even though it's memoized!
};

// WITH useCallback - SAME function across renders
const ParentComponent = () => {
  const [count, setCount] = useState(0);

  // This function is created ONCE and reused
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Empty deps = never recreated

  return <MemoizedChild onClick={handleClick} />;
  // Child only re-renders when truly needed!
};`}
            </pre>
          </div>

          <div className="best-practices">
            <h4>When to use useCallback:</h4>
            <ul>
              <li>Passing callbacks to memoized child components (React.memo)</li>
              <li>Functions used as dependencies in useEffect, useMemo, or other hooks</li>
              <li>Event handlers passed to expensive child components</li>
              <li>Functions passed to context providers</li>
            </ul>
            <h4>When NOT to use useCallback:</h4>
            <ul>
              <li>Simple event handlers that aren't passed as props</li>
              <li>Functions in components that rarely re-render</li>
              <li>When the memoization cost exceeds the benefit</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCallbackDemo;
