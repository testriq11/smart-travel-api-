
// Import necessary modules
// const mysql = require('mysql');
// const express = require('express');
// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const bodyParser = require('body-parser');
// const path = require('path'); // Import the path module

// const app = express();
// const port = 3000;

// // Create MySQL connection

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'nodejs_auth'
// });

// // Connect to MySQL
// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

// // Function to insert response into destination_openai_response table
// function insertResponse(responseData) {
//     const { cur_to_des1, des1_to_des2, des2_to_des3, des3_to_cur } = responseData;
//     const sql = `INSERT INTO destination_openai_response (cur_to_des1, des1_to_des2, des2_to_des3, des3_to_cur) VALUES (?, ?, ?, ?)`;
//     const values = [cur_to_des1, des1_to_des2, des2_to_des3, des3_to_cur];

//     db.query(sql, values, (err, result) => {
//         if (err) {
//             console.error('Error inserting response:', err);
//             return;
//         }
//         console.log('Response inserted successfully');
//     });
// }

// // Example usage
// const responseData = {
//     cur_to_des1: 'response1',
//     des1_to_des2: 'response2',
//     des2_to_des3: 'response3',
//     des3_to_cur: 'response4'
// };

// // Call the function to insert the response
// insertResponse(responseData);

// Close MySQL connection when done
// db.end();

/////////////////////////////////////////////////////////////////////////////////////////////////


const express = require('express');
const mysql = require('mysql');
const cors= require('cors');
const os = require('os');
const app = express();
const ngrok = require('ngrok');

app.use (cors());
const port = 3002;
app.use(express.json());
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

// Middleware to parse JSON bodies

app.get('/getIPAddress', (req, res) => {
  // Retrieve the IP address of the server
  const ipAddress = getIPAddress();
  res.send(ipAddress);
});

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const key in interfaces) {
      for (const interface of interfaces[key]) {
          if (!interface.internal && interface.family === 'IPv4') {
              return interface.address;
          }
      }
  }
  return '127.0.0.1'; // Default to localhost if no IP address is found
}



// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }

//   const sql = 'INSERT INTO destination_openai_response (email, password) VALUES (?, ?)';
//   db.query(sql, [email, password], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Failed to insert data into database' });
//     }
//     res.status(200).json({ message: 'User registered successfully' });
//   });
// });

// API endpoint to receive data from Flutter app
app.post('/saveResponses', (req, res) => {
  const { response_text } = req.body; // Change here

  // Insert responses into MySQL database
  const query = 'INSERT INTO destination_openai_response (response_text) VALUES (?)';

  const values = response_text.map(response => [response]);

  connection.query(query, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});




//   connection.query(query, [values], (err, result) => {
//     if (err) {
//       console.error('Error saving responses to database: ', err);
//       res.status(500).send('Error saving responses to database');
//       return;
//     }
//     console.log('Responses saved to database');
//     res.status(200).send('Responses saved to database');
//   });
// });

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
// Import necessary modules
// Import necessary modules
// Import necessary modules
// Import necessary modules
// Import necessary modules
// const express = require('express');
// const mysql = require('mysql');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 3000;

// // Create MySQL connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'nodejs_auth'
// });

// // Connect to MySQL
// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Middleware to parse URL encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));

// var ip = require("ip");
// console.log(ip.address());

// app.post('/store_response', (req, res) => {
//     // Extract data from request body
//     const { cur_to_des1, des1_to_des2, des2_to_des3, des3_to_cur, current_location, destination2, destination3 } = req.body;
  
//     // Insert data into MySQL database
//     const sql = `INSERT INTO destination_openai_response (cur_to_des1, des1_to_des2, des2_to_des3, des3_to_cur, current_location, destination2, destination3) VALUES (?, ?, ?, ?, ?, ?, ?)`;
//     const values = [cur_to_des1, des1_to_des2, des2_to_des3, des3_to_cur, current_location, destination2, destination3];
  
//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error('Error inserting response data:', err);
//         res.status(500).json({ error: 'Error inserting response data' });
//         return;
//       }
//       console.log('Response data inserted successfully');
//       res.status(200).json({ message: 'Response data inserted successfully' });
//     });
//   });
  
//////////////////////////////////---------------////////////////////////
// app.post('/store_response', (req, res) => {
//     // Extract data from request body
//     const { cur_to_des1, des1_to_des2, des2_to_des3, des3_to_cur } = req.body;

//     // Insert data into MySQL database
//     const sql = `INSERT INTO destination_openai_response (cur_to_des1, des1_to_des2, des2_to_des3, des3_to_cur) VALUES (?, ?, ?, ?)`;
//     const values = [cur_to_des1, des1_to_des2, des2_to_des3, des3_to_cur];

//     db.query(sql, values, (err, result) => {
//         if (err) {
//             console.error('Error inserting response data:', err);
//             res.status(500).json({ error: 'Error inserting response data' });
//             return;
//         }
//         console.log('Response data inserted successfully');
//         res.status(200).json({ message: 'Response data inserted successfully' });
//     });
// });

// // Start the Express server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });


