import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, deleteTodo, toggleComplete }) => {
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
