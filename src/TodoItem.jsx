import React from 'react';

const TodoItem = ({ todo, deleteTodo, toggleComplete }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-checkbox-wrapper">
        <input
          type="checkbox"
          id={`todo-${todo.id}`}
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
        />
        <label htmlFor={`todo-${todo.id}`} className="checkbox-label"></label>
      </div>

      <div className="todo-content">
        <h3 className="todo-title">{todo.title}</h3>
        <p className="todo-description">{todo.description}</p>
      </div>

      <button
        className="delete-btn"
        onClick={() => deleteTodo(todo.id)}
        aria-label="Delete todo"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;
