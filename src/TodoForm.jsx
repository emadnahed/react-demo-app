import React, { useState } from 'react';

const TodoForm = ({ addTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addTodo(title, description);
      setTitle('');
      setDescription('');
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h2 className="form-title">Add New Todo</h2>
      <div className="input-group">
        <label htmlFor="title" className="input-label">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter todo title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`form-input ${errors.title ? 'error' : ''}`}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>
      <div className="input-group">
        <label htmlFor="description" className="input-label">Description</label>
        <input
          id="description"
          type="text"
          placeholder="Enter todo description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`form-input ${errors.description ? 'error' : ''}`}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>
      <button type="submit" className="submit-btn" disabled={!title.trim() || !description.trim()}>
        <span className="btn-text">Add Todo</span>
      </button>
    </form>
  );
};

export default TodoForm;
