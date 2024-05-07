const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const jwt = require('jsonwebtoken');

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


// app.post('/login', (req, res) => {


//   const sql = "SELECT * FROM users WHERE `email` =? AND `password`=?";
//   db.query(sql, [req.body.email,req.body.password], (err, result) => {
//     if (err) {
//    return res.json("Error");

//     }
//     if (data.length>0){

//         const id= data[0].id;
//         const token =jwt.sign({id},"jwtSecretKey",{expiresIn:300});
//         return res.json({Login: true, token, result});
//     }
//     else{
//         return res.json("Failed")
//     }

//   });
// });



const bcrypt = require('bcrypt');


module.exports = (db) => {
  const router = express.Router();

  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE `email` = ?";
    connection.query(sql, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (result.length > 0) {
        const user = result[0];
        bcrypt.compare(password, user.password, (err, isValid) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to compare passwords' });
          }

          if (isValid) {
            const token = jwt.sign({ id: user.id }, "jwtSecretKey", { expiresIn: 300 });
            return res.json({ success: true, message: 'Login successful', token, user });
          } else {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
          }
        });
      } else {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }
    });
  });

  return router;
};



// const jwt = require('jsonwebtoken');

// module.exports = (db) => {
//   const router = express.Router();

//   router.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     const sql = "SELECT * FROM users WHERE `email` = ? AND `password` = ?";
//     connection.query(sql, [email, password], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       if (result.length > 0) {
//         const user = result[0];
//         const token = jwt.sign({ id: user.id }, "jwtSecretKey", { expiresIn: 300 });
//         return res.json({ success: true, message: 'Login successful', token, user });
//       } else {
//         return res.status(401).json({ success: false, error: 'Invalid email or password' });
//       }
//     });
//   });

//   return router;
// };
