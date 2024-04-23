import React, { useEffect, useState } from 'react';
import EasyEdit, { Types } from "react-easy-edit";
import axios from 'axios';
import './App.css'; // Import the App.css directly
import SigninSignup from './Pages/login';
//import config from './config';

//const bcrypt = require('bcrypt');
/*
const hashPassword = async (Oldpassword) => {
  //Salting round for the salt and pepper encryption architechture.
  const round = 10;
  return await bcrypt.hash(Oldpassword,round);
};
*/



const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inEditMode,changeToEditMode] = useState(false);
  const [action,setAction] = useState('Sign In');

  const [name,setName] = useState('');

  const [authenticated,setAuthenticated] = useState(false);
  const [authenticatedError,setAuthenticatedError] = useState(false);

  const [addingError,setAddingError] = useState(false);

  const [UserID,setUserID] = useState('');

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  //const server_ip = config.SERVER_IP;
  const server_ip = "http://localhost:4000";

  /*
  useEffect(() => {
    fetchTodos();
  }, []);
*/

// useEffect(() => {
//   console.log('UserID updated:', UserID);
//   fetchTodos();
// }, [UserID]);

  const addUser = async (name,email,password,permissions) => {
    try{
      const response = await axios.post(server_ip + '/api/signup',{name,email,password,permissions},{ headers: {'Content-Type': 'application/json'} });
      setAddingError(false);
      setAuthenticatedError(false);
      setAction('Sign In');
    }catch (err){
      setAddingError(true);
    }
    
  };




  const authenticationCheck = async (email,password) => {
    try{
      setEmail(email);
      setPassword(password);


      
      const response = await axios.post(server_ip + '/api/login',{email,password},{ headers: {'Content-Type': 'application/json'} });
      if (response.data.length) {
        setAuthenticated(true);
        
        setName(response.data[0].Name);
        setUserID(response.data[0].ID);
        fetchTodos(response.data[0].ID);
      }
      else setAuthenticatedError(true);


    }catch (error) {
      console.error('Error fetching USERS: ', error);
    }
  };


  const reloadComponent = async () => {
    window.location.reload(false);
  }


  const fetchTodos = async (user) => {
    try {
      const response = await axios.get(server_ip + `/api/todos/${user}`);
      //setTodos([]);

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

    //console.log(UserID);

    try {
      await axios.post(server_ip + '/api/todos', { title, description, UserID}, { headers: {'Content-Type': 'application/json'} });
      fetchTodos(UserID);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(server_ip + `/api/todos/${id}`);
      fetchTodos(UserID);
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

      fetchTodos(UserID);
      changeToEditMode(!inEditMode);
    }catch (error) {
      console.error('Error updating todo:', error);
    }
  }



  return (
    <div>
      {authenticated===false?<div><SigninSignup value={{action,setAction,authenticationCheck,authenticatedError,addUser,addingError}}/></div>:
        <div className='card'>
          <div style={{'textAlign': 'left'}}>Welcome {name} !
            <button onClick={() => {setAuthenticated(false); setAuthenticatedError(false); }} style={{'textAlign': 'left'}}>Sign Out</button>
          </div>
           <h1>Todo List</h1>     
          <form  onSubmit={addTodo} >
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
      }
      
    </div>
  );
};

export default App;
