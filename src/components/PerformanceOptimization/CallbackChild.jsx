import React, { useRef, useEffect, useState } from 'react';
import './PerformanceOptimization.css';

const CallbackChild = ({ onIncrement, count }) => {
  const renderCount = useRef(0);
  const [callbackChangeCount, setCallbackChangeCount] = useState(0);
  const prevCallbackRef = useRef(onIncrement);

  renderCount.current += 1;

  // Track when the callback reference actually changes
  useEffect(() => {
    if (prevCallbackRef.current !== onIncrement) {
      setCallbackChangeCount(prev => prev + 1);
      prevCallbackRef.current = onIncrement;
    }
  }, [onIncrement]);

  return (
    <div className="child-component">
      <h3>Child Component (React.memo)</h3>
      <div className="render-info">
        <p className="render-count">Child Render Count: <strong>{renderCount.current}</strong></p>
        <p className="function-ref">
          Callback Reference Changes: <strong className={callbackChangeCount > 0 ? 'ref-changing' : 'ref-stable'}>
            {callbackChangeCount} time{callbackChangeCount !== 1 ? 's' : ''}
          </strong>
        </p>
      </div>

      {callbackChangeCount > 0 && (
        <div className="alert-message warning">
          ⚠️ Callback reference changed {callbackChangeCount} time{callbackChangeCount !== 1 ? 's' : ''} - causing {callbackChangeCount} unnecessary re-render{callbackChangeCount !== 1 ? 's' : ''}!
        </div>
      )}

      {callbackChangeCount === 0 && renderCount.current > 1 && (
        <div className="alert-message">
          ✅ Parent re-rendered but child stayed stable! No unnecessary re-renders.
        </div>
      )}

      <div className="child-actions">
        <p className="prop-status">
          Current Count: <strong className="count-value">{count}</strong>
        </p>
        <button className="counter-btn child-btn" onClick={onIncrement}>
          Increment from Child
        </button>
      </div>

      <div className="explanation">
        <p>
          ℹ️ This component is wrapped in <code>React.memo</code>. It re-renders when:
        </p>
        <ul>
          <li>The <code>count</code> prop changes (expected ✅)</li>
          <li>The <code>onIncrement</code> function reference changes (should be avoided with useCallback ⚠️)</li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(CallbackChild);
