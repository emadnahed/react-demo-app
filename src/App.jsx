import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Navbar from './components/Navbar';
import CatGallery from './components/CatGallery';
import FormValidation from './components/FormValidation/FormValidation';
import PerformanceOptimization from './components/PerformanceOptimization/PerformanceOptimization';

const AppContent = () => {
  const [todos, setTodos] = useState(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      return [];
    }
  });
  const [filter, setFilter] = useState('all');

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    console.log('Saving to localStorage:', todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // ✅ OPTIMIZATION: useCallback to memoize callback functions
  // Prevents TodoItem components from re-rendering unnecessarily
  const addTodo = useCallback((title, description) => {
    const newTodo = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, []); // No dependencies - function never changes

  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []); // No dependencies - function never changes

  const toggleComplete = useCallback((id) => {
    setTodos(prevTodos => prevTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // No dependencies - function never changes

  // ✅ OPTIMIZATION: useMemo to cache filtered todos
  // Only recalculates when todos or filter changes
  const filteredTodos = useMemo(() => {
    console.log('📊 Filtering todos...');
    return todos.filter(todo => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'incomplete') return !todo.completed;
      return true;
    });
  }, [todos, filter]);

  // ✅ OPTIMIZATION: useMemo to cache stats calculation
  // Only recalculates when todos array changes
  const stats = useMemo(() => {
    console.log('📈 Calculating stats...');
    return {
      total: todos.length,
      completed: todos.filter(todo => todo.completed).length,
      incomplete: todos.filter(todo => !todo.completed).length
    };
  }, [todos]);

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="app">
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <div className="app-header">
                  <h1 className="app-title">My Todo List</h1>
                  <p className="app-subtitle">Stay organized and productive</p>
                </div>
                
                <div className="stats-container">
                  <div className="stat-card">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{stats.completed}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{stats.incomplete}</span>
                    <span className="stat-label">Pending</span>
                  </div>
                </div>

                <div className="filter-container">
                  <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                  >
                    Completed
                  </button>
                  <button
                    className={`filter-btn ${filter === 'incomplete' ? 'active' : ''}`}
                    onClick={() => setFilter('incomplete')}
                  >
                    Pending
                  </button>
                </div>

                <div className="content-grid">
                  <TodoForm addTodo={addTodo} />
                  <TodoList todos={filteredTodos} deleteTodo={deleteTodo} toggleComplete={toggleComplete} />
                </div>
              </>
            } 
          />
          <Route 
            path="/cats" 
            element={<CatGallery />} 
          />
          <Route
            path="/form-validation"
            element={<FormValidation />}
          />
          <Route
            path="/performance"
            element={<PerformanceOptimization />}
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
