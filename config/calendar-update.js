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

module.exports = (attendee, eventId) => {
  const event = calendar.events.get({ calendarId: "primary", eventId });

  if( event.attendees ) {
    event.attendees.push({email: attendee});
  } else {
    event.attendees = new Array({email: attendee});
  }

  event = calendar.events.patch( event, "primary", eventId, {
    sendNotifications: true
  });
};
