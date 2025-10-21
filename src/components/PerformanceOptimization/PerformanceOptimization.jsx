import React, { useState } from 'react';
import ReactMemoDemo from './ReactMemoDemo';
import UseCallbackDemo from './UseCallbackDemo';
import UseMemoDemo from './UseMemoDemo';
import CodeSplittingDemo from './CodeSplittingDemo';
import DebouncingDemo from './DebouncingDemo';
import ProfilerDemo from './ProfilerDemo';
import VirtualScrollingDemo from './VirtualScrollingDemo';
import UseTransitionDemo from './UseTransitionDemo';
import ThrottlingDemo from './ThrottlingDemo';
import './PerformanceOptimization.css';

// SVG Icon Components
const MemoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
  </svg>
);

const CallbackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/>
  </svg>
);

const UseMemoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" fill="currentColor"/>
  </svg>
);

const CodeSplitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="currentColor"/>
  </svg>
);

const DebounceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="currentColor"/>
  </svg>
);

const ProfilerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
  </svg>
);

const VirtualScrollIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor"/>
  </svg>
);

const TransitionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 6v12l10-6z" fill="currentColor"/>
    <path d="M3 18h2V6H3v12zm16-12v12h2V6h-2z" fill="currentColor"/>
  </svg>
);

const ThrottleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14.5l-4.5-2.71-4.5 2.71V7h9v9.5z" fill="currentColor"/>
  </svg>
);

const PerformanceOptimization = () => {
  const [activeTab, setActiveTab] = useState('memo');

  const tabs = [
    { id: 'memo', label: 'React.memo', icon: <MemoIcon /> },
    { id: 'callback', label: 'useCallback', icon: <CallbackIcon /> },
    { id: 'useMemo', label: 'useMemo', icon: <UseMemoIcon /> },
    { id: 'lazy', label: 'Code Splitting', icon: <CodeSplitIcon /> },
    { id: 'debounce', label: 'Debouncing', icon: <DebounceIcon /> },
    { id: 'throttle', label: 'Throttling', icon: <ThrottleIcon /> },
    { id: 'virtual', label: 'Virtual Scrolling', icon: <VirtualScrollIcon /> },
    { id: 'transition', label: 'useTransition', icon: <TransitionIcon /> },
    { id: 'profiler', label: 'React Profiler', icon: <ProfilerIcon /> },
  ];

  return (
    <div className="performance-container">
      <div className="performance-header">
        <h1>React Performance Optimization</h1>
        <p className="subtitle">Learn and compare different React optimization techniques</p>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-icon">{tab.icon}</div>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tabs-content">
          {activeTab === 'memo' && <ReactMemoDemo />}
          {activeTab === 'callback' && <UseCallbackDemo />}
          {activeTab === 'useMemo' && <UseMemoDemo />}
          {activeTab === 'lazy' && <CodeSplittingDemo />}
          {activeTab === 'debounce' && <DebouncingDemo />}
          {activeTab === 'throttle' && <ThrottlingDemo />}
          {activeTab === 'virtual' && <VirtualScrollingDemo />}
          {activeTab === 'transition' && <UseTransitionDemo />}
          {activeTab === 'profiler' && <ProfilerDemo />}
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimization;
