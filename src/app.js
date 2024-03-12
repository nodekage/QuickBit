const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser')
const path = require('path');
const dotenv = require('dotenv');


const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use (cors({
    origin : '*'
}))

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

require('./db/mongoDB').connectToMongoDB()
app.use(bodyParser.json());



app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/url', require('./routes/urlRoutes'));




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

