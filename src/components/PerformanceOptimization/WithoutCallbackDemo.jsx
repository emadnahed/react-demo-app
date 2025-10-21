import React, { useState, useRef } from 'react';
import CallbackChild from './CallbackChild';
import './PerformanceOptimization.css';

// Function reference tracker - generates unique IDs for function instances
let functionIdCounter = 1000; // Start from 1000 to differentiate from the "with" demo
const getFunctionId = () => ++functionIdCounter;

const WithoutCallbackDemo = () => {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  const renderCount = useRef(0);

  renderCount.current += 1;

  // Track function reference ID (for parent display only - NOT passed to child)
  const callbackIdRef = useRef(null);

  // WITHOUT useCallback - new function reference on EVERY render
  callbackIdRef.current = getFunctionId(); // New ID every render!

  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div className="comparison-side without-optimization">
      <h3 className="comparison-title">❌ Without useCallback</h3>
      <br/>
      <div className="parent-component">
        <h4>Parent Component</h4>
        <div className="render-info">
          <p className="render-count">Parent Render Count: <strong>{renderCount.current}</strong></p>
          <p className="function-ref">
            Function Reference ID: <strong className="ref-changing">#{callbackIdRef.current}</strong>
            <span className="ref-badge changing">CHANGES</span>
          </p>
        </div>

        <div className="counter-section">
          <p className="counter-display">Count: <strong>{count}</strong></p>
          <button
            className="counter-btn"
            onClick={handleIncrement}
          >
            Increment Count
          </button>
        </div>

        <div className="counter-section">
          <p className="counter-display">Other State: <strong>{otherState}</strong></p>
          <button
            className="counter-btn secondary-btn"
            onClick={() => setOtherState(otherState + 1)}
          >
            Force Parent Re-render
          </button>
        </div>

        <div className="info-box small">
          <p>
            <strong>See the problem:</strong>
          </p>
          <ul>
            <li>Click "Force Parent Re-render" multiple times</li>
            <li>❌ Function Reference ID keeps changing</li>
            <li>❌ Child Render Count increases unnecessarily</li>
            <li>❌ Child Callback Reference Changes keeps increasing</li>
          </ul>
        </div>
      </div>

      {/* Only pass onIncrement and count - NOT the reference ID */}
      <CallbackChild
        onIncrement={handleIncrement}
        count={count}
      />
    </div>
  );
};

export default WithoutCallbackDemo;
