import React, { useState, useRef } from 'react';
import MemoizedChild from './MemoizedChild';
import './PerformanceOptimization.css';

const ReactMemoDemo = () => {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;

  const isCountGreaterThanFive = count > 5;

  return (
    <div className="demo-section">
      <h2>React.memo Optimization Demo</h2>
      <p className="demo-intro">
        Demonstrating how React.memo prevents unnecessary re-renders when props haven't changed.
      </p>

      <div className="content-wrapper">
        <div className="parent-component">
          <h3>Parent Component</h3>
          <div className="render-info">
            <p className="render-count">Parent Render Count: <strong>{renderCount.current}</strong></p>
          </div>

          <div className="counter-section">
            <p className="counter-display">Current Count: <strong>{count}</strong></p>
            <button
              className="counter-btn"
              onClick={() => setCount(count + 1)}
            >
              Increment Counter
            </button>
            <button
              className="counter-btn reset-btn"
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>

          <div className="info-box">
            <h4>What's happening?</h4>
            <ul>
              <li>Click "Increment Counter" to increase the parent's counter</li>
              <li>Parent re-renders on every click (watch Parent Render Count)</li>
              <li>Child component <strong>does NOT</strong> re-render until count exceeds 5</li>
              <li>Once count {'>'} 5, the <code>isCountGreaterThanFive</code> prop changes from false to true</li>
              <li>This prop change triggers the child to re-render (watch Child Render Count)</li>
            </ul>
          </div>
        </div>

        <MemoizedChild isCountGreaterThanFive={isCountGreaterThanFive} />

        <div className="optimization-explanation">
          <h3>React.memo Optimization</h3>
          <div className="explanation-content">
            <h4>Before Optimization:</h4>
            <p>
              Without React.memo, the child component would re-render every time the parent
              re-renders, even if its props haven't changed. This causes unnecessary work.
            </p>

            <h4>After Optimization:</h4>
            <p>
              With React.memo, React performs a shallow comparison of props. If the props
              haven't changed, React skips rendering the component and reuses the last
              rendered result.
            </p>

            <h4>Performance Impact:</h4>
            <ul>
              <li><strong>Reduced Re-renders:</strong> Child only renders when props actually change</li>
              <li><strong>Better Performance:</strong> Especially important for complex child components</li>
              <li><strong>Preserved State:</strong> Internal state and refs in child remain intact</li>
            </ul>

            <div className="code-example">
              <h4>Code Implementation:</h4>
              <pre>
{`// Without optimization
const Child = ({ prop }) => {
  return <div>{prop}</div>;
};

// With React.memo
const Child = React.memo(({ prop }) => {
  return <div>{prop}</div>;
});

// With custom comparison
const Child = React.memo(({ prop }) => {
  return <div>{prop}</div>;
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip render)
  return prevProps.prop === nextProps.prop;
});`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactMemoDemo;
