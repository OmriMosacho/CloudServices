import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the App.css directly

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

const server_ip = "http://18.195.28.151:4000";


  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(server_ip + '/api/todos');

      // Build a new array of todo objects with the desired structure
      const newTodos = [];
      for (let i = 0; i < response.data.length; i++) {
        const todo = response.data[i];
        const newTodo = {
          id: todo.id,
          title: todo.title,
          description: todo.description,
        };
        newTodos.push(newTodo);
      }

      setTodos(newTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Title and description are required');
      return;
    }

    try {
      await axios.post(server_ip + '/api/todos', { title, description }, { headers: {'Content-Type': 'application/json'} });
      fetchTodos();
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(server_ip + `/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.title}</strong>: {todo.description}
            <button onClick={() => handleDelete(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
