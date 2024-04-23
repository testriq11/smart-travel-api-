

const express = require('express');
const mysql = require('mysql');
const ngrok = require('ngrok');

const app = express();
const port = 5000;

app.use(express.json());

// Create connection to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_auth'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected');
});

// API endpoint for handling login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = 'INSERT INTO destination_openai_response (email, password) VALUES (?, ?)';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to insert data into database' });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Server is running on port http://localhost:${port}`);

  ngrok.connect(port).then(ngrokUrl=>{
    console.log(`Ngrok Tunnle in: ${ngrokUrl}`);
  }
).catch(error=>{
    console.log(`Couldnt tunnle ngrok:${error}`);
})
});
