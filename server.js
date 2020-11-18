'use strict';

//Add dependencies 
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const ejs = require('ejs');
const pg = require('pg');

//Load environment variables from .env
require('dotenv').config();

// Declare port
const PORT = process.env.PORT || 3000;

// Start express
const app = express();

// define client
const client = new pg.Client(process.env.DATABASE_URL);

// use CORS
app.use(cors());

// Serve static css files
app.use(express.static('./public'));

// Decode POST data
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// Routes

// Constructors

// Route Handler Functions 

//Connect to DB
client.connect();

// Listen on the port
app.listen(PORT, () => {
        console.log(`server is now listening on port ${PORT}`);
});