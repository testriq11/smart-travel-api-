const express = require('express');
const mysql = require('mysql');
const router = express.Router();

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs_auth'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = (ngrokUrl) => {
  router.post('/insertTitle', (req, res) => {
    const { destination_title } = req.body;

    // Insert title into MySQL database
    const query = 'INSERT INTO destination_title (destination_title) VALUES (?)'; // Use placeholders for values

    const values = [destination_title];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting title:", err);
        return res.status(500).json({ error: err.message }); // Send error as JSON
      }
      console.log("Title inserted successfully with ID:", result.insertId);
      return res.json({ insertId: result.insertId }); // Return the ID of the inserted title
    });
  });

  return router;
};
