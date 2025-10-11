import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, deleteTodo, toggleComplete }) => {
  if (todos.length === 0) {
    return (
      <div className="todo-list">
        <div className="empty-state">
          <svg className="empty-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
            <path d="M32 20V32L40 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3 className="empty-title">No todos yet</h3>
          <p className="empty-message">Add your first todo to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleComplete={toggleComplete}
        />
      ))}
    </div>
  );
};

export default TodoList;
