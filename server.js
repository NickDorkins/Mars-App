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

// app.post('/home', homeMarsPhoto);


// Constructors
function Weather(obj) {
  this.sol = obj;
  this.date = obj.First_UTC.slice(9);
  this.max = obj.AT.mx;
  this.min = obj.AT.mn;
  this.avg = obj.AT.av;
}

// Route Handler Functions 
function homeRoute(req, res) {
  let key = process.env.NASA_API;
  let today = new Date()
  let days = 86400000
  let oneDayAgo = new Date(today - (days))
  oneDayAgo = oneDayAgo.getFullYear() + "-" + (oneDayAgo.getMonth()+1) + "-" + oneDayAgo.getDate();
  let APODURL = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${oneDayAgo}`
  let random = (Math.random() * 2900);
  random = Math.floor(random);
  let queryParam = 1;
  let MARSURL =  `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${random}&api_key=${key}`
  superagent.get(APODURL)
  .then(data => {
  superagent.get(MARSURL)
  .then(data2 => {
    console.log(data2.body.photos[0].img_src);
    res.status(200).render('home', {results: data.body.hdurl, output: data2.body.photos[0].img_src});
  })
  })
  .catch(error => {
    errorRoute(req, res, error);
  });
}

function weatherRoute(req, res) {
  let key = process.env.NASA_API;
  let APIURL = `https://api.nasa.gov/insight_weather/?api_key=${key}&feedtype=json&ver=1.0`
  res.render('weather');
}

function errorRoute(req, res, error) {
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