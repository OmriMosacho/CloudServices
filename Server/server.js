const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 4000;


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};


async function createConnectionPool() {
  try {
    const pool = mysql.createPool(dbConfig,connectionLimit = 0);
    return pool;
  } catch (err) {
    console.error('Failed to create connection pool: ', err);
    throw err;
  }
}


app.use(async (req, res, next) => {
  try {
    if (!req.app.pool) {
      req.app.pool = await createConnectionPool();
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection error' });
  }
});


app.get('/api/todos', async (req, res) => {
  try {
    const [rows] = await req.app.pool.query('SELECT * FROM TODOS');
    res.json(rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.post('/api/todos', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const [maxIdRow] = await req.app.pool.query('SELECT ID FROM TODOS ORDER BY ID DESC');
    var nextId = 0;
    if (maxIdRow.length !== 0){
        const maxId = maxIdRow[0].ID;
        nextId = maxId + 1;
    }

    const query = `INSERT INTO TODOS (id, title, description) VALUES (?, ?, ?)`;
    await req.app.pool.query(query, [nextId,title, description]);
    res.sendStatus(200); 
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});



app.put('/api/todos/update', async (req, res) => {
  const { id, description } = req.body;
  try {
    const query = `UPDATE TODOS SET description = ? WHERE id = ?`;
    await req.app.pool.query(query, [description, id]);
    res.sendStatus(200); 
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `DELETE FROM TODOS WHERE id = ?`;
    await req.app.pool.query(query, [id]);
    res.sendStatus(200); // OK
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


