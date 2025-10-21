import React from 'react';
import './PerformanceOptimization.css';

// Simulate a heavy component with lots of content and data
const HeavyComponent = () => {
  // Simulate some expensive data processing
  const generateData = () => {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        id: i,
        title: `Item ${i}`,
        description: `This is a description for item ${i}. It contains some text to make the component heavier.`,
        value: Math.random() * 1000,
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <div className="heavy-component">
      <div className="heavy-header">
        <h3>📦 Heavy Component Loaded!</h3>
        <p className="component-size">~50KB Component</p>
      </div>

      <div className="heavy-content">
        <div className="info-section">
          <h4>🎉 This is a simulated heavy component</h4>
          <p>In a real app, this could be:</p>
          <ul>
            <li>A large charting library (Chart.js, D3.js)</li>
            <li>A rich text editor (Draft.js, Slate)</li>
            <li>A complex data table (AG Grid)</li>
            <li>A 3D visualization library (Three.js)</li>
            <li>A PDF viewer or generator</li>
          </ul>
        </div>

        <div className="data-grid">
          {data.slice(0, 20).map(item => (
            <div key={item.id} className="data-card">
              <h5>{item.title}</h5>
              <p>{item.description}</p>
              <span className="value">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="feature-list">
          <h4>Component Features:</h4>
          <div className="features">
            <span className="badge">Data Processing</span>
            <span className="badge">Complex UI</span>
            <span className="badge">Interactive Elements</span>
            <span className="badge">Heavy Dependencies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeavyComponent;
