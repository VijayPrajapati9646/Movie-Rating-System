const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

// db connection
const { dbConnection } = require('./config/database');
dbConnection();

// badyParser setup
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json());

// importing routes
const movieRoutes = require('./Routes/moviesRoutes');

// setup routes
app.use('/movie', movieRoutes);

app.listen(port, () => {
  console.log(`Server Running On ${port}`);
});