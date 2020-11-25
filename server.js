'use strict';

//Add dependencies 
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const ejs = require('ejs');
const pg = require('pg');
const { query } = require('express');
const methodOverride = require('method-override');

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

// Utilize other HTTP verbs
app.use(methodOverride('_method'));

// Routes
app.get('/', homeRoute);
app.get('/weather', weatherRoute);
app.get('/error', errorRoute);
app.get('/rovers/aboutRovers', aboutRoversRoute);
app.get('/rovers/curiosity', curiosityRoute);
app.get('/rovers/opportunity', opportunityRoute);
app.get('/rovers/spirit', spiritRoute);
app.get('/favorites', getFavs);
app.post('/rovers', addToFavs);
app.post('/roversHome', addToFavsHome);
app.delete('/delete/:id', removeFav);

// Constructors
function Weather(obj) {
  this.sol = obj[0] ? obj[0] : 'Sorry, unable to fetch this sol';
  this.date = obj[1].First_UTC ? obj[1].First_UTC.substring(0,10) : 'Sorry, unable to fetch this date';
  this.max = obj[1].AT ? obj[1].AT.mx : 'Unknown';
  this.min = obj[1].AT ? obj[1].AT.mn : 'Unknown';
  this.avg = obj[1].AT ? obj[1].AT.av : 'Unknown';
}

function RoverImages(obj) {
  this.image = obj.img_src ? obj.img_src : 'sorry, this photo is unavailable';
  this.name = obj.rover.name ? obj.rover.name : 'sorry, no rover name available';
  this.sol = obj.sol ? obj.sol : 'sorry, unable to fetch sol';
  this.date = obj.earth_date ? obj.earth_date : 'sorry, unable to fetch Earth date';
  this.camera = obj.camera.full_name ? obj.camera.full_name : 'sorry, unable to identify camera name';
}

// Route Handler Functions 
function homeRoute(req, res) {
  let key = process.env.NASA_API;
  let today = new Date()
  let days = 86400000
  let oneDayAgo = new Date(today - (days))
  oneDayAgo = oneDayAgo.getFullYear() + "-" + (oneDayAgo.getMonth()+1) + "-" + oneDayAgo.getDate();
  let APODURL = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${oneDayAgo}`
  let random = (Math.random() * 2000);
  random = Math.floor(random);
  let roverArr = ['curiosity', 'opportunity', 'spirit'];
  let random2 = (Math.random() * 3);
  random2 = Math.floor(random2);
  let MARSURL =  `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverArr[random2]}/photos?sol=${random}&api_key=${key}`
  superagent.get(APODURL)
  .then(data => {
  superagent.get(MARSURL)
  .then(data2 => {
    data2.body.photos.length = 1;
    let roverData = data2.body.photos.map(results => {
      return new RoverImages(results);
    }) 
    res.status(200).render('home', {results: data.body.hdurl, results2: roverData});
  })
  .catch(error => {
    errorRoute(req, res, error);
  });
})
}


function weatherRoute(req, res) {
  let key = process.env.NASA_API;
  let APIURL = `https://api.nasa.gov/insight_weather/?api_key=${key}&feedtype=json&ver=1.0`
  superagent.get(APIURL)
  .then(data => {
    const arrData = Object.entries(data.body);
    arrData.length = 6;
    const dataArr = arrData.map(results => {
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
    results.body.photos.length = 1;
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
  let MARSURL =  `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=${random}&api_key=${key}`
  superagent.get(MARSURL)
  .then(results => {
    results.body.photos.length = 1;
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
  let MARSURL =  `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=${random}&api_key=${key}`
  superagent.get(MARSURL)
  .then(results => {
    results.body.photos.length = 1;
    const arrOfPics = results.body.photos.map(results => {
      return new RoverImages(results);
    });
    res.status(200).render('rovers/spirit', {results: arrOfPics});
  })
  .catch(error => {
    errorRoute(req, res, error);
  });
}

function addToFavs(req, res) {
  const sql =  `INSERT INTO favorites (name, image, sol, date, camera) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const params = [req.body.name, req.body.image, req.body.sol, req.body.date, req.body.camera];
  client.query(sql, params)
    .then(data => {
      res.status(200).redirect(`/rovers/${req.body.name}`);
    })
    .catch(error => {
      errorRoute(req, res, error);
    });
}

function addToFavsHome(req, res) {
  const sql =  `INSERT INTO favorites (name, image, sol, date, camera) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const params = [req.body.name, req.body.image, req.body.sol, req.body.date, req.body.camera];
  client.query(sql, params)
    .then(data => {
      res.status(200).redirect('/');
    })
    .catch(error => {
      errorRoute(req, res, error);
    });
}

function getFavs(req, res) {
  const sql = ` SELECT * FROM favorites`;
  client.query(sql)
    .then(results => {
      res.status(200).render('favorites', {results: results.rows});
    })
    .catch(error => {
      errorRoute(req, res, error);
    });
}

function removeFav(req, res) {
  const sql = 'DELETE FROM favorites WHERE id = $1';
  const params = [req.params.id];
  const sql2 = ` SELECT * FROM favorites`;
  return client.query(sql, params)
    .then(() => {
      return client.query(sql2)
      .then(results => {
        res.status(200).render('favorites', {results: results.rows})
    })
    .catch(error => {
      errorRoute(req, res, error);
    });
})
}

//Connect to DB
client.connect();

// Listen on the port
app.listen(PORT, () => {
        console.log(`server is now listening on port ${PORT}`);
});