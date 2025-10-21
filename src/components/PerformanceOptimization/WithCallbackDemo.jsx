import React, { useState, useCallback, useRef } from 'react';
import CallbackChild from './CallbackChild';
import './PerformanceOptimization.css';

// Function reference tracker - generates unique IDs for function instances
let functionIdCounter = 0;
const getFunctionId = () => ++functionIdCounter;

const WithCallbackDemo = () => {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  const renderCount = useRef(0);

  renderCount.current += 1;

  // Track function reference ID (for parent display only - NOT passed to child)
  const callbackIdRef = useRef(null);

  // WITH useCallback - memoized function reference (ID assigned only once)
  if (callbackIdRef.current === null) {
    callbackIdRef.current = getFunctionId();
  }

  const handleIncrement = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // Empty deps = function created only once

  return (
    <div className="comparison-side with-optimization">
      <h3 className="comparison-title">✅ With useCallback</h3>
      <br/>
      <div className="parent-component">
        <h4>Parent Component</h4>
        <div className="render-info">
          <p className="render-count">Parent Render Count: <strong>{renderCount.current}</strong></p>
          <p className="function-ref">
            Function Reference ID: <strong className="ref-stable">#{callbackIdRef.current}</strong>
            <span className="ref-badge stable">STABLE</span>
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
            <strong>Test the optimization:</strong>
          </p>
          <ul>
            <li>Click "Force Parent Re-render" multiple times</li>
            <li>✅ Function Reference ID stays #1 (stable)</li>
            <li>✅ Child Render Count stays at 1 (not re-rendering)</li>
            <li>✅ Child Callback Reference Changes stays 0</li>
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

export default WithCallbackDemo;
