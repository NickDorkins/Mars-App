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
app.post('/weather', saveWeatherData);


// Constructors
function Weather(obj) {
  this.sol = obj[0] ? obj[0] : 'sorry, unable to fetch sol';
  this.date = obj[1].First_UTC ? obj[1].First_UTC.substring(0,10) : 'sorry, unable to fetch date';
  this.max = obj[1].AT.mx ? obj[1].AT.mx : 'sorry, unable to fetch max temp';
  this.min = obj[1].AT.mn ? obj[1].AT.mn : 'sorry, unable to fetch min temp';
  this.avg = obj[1].AT.av ? obj[1].AT.av : 'sorry, unable to fetch average temp';
}

function RoverImages(obj) {
  this.sol = obj.sol;
  this.date = obj.earth_date;
  this.camera = obj.camera.full_name;
  this.image = obj.img_src ? obj.img_src : 'sorry, this photo is unavailable';
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
  let MARSURL =  `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${random}&api_key=${key}`
  superagent.get(APODURL)
  .then(data => {
  superagent.get(MARSURL)
  .then(data2 => {
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
  const max = 2;
  superagent.get(APIURL)
  .query(max)
  .then(data => {
    const arrData = Object.entries(data.body);
    const dataArr = arrData.map(results => {
      // console.log(new Weather(results));
      return new Weather(results);
    })
    res.status(200).render('weather', {results: dataArr});
  })
  .catch(error => {
    errorRoute(req, res, error);
  });
}

function errorRoute(req, res, error) {
  res.render('error');
}

function aboutRoversRoute(req, res) {
  res.render('rovers/aboutRovers');
}

function curiosityRoute(req, res) {
  let key = process.env.NASA_API;
  let random = (Math.random() * 2900);
  random = Math.floor(random);
  let MARSURL =  `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${random}&api_key=${key}`
  superagent.get(MARSURL)
  .then(results => {
    const arrOfPics = results.body.photos.map(results => {
      return new RoverImages(results);
    });
    res.status(200).render('rovers/curiosity', {results: arrOfPics});
  })
  .catch(error => {
    errorRoute(req, res, error);
  });
}

function opportunityRoute(req, res) {
  let key = process.env.NASA_API;
  let random = (Math.random() * 5352);
  random = Math.floor(random);
  const queryParam = 10;
  let MARSURL =  `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=${random}&api_key=${key}`
  superagent.get(MARSURL)
  .query(queryParam)
  .then(results => {
    const arrOfPics = results.body.photos.map(results => {
      return new RoverImages(results);
    });
    res.status(200).render('rovers/opportunity', {results: arrOfPics});
  })
  .catch(error => {
    errorRoute(req, res, error);
  });
}

function spiritRoute(req, res) {
  let key = process.env.NASA_API;
  let random = (Math.random() * 2208);
  random = Math.floor(random);
  const queryParam = 10;
  let MARSURL =  `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=${random}&api_key=${key}`
  superagent.get(MARSURL)
  .query(queryParam)
  .then(results => {
    const arrOfPics = results.body.photos.map(results => {
      return new RoverImages(results);
    });
    res.status(200).render('rovers/spirit', {results: arrOfPics});
  })
  .catch(error => {
    errorRoute(req, res, error);
  });
}

function saveWeatherData(req, res) {
  const sql = `INSERT INTO weather (sol, date, max, min, avg) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

  client.query(sql)
    .then(data => {
      res.status(200).redirect('weather');
    })
    .catch(error => {
      errorRoute(req, res, error);
    });
}

//Connect to DB
client.connect();

// Listen on the port
app.listen(PORT, () => {
        console.log(`server is now listening on port ${PORT}`);
});