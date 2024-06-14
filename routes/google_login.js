// const express = require('express');
// const mysql = require('mysql');
// const router = express.Router();
// const jwt = require('jsonwebtoken');

// // Create MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'nodejs_auth'
// });

// // Connect to MySQL
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL: ' + err.stack);
//     return;
//   }
//   console.log('Connected to MySQL as id ' + connection.threadId);
// });

// const bcrypt = require('bcrypt');

// module.exports = () => { // Removed `db` parameter as it's not being used
//   const router = express.Router();

//   router.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     const sql = "SELECT * FROM users WHERE `email` = ?";
//     connection.query(sql, [email], (err, result) => { // Use `connection` object instead of `db`
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       if (result.length > 0) {
//         const user = result[0];
//         bcrypt.compare(password, user.password, (err, isValid) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Failed to compare passwords' });
//           }

//           if (isValid) {
//             const token = jwt.sign({ id: user.id }, "jwtSecretKey", { expiresIn: 300 });
//             return res.json({
//               success: true,
//               message: 'Login successful',
//               token,
//               user: {
//                 id: user.id,
//                 username: user.username,
//                 email: user.email
//               }
//             });
//           } else {
//             return res.status(401).json({ success: false, error: 'Invalid email or password' });
//           }
//         });
//       } else {
//         return res.status(401).json({ success: false, error: 'Invalid email or password' });
//       }
//     });
//   });

//   return router;
// };


const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const crypto = require('crypto'); 
const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inter'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Generate a random secret key for JWT
const jwtSecretKey = crypto.randomBytes(32).toString('base64');
const googleClient = new OAuth2Client('373914489733-boekjkagicg98attjic0vuks1krd42oh.apps.googleusercontent.com');



module.exports = () => { // Removed `db` parameter as it's not being used
  const router = express.Router();
app.post('/google_login', async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: '373914489733-boekjkagicg98attjic0vuks1krd42oh.apps.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const sql = "SELECT * FROM users WHERE `email` = ?";
    connection.query(sql, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (result.length > 0) {
        const user = result[0];
        const token = jwt.sign({ id: user.id }, jwtSecretKey, { expiresIn: 300 });
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      } else {
        const newUser = {
          username: payload.name,
          email: email,
          password: null
        };

        const insertSql = "INSERT INTO users SET ?";
        connection.query(insertSql, newUser, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          const token = jwt.sign({ id: result.insertId }, jwtSecretKey, { expiresIn: 300 });
          return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
              id: result.insertId,
              username: newUser.username,
              email: newUser.email
            }
          });
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
});
return router;
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
}