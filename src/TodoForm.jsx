import React from 'react';

const TodoForm = () => {
  return (
    <div className="todo-form">
      <input type="text" placeholder="Todo title" />
      <input type="text" placeholder="Todo description" />
      <button>Add Todo</button>
    </div>
  );
};

export default TodoForm;
