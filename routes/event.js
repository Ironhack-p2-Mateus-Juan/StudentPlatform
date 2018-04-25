require("dotenv").config();
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
let google = require("googleapis");
const googleAuth = require("google-auth-library");
const calendarInsert = require("../config/calendar");
const calendarUpdate = require("../config/calendar-update");
const calendarDelete = require("../config/calendar-delete");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const uploadCloud = require("../config/cloudinary");

const googleMapsClient = require("@google/maps").createClient({
  key: process.env.MAPSAPI,
  Promise: Promise
});

router.get("/", (req, res, next) => {
  Event.find()
    .then(events => res.render("event/list", { events }))
    .catch(err => next(err));
});

router.post("/new", [ensureLoggedIn("/event"), uploadCloud.single("image")], (req, res, next) => {
  const { title, content, date, time, address } = req.body;

  const imagePath = req.file ? req.file.url : "";
  let lat, lng;

  googleMapsClient
    .geocode({ address })
    .asPromise()
    .then(data => {
      lat = data.json.results[0].geometry.viewport.northeast.lat;
      lng = data.json.results[0].geometry.viewport.northeast.lng;

      const location = {
        type: "Point",
        coordinates: [lat, lng]
      };

      const newEvent = new Event({
        title,
        description: content,
        date,
        time,
        location,
        imagePath
      });

      newEvent
        .save()
        .then(event => {
          calendarInsert(event)
            .then(id => {
              Event.findByIdAndUpdate(event.id, { eventId: id })
                .then(() => res.redirect("/event"))
                .catch(err => next(err));
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get("/show/:id", ensureLoggedIn("/event"), (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
    .populate("participants")
    .then(event => {
      googleMapsClient
        .reverseGeocode({
          latlng: [event.location.coordinates[0], event.location.coordinates[1]]
        })
        .asPromise()
        .then(data => data.json.results[0].formatted_address)
        .then(address => {
          res.render("event/show", { event, location:JSON.stringify(event), address });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get("/go/:event/:user", ensureLoggedIn("/event"), (req, res, next) => {
  const idEvent = req.params.event;
  const idUser = req.params.user;

  Event.findById(idEvent)
    .then(event => {
      event.participants.push(idUser);

      event.save()
      .then(newEvent => {

        User.findById(idUser)
        .then( user => {
          calendarUpdate(user.email, newEvent.eventId);
          res.redirect(`/event/show/${idEvent}`)
        })
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get("/edit/:id", ensureLoggedIn("/event"), (req, res, next) => {
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

router.post("/edit/:id", ensureLoggedIn("/event"), (req, res, next) => {
  const id = req.params.id;

  const { title, description, date, location } = req.body;

  let newLocation = {};

  googleMapsClient
    .geocode({ address: location })
    .asPromise()
    .then(data => {
      lat = data.json.results[0].geometry.viewport.northeast.lat;
      lng = data.json.results[0].geometry.viewport.northeast.lng;

      newLocation = {
        type: "Point",
        coordinates: [lat, lng]
      };

      Event.findByIdAndUpdate(id, {
        title,
        description,
        date,
        location: newLocation
      })
        .then(() => res.redirect("/event"))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get("/delete/:id", ensureLoggedIn("/event"), (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
  .then( event => {
    
    Event.findByIdAndRemove(event._id)
    .then( () => {
      calendarDelete(event.eventId);
      res.redirect("/event") 
    })
    .catch( err => next(err) );
  })
  .catch( err => next(err) );
});

module.exports = router;
