require("dotenv").config();
var fs = require("fs");
var google = require("googleapis");
google = google.google;
var OAuth2 = google.auth.OAuth2;

var TOKEN_PATH = process.env.calendar_nodejs_quickstart;

const googleSecrets = JSON.parse(process.env.client_secret)
  .installed;
var oauth2Client = new OAuth2(
  googleSecrets.client_id,
  googleSecrets.client_secret,
  googleSecrets.redirect_uris[0]
);

oauth2Client.setCredentials(JSON.parse(TOKEN_PATH));

var calendar = google.calendar("v3");

module.exports = newEvent => {
  var event = {
    summary: newEvent.title,
    location: newEvent.location,
    description: newEvent.description,
    start: {
      dateTime: `${newEvent.date}T${newEvent.time}:00+02:00`,
      timeZone: "Europe/Madrid"
    },
    end: {
      dateTime: `${newEvent.date}T${newEvent.time}:00+02:00`,
      timeZone: "Europe/Madrid"
    },
    attendees: [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 }
      ]
    }
  };

  return new Promise((resolve, reject) => {
    calendar.events.insert(
      {
        auth: oauth2Client,
        calendarId: "primary",
        resource: event,
        sendNotifications: true
      },
      function(err, event) {
        if (err) {
          reject(err);
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        resolve(event.data.htmlLink.split("eid=")[1]);
      }
    );
  });
};
