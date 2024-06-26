
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

// API endpoint to receive data from Flutter app 24/4/2024
// app.post('/saveResponses', (req, res) => {
//   const { response_text } = req.body;

//   // Insert responses into MySQL database
//   const query = 'INSERT INTO destination_openai_response (response_text) VALUES ?'; // Changed query

//   const values = [response_text]; // Removed map function

//   connection.query(query, [values], (err, result) => { // Removed map function
//     if (err) return res.json(err);
//     return res.json(result);
//   });
// });

//26/4/2024
// module.exports = (ngrokUrl) => {
//   router.post('/saveResponses', (req, res) => {
//     const { response_text } = req.body;

//     // Insert responses into MySQL database
//     const query = 'INSERT INTO destination_openai_response (response_text) VALUES (?)'; // Use placeholders for values

//     const values = [response_text];

//     connection.query(query, [values], (err, result) => {
//       if (err) return res.json(err);
//       return res.json(result);
//     });
//   });

//   return router;
// };



module.exports = (ngrokUrl) => {
  router.post('/saveResponses', (req, res) => {
    const { response_text, title_id, user_id } = req.body;

    // Check for null values and handle accordingly
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Insert responses into MySQL database
    const query = 'INSERT INTO destination_openai_response (response_text, title_id, user_id) VALUES (?, ?, ?)'; // Use placeholders for values
    const values = [response_text, title_id, user_id];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message }); // Send error as JSON
      }
      return res.json(result);
    });
  });

  return router;
};



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

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
//   console.log(`Server is running on port http://localhost:${port}`);

//   ngrok.connect(port).then(ngrokUrl=>{
//     console.log(`Ngrok Tunnle in: ${ngrokUrl}`);
//   }
// ).catch(error=>{
//     console.log(`Couldnt tunnle ngrok:${error}`);
// })
// });
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


