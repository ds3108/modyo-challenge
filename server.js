require('dotenv').config(); // read .env files
const express = require('express');

const app = express();
const port = process.env.PORT || 5200;

// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Listen for HTTP requests on port 5200
app.listen(port, () => {
  console.log('Listening on %d', port);
});
