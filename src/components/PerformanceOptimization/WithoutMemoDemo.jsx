import React, { useState, useRef } from 'react';
import './PerformanceOptimization.css';

// Expensive calculation - Fibonacci sequence
const calculateFibonacci = (num) => {
  console.log('🔄 Calculating fibonacci for:', num);
  if (num <= 1) return num;
  return calculateFibonacci(num - 1) + calculateFibonacci(num - 2);
};

const WithoutMemoDemo = () => {
  const [count, setCount] = useState(5);
  const [otherState, setOtherState] = useState(0);
  const renderCount = useRef(0);
  const calculationCount = useRef(0);

  renderCount.current += 1;

  // WITHOUT useMemo - calculation runs on EVERY render
  calculationCount.current += 1;
  const fibonacci = calculateFibonacci(count);

  return (
    <div className="comparison-side without-optimization">
      <h3 className="comparison-title">❌ Without useMemo</h3>
      <br/>
      <div className="parent-component">
        <h4>Component</h4>
        <div className="render-info">
          <p className="render-count">Component Render Count: <strong>{renderCount.current}</strong></p>
          <p className="calculation-count">
            Expensive Calculation Runs: <strong className="calc-changing">{calculationCount.current}</strong>
            <span className="ref-badge changing">WASTEFUL</span>
          </p>
        </div>

        <div className="calculation-result">
          <h4>Fibonacci Result:</h4>
          <p className="result-display">
            fibonacci({count}) = <strong>{fibonacci}</strong>
          </p>
        </div>

        <div className="counter-section">
          <p className="counter-display">Number: <strong>{count}</strong></p>
          <div className="button-group">
            <button
              className="counter-btn"
              onClick={() => setCount(Math.max(1, count - 1))}
              disabled={count <= 1}
            >
              Decrease
            </button>
            <button
              className="counter-btn"
              onClick={() => setCount(Math.min(20, count + 1))}
              disabled={count >= 20}
            >
              Increase
            </button>
          </div>
        </div>

        <div className="counter-section">
          <p className="counter-display">Other State: <strong>{otherState}</strong></p>
          <button
            className="counter-btn secondary-btn"
            onClick={() => setOtherState(otherState + 1)}
          >
            Force Component Re-render
          </button>
        </div>

        <div className="info-box small">
          <p>
            <strong>See the problem:</strong>
          </p>
          <ul>
            <li>Click "Force Component Re-render" multiple times</li>
            <li>❌ Component Render Count increases</li>
            <li>❌ Calculation Runs ALSO increases (recalculating unnecessarily)</li>
            <li>❌ Same calculation runs again even though input didn't change</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WithoutMemoDemo;
