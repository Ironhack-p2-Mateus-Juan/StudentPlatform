require("dotenv").config();
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
let google = require("googleapis");
google = google.google;
const googleAuth = require('google-auth-library');

var fs = require('fs');
var OAuth2 = google.auth.OAuth2;
//var googleAuth = require('google-auth-library');

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

const googleSecrets = JSON.parse(fs.readFileSync('./config/client_secret.json')).installed;
var oauth2Client = new OAuth2(
  googleSecrets.client_id,
  googleSecrets.client_secret,
  googleSecrets.redirect_uris[0]
);

const token = fs.readFileSync(TOKEN_PATH);
oauth2Client.setCredentials(JSON.parse(token));

var calendar = google.calendar('v3');

const googleMapsClient = require("@google/maps").createClient({
  key: process.env.MAPSAPI,
  Promise: Promise
});

<<<<<<< HEAD
=======
router.get("/", (req, res, next) => {
  Event.find()
    .then(events => res.render("event/list", { events }))
    .catch(err => next(err));
});

router.get("/new", (req, res, next) => {
  res.render("event/new");
});

>>>>>>> juan
router.post("/new", (req, res, next) => {
  const { title, description, date, address } = req.body;
  let lat, lng;

  googleMapsClient.geocode({ address }).asPromise()
    .then(data => {
      lat = data.json.results[0].geometry.viewport.northeast.lat;
      lng = data.json.results[0].geometry.viewport.northeast.lng;

      const location = {
        type: "Point",
        coordinates: [lat, lng]
      };

      const newEvent = new Event({ title, description, date, location });
      saveCalendar(newEvent);

      newEvent
        .save()
        .then(() => res.redirect("/event"))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

function saveCalendar(event) {
  googleMapsClient.reverseGeocode({latlng: [event.location.coordinates[0], event.location.coordinates[1]]}).asPromise()
  .then(data => data.json.results[0].formatted_address)
  .then(address => {
    
    const eventCalendar = {
      'summary': event.title,
      'location': address,
      'description': event.description,
      'start': {
        'dateTime': event.date + 'T10:00:00+02:00',
        'timeZone': 'Europe/Madrid',
      },
      'end': {
        'dateTime': event.date + 'T12:00:00+02:00',
        'timeZone': 'Europe/Madrid',
      },
      'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
      ],
      'attendees': event.participants,
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10},
        ],
      },
    }
    
    calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      resource: event,
    }, function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created');
    });
  })
  .catch(err => console.log(err));  
}

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
