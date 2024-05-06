const express = require('express');
const ngrok = require('ngrok');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const port1 = 3002; // Changed port for des_open_ai_response
const port2 = 3003; // Changed port for fetch_route

// Initialize ngrok
let ngrokUrl = '';

// Start ngrok for port1
ngrok.connect(port1).then(url => {
  ngrokUrl = url;
  console.log(`Ngrok Tunnel in: ${ngrokUrl}`);
  
  // Start the server after ngrok is initialized
  app.listen(port1, () => {
    console.log(`Server is running on port ${port1}`);
    console.log(`Server is running on port ${ngrokUrl}`);
  });
}).catch(error => {
  console.log(`Couldn't tunnel ngrok: ${error}`);
});

// Routes
const desOpenAiResponseRouter = require('./routes/des_open_ai_response');
const fetchRouteRouter = require('./routes/fetch_route');
const insertTitleRouteRouter = require('./routes/destination_title')(ngrokUrl);


app.use('/des_open_ai_response', desOpenAiResponseRouter(ngrokUrl));
app.use('/fetch_route', fetchRouteRouter(ngrokUrl));
app.use('/destination_title', insertTitleRouteRouter);
module.exports = app;
