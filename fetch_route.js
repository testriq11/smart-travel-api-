const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const ngrok = require('ngrok');

const app = express();

app.use(cors());
app.use(express.json());

const port = 3002;

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


// app.get('/responses', (req, res) => {
//     const query = 'SELECT response_text FROM destination_openai_response ORDER BY id DESC LIMIT 1';
//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error('Error fetching response:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }
  
//       const responseText = results[0].response_text;
//       console.log('Response text:', responseText);
  
//       try {
//         // Convert text data to JSON format
//         const responseData = { text: responseText };
//         res.json(responseData);
//       } catch (error) {
//         console.error('Error parsing response data:', error);
//         console.error('Response text:', responseText);
//         res.status(500).json({ error: 'Error parsing response data' });
//       }
//     });
//   });
  
app.get('/responses', (req, res) => {
    const query = 'SELECT response_text FROM destination_openai_response ORDER BY id DESC LIMIT 1';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching response:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      const responseText = results[0].response_text;
      console.log('Response text:', responseText);
  
      try {
        // Split response text into separate routes based on the "From" keyword
        const routes = responseText.split("From ");
        // Remove the first element (empty string) from the routes array
        routes.shift();
        
        // Format routes
        const formattedRoutes = routes.map(route => {
          const [from, destinations] = route.split(" to ");
          const destinationsList = destinations.split("\n").filter(dest => dest.trim() !== "");
          return {
            from: from.trim(),
            destinations: destinationsList.map((dest, index) => `${index + 1}. ${dest.trim()}`)
          };
        });
  
        res.json(formattedRoutes);
      } catch (error) {
        console.error('Error parsing response data:', error);
        console.error('Response text:', responseText);
        res.status(500).json({ error: 'Error parsing response data' });
      }
    });
  });
  
  
  
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Server is running on port http://localhost:${port}`);
  
    ngrok.connect(port).then(ngrokUrl => {
      console.log(`Ngrok Tunnel in: ${ngrokUrl}`);
    }).catch(error => {
      console.log(`Couldn't tunnel ngrok: ${error}`);
    });
  });