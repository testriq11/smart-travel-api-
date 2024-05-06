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
//////////////////////////Latest/////////////////
// module.exports = (ngrokUrl) => {
//   router.get('/responses', (req, res) => {
//     const query = 'SELECT response_text FROM destination_openai_response ORDER BY id DESC LIMIT 1';
//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error('Error fetching response:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       if (results.length === 0 || !results[0].response_text) {
//         return res.status(404).json({ error: 'No response found' });
//       }

//       const responseText = results[0].response_text;
//       console.log('Response text:', responseText);

//       try {
//         // Split response text into multiple cards based on keyword
//         const responseParts = responseText.split(/Nearby places to visit between|From/);

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
/////////////Latest/////////////////

module.exports = (ngrokUrl) => {
  router.get('/responses', (req, res) => {
    // Fetch last inserted title_id
    const getLastInsertedTitleIdQuery = 'SELECT title_id FROM destination_openai_response ORDER BY id DESC LIMIT 1';
    connection.query(getLastInsertedTitleIdQuery, (err, titleResults) => {
      if (err) {
        console.error('Error fetching last inserted title_id:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (titleResults.length === 0 || !titleResults[0].title_id) {
        return res.status(404).json({ error: 'No title_id found' });
      }

      const lastInsertedTitleId = titleResults[0].title_id;

      // Fetch all response_text based on the last inserted title_id
      const getResponseTextQuery = 'SELECT response_text FROM destination_openai_response WHERE title_id = ?';
      connection.query(getResponseTextQuery, [lastInsertedTitleId], (err, results) => {
        if (err) {
          console.error('Error fetching response:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'No response found' });
        }

        const responseData = results.map((result, index) => {
          return {
            cardIndex: index,
            text: result.response_text.trim()
          };
        });

        res.json(responseData);
      });
    });
  });

  return router;
};



// module.exports = (ngrokUrl) => {
//   router.get('/responses', (req, res) => {
//     const query = 'SELECT id, response_text FROM destination_openai_response ORDER BY id DESC LIMIT 1';
//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error('Error fetching response:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: 'No response found' });
//       }

//       const { id, response_text } = results[0];

//       console.log('Response text:', response_text);

//       try {
//         // Extract title from the first line of the response
//         const titleMatch = response_text.match(/^[^\r\n]+/);
//         const title = titleMatch ? titleMatch[0].trim() : '';

//         // Split remaining response text into multiple cards based on keyword
//         const responseParts = response_text.substring(title.length).split(/Nearby places to visit between|From/);

//         const responseData = responseParts.map((part, index) => {
//           return {
//             cardIndex: index,
//             text: part.trim()
//           };
//         });

//         // Clear previous title from the cache
//         const clearCacheQuery = 'DELETE FROM destination_title';
//         connection.query(clearCacheQuery, (err, result) => {
//           if (err) {
//             console.error('Error clearing cache:', err);
//             return res.status(500).json({ error: 'Internal Server Error' });
//           }
//           console.log('Previous title cleared from cache');
          
//           // Insert data into destination_title table
//           const insertQuery = 'INSERT INTO destination_title (destination_title, destination_openai_response_id) VALUES (?, ?)';
//           connection.query(insertQuery, [title, id], (err, result) => {
//             if (err) {
//               console.error('Error inserting data into destination_title:', err);
//               return res.status(500).json({ error: 'Internal Server Error' });
//             }
//             console.log('Inserted into destination_title:', result);
            
//             // Send response back to Flutter app
//             res.json(responseData);
//           });
//         });
        
//       } catch (error) {
//         console.error('Error parsing response data:', error);
//         console.error('Response text:', response_text);
//         res.status(500).json({ error: 'Error parsing response data' });
//       }
//     });
//   });

//   return router;
// };
