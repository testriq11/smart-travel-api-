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

// Route to handle updating user information
router.put('/profile_update/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  // Check if username and email are provided
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  // Update user information in the database
  const sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
  connection.query(sql, [username, email, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if user with given ID exists
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User information updated successfully' });
  });
});

module.exports = router;
