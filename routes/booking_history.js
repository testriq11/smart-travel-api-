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
//   router.get('/responses/:userId', (req, res) => {
//       const userId = req.params.userId; // Extract userId from request parameters
//       console.log(`Received request for userId: ${userId}`); // Debugging statement

//       // Fetch response_text based on user_id
//       const getResponseTextQuery = 'SELECT response_text FROM destination_openai_response WHERE user_id = ?';
//       connection.query(getResponseTextQuery, [userId], (err, results) => {
//           if (err) {
//               console.error('Error fetching response:', err);
//               return res.status(500).json({ error: 'Internal Server Error' });
//           }

//           console.log(`Query results: ${JSON.stringify(results)}`); // Debugging statement

//           if (results.length === 0) {
//               return res.status(404).json({ error: 'No response found' });
//           }

//           const responseData = results.map((result, index) => {
//               return {
//                   cardIndex: index,
//                   text: result.response_text.trim()
//               };
//           });

//           res.json(responseData);
//       });
//   });

//   return router;
// };

// module.exports = (ngrokUrl) => {
//     router.get('/responses/:userId/:titleId', (req, res) => {
//         const userId = req.params.userId; // Extract userId from request parameters
//         const titleId = req.params.titleId; // Extract titleId from request parameters
//         console.log(`Received request for userId: ${userId}, titleId: ${titleId}`); // Debugging statement

//         // Fetch response_text based on user_id and title_id
//         const getResponseTextQuery = `
//             SELECT dor.response_text, dt.destination_title
//             FROM destination_openai_response dor
//             JOIN destination_title dt ON dor.title_id = dt.id
//             WHERE dor.user_id = ? AND dor.title_id = ?
//         `;
//         connection.query(getResponseTextQuery, [userId, titleId], (err, results) => {
//             if (err) {
//                 console.error('Error fetching response:', err);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//             }

//             console.log(`Query results: ${JSON.stringify(results)}`); // Debugging statement

//             if (results.length === 0) {
//                 return res.status(404).json({ error: 'No response found' });
//             }

//             const responseData = results.map((result, index) => {
//                 return {
//                     cardIndex: index,
//                     title: result.destination_title,
//                     text: result.response_text.trim()
//                 };
//             });

//             res.json(responseData);
//         });
//     });

//     return router;
// };

module.exports = (ngrokUrl) => {
  router.get('/responses/:userId', (req, res) => {
      const userId = req.params.userId; // Extract userId from request parameters
      console.log(`Received request for userId: ${userId}`); // Debugging statement

      // Fetch response_text based on user_id
      const getResponseTextQuery = `
          SELECT dor.response_text, dt.destination_title
          FROM destination_openai_response dor
          JOIN destination_title dt ON dor.title_id = dt.id
          WHERE dor.user_id = ?
      `;
      connection.query(getResponseTextQuery, [userId], (err, results) => {
          if (err) {
              console.error('Error fetching response:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          console.log(`Query results: ${JSON.stringify(results)}`); // Debugging statement

          if (results.length === 0) {
              return res.status(404).json({ error: 'No response found' });
          }

          const responseData = results.map((result, index) => {
              return {
                  cardIndex: index,
                  title: result.destination_title,
                  text: result.response_text.trim()
              };
          });

          res.json(responseData);
      });
  });

  return router;
};
