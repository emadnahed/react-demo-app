import React from 'react';

const TodoItem = ({ todo }) => {
  return (
    <div className="todo-item">
      <span>{todo.title}</span>
      <span>{todo.description}</span>
    </div>
  );
};

export default TodoItem;
