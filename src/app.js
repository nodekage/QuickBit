const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

require('./db/mongoDB').connectToMongoDB()

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Additional routes or configurations go here

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

