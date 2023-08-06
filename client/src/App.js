import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the App.css directly

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);


  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/todos');
      setTodos(response.data);
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
      console.log(title,description);
      await axios.post('http://localhost:4000/api/todos', { title, description });
      fetchTodos();
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  if(loading){
    return <div>Loading...</div>
  }


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
          </li>
        ))}
      </ul>
    </div>
  );

};

export default App;
