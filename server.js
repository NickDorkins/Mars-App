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
app.get('/home', homeRoute);
app.get('/weather', weatherRoute);
app.get('/error', errorRoute);
app.get('/rovers/aboutRovers', aboutRoversRoute);
app.get('/rovers/curiosity', curiosityRoute);
app.get('/rovers/opportunity', opportunityRoute);
app.get('/rovers/spirit', spiritRoute);

// Constructors

// Route Handler Functions
function homeRoute(req, res) {
        res.render('home');
}

function weatherRoute(req, res) {
        res.render('weather');
}

function errorRoute(req, res) {
        res.render('error');
}

function aboutRoversRoute(req, res) {
        res.render('rovers/aboutRovers');
}

function curiosityRoute(req, res) {
        res.render('rovers/curiosity');
}

function opportunityRoute(req, res) {
        res.render('rovers/opportunity');
}
function spiritRoute(req, res) {
        res.render('rovers/spirit');
}

//Connect to DB
client.connect();

// Listen on the port
app.listen(PORT, () => {
        console.log(`server is now listening on port ${PORT}`);
});