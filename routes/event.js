require("dotenv").config();
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
let google = require("googleapis");
const googleAuth = require('google-auth-library');
const calendar = require("../config/calendar");

const googleMapsClient = require("@google/maps").createClient({
  key: process.env.MAPSAPI,
  Promise: Promise
});

router.get("/", (req, res, next) => {
  Event.find()
  .then( events => res.render("event/list", {events, user: req.user}))
  .catch( err => next(err) );
})

router.post("/new", (req, res, next) => {
  const { title, content, date, time, address } = req.body;
  console.log(date,time);
  let lat, lng;

  googleMapsClient.geocode({ address }).asPromise()
    .then(data => {
      lat = data.json.results[0].geometry.viewport.northeast.lat;
      lng = data.json.results[0].geometry.viewport.northeast.lng;

      const location = {
        type: "Point",
        coordinates: [lat, lng]
      };

      const newEvent = new Event({ title, description: content, date, time, location });
      calendar(newEvent);

      newEvent
        .save()
        .then(() => res.redirect("/event"))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get("/show/:id", (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
    .then(event => {
      googleMapsClient
        .reverseGeocode({
          latlng: [event.location.coordinates[0], event.location.coordinates[1]]
        })
        .asPromise()
        .then(data => data.json.results[0].formatted_address)
        .then(address => {
          res.render("event/show", { event, address });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get("/edit/:id", (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
    .then(event => {
      googleMapsClient
        .reverseGeocode({
          latlng: [event.location.coordinates[0], event.location.coordinates[1]]
        })
        .asPromise()
        .then(data => data.json.results[0].formatted_address)
        .then(address => {
          res.render("event/edit", { event, address });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.post("/edit/:id", (req, res, next) => {
  const id = req.params.id;

  const {title, description, date, location} = req.body;

  let newLocation = {};

  googleMapsClient.geocode({ address: location }).asPromise()
    .then(data => {

      lat = data.json.results[0].geometry.viewport.northeast.lat;
      lng = data.json.results[0].geometry.viewport.northeast.lng;

      newLocation = {
        type: "Point",
        coordinates: [lat, lng]
      };

      Event.findByIdAndUpdate(id, {title, description, date, location: newLocation})
      .then( () => res.redirect("/event"))
      .catch( err => next(err));
    })
    .catch(err => next(err));
})

router.get("/delete/:id", (req, res, next) => {
  const id = req.params.id;

  Event.findByIdAndRemove(id)
  .then( () => res.redirect("/event") )
  .catch( err => next(err) );
})

module.exports = router;
