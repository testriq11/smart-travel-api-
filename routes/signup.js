const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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



// module.exports = () => {
//     router.post('/signup', (req, res) => {
//       const { username, email, password } = req.body;
  
//       if (!username || !email || !password) {
//         return res.status(400).json({ error: 'Username, email, and password are required' });
//       }
  
//       bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Failed to hash the password' });
//         }
  
//         const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
//         const values = [username, email, hashedPassword];
  
//         connection.query(sql, values, (err, result) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Failed to insert data into database' });
//           }
//           res.status(200).json({ message: 'User registered successfully' });
//         });
//       });
//     });
  
//     return router;
//   };


module.exports = () => {
  router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to query database' });
      }

      if (results.length > 0) {
        // User already exists
        return res.status(200).json({ error: 'User already registered' });
      }

      // User does not exist, proceed with registration
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to hash the password' });
        }

        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        const values = [username, email, hashedPassword];

        connection.query(sql, values, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to insert data into database' });
          }
          res.status(200).json({ message: 'User registered successfully' });
        });
      });
    });
  });

  return router;
};