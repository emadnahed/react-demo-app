import React from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const App = () => {
  const todos = []; // Placeholder for todos

  return (
    <div className="app">
      <h1>Todo App</h1>
      <TodoForm />
      <TodoList todos={todos} />
    </div>
  );
};

export default App;
