import React, { useRef } from 'react';
import './PerformanceOptimization.css';

const MemoizedChild = ({ isCountGreaterThanFive }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="child-component">
      <h3>Child Component (Memoized with React.memo)</h3>
      <div className="render-info">
        <p className="render-count">Child Render Count: <strong>{renderCount.current}</strong></p>
        <p className="prop-status">
          isCountGreaterThanFive: <strong className={isCountGreaterThanFive ? 'true' : 'false'}>
            {isCountGreaterThanFive.toString()}
          </strong>
        </p>
      </div>
      {isCountGreaterThanFive && (
        <div className="alert-message">
          🎉 Parent counter exceeded 5! Child component re-rendered because prop changed!
        </div>
      )}
      <div className="explanation">
        <p>
          ℹ️ This component is wrapped in React.memo and only re-renders when
          the <code>isCountGreaterThanFive</code> prop changes.
        </p>
      </div>
    </div>
  );
};

// Wrapping the component with React.memo to prevent unnecessary re-renders
export default React.memo(MemoizedChild);
