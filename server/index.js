const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('../database/connect.js');
const Reservation = require('../database/Reservation.js');
const Mapper = require('../database/Mapper.js');

let app = express();

app.use(express.static(__dirname + '/../public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  get all reservations (for testing)
app.get('/reservation/all', function (req, res) {
  Reservation.getAll()
  .then((reservations) => {
    res.write(JSON.stringify(reservations));
    res.end();
  })
  .catch((err) => {
    console.log('Error: ', err);
    res.end();
  });
});

//  check if reservation can be accepted and add to the database if so
app.post('/reservation', function (req, res) {
  //  post if you can; return success
  //  if post not allowed, return error message
  //  errors can be: username already has a reservation,
  //                 reservation overlaps too many (too many tables used)
  var restId = req.body.restId;
  var name = req.body.name;
  var time = req.body.time;

  Reservation.make(restId, name, time)
  .then((confirmation) => {
    res.write(JSON.stringify(confirmation));
    res.end();
  })
  .catch((err) => {
    console.log('Error:', err);
    res.end();
  });
});

//  get all maps (for testing)
app.get('/mapper/all', function (req, res) {
  Mapper.getAll()
    .then((maps) => {
      res.write(JSON.stringify(maps));
      res.end();
    })
    .catch((err) => {
      console.log('Error:', err);
      res.end();
    });
});

//  get restaurant geolocator for call to google maps api
app.get('/mapper/:restaurantId', function (req, res) {
  var restaurantId = req.params.restaurantId;
  Mapper.getOne(restaurantId)
    .then((map) => {
      res.write(JSON.stringify(map));
      res.end();
    })
    .catch((err) => {
      console.log('Error: ', err);
      res.end();
    });
});

let port = 3002;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});