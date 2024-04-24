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

// module.exports = (ngrokUrl) => {
//   router.get('/responses', (req, res) => {
//     const query = 'SELECT response_text FROM destination_openai_response ORDER BY id DESC LIMIT 1';
//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error('Error fetching response:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       const responseText = results[0].response_text;
//       console.log('Response text:', responseText);

//       try {
//         // Split response text into multiple cards based on keyword
//         const responseParts = responseText.split('Nearby places to visit between');

//         const responseData = responseParts.map((part, index) => {
//           return {
//             cardIndex: index,
//             text: part.trim()
//           };
//         });

//         res.json(responseData);
//       } catch (error) {
//         console.error('Error parsing response data:', error);
//         console.error('Response text:', responseText);
//         res.status(500).json({ error: 'Error parsing response data' });
//       }
//     });
//   });

//   return router;
// };

module.exports = (ngrokUrl) => {
  router.get('/responses', (req, res) => {
    const query = 'SELECT response_text FROM destination_openai_response ORDER BY id DESC LIMIT 1';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching response:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const responseText = results[0].response_text;
      console.log('Response text:', responseText);

      try {
        // Split response text into multiple cards based on keyword
        const responseParts = responseText.split(/Nearby places to visit between|From/);

        const responseData = responseParts.map((part, index) => {
          return {
            cardIndex: index,
            text: part.trim()
          };
        });

        res.json(responseData);
      } catch (error) {
        console.error('Error parsing response data:', error);
        console.error('Response text:', responseText);
        res.status(500).json({ error: 'Error parsing response data' });
      }
    });
  });

  return router;
};
