import React, { useEffect, useState } from 'react';
import EasyEdit, { Types } from "react-easy-edit";
import axios from 'axios';
import './App.css'; // Import the App.css directly
//import config from './config';



const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inEditMode,changeToEditMode] = useState(false);

  //const server_ip = config.SERVER_IP;
  const server_ip = "http://localhost:4000";

  useEffect(() => {
    fetchTodos();
  }, []);

  const reloadComponent = async () => {
    window.location.reload(false);
  }

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
      console.error('Error fetching todos: ', error);
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

  const handleChangeDescription = async (id,description) =>{
    try{
      if (description === ''){
        alert('Description are required'); 
        reloadComponent();
      }
      else await axios.put(server_ip + `/api/todos/update`, { id, description });

      fetchTodos();
      changeToEditMode(!inEditMode);
    }catch (error) {
      console.error('Error updating todo:', error);
    }
  }


  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={addTodo} >
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
          onMouseEnter={(e)=>console.log("Hover description")}
        />
        <button type="submit">Add Task</button>
      </form>
      <ul >
        {todos.map((todo) => (
          <li key={todo.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <strong>{todo.title}: </strong>     
                <EasyEdit 
                type={Types.TEXT}
                onSave={(newDesc) => {handleChangeDescription(todo.id,newDesc);}}
                allowedit={inEditMode}
                value={todo.description}
                onCancel={() => changeToEditMode(!inEditMode)} > 
                </EasyEdit>
                <button onClick={() => handleDelete(todo.id)} style={{margin: 10}}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
/*
<EasyEdit type={Types.TEXT}
                                            onSave={() => {
                                            setDescription(value);
                                            }}
                                          editMode={inEditMode}
                                          value={todo.description}>
                                          </EasyEdit>
*/