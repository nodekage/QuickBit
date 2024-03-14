const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser')
const path = require('path');
const dotenv = require('dotenv');


const app = express();


app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors())


require('./db/mongoDB').connectToMongoDB()
app.use(bodyParser.json());



app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/url', require('./routes/urlRoutes'));




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

