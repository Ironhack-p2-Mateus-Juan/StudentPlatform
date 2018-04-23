require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("../models/Event");
const eventData = require("./event_data");

const dbURL = process.env.DBURL;

mongoose.connect(dbURL)
.then( () => {
  Event.collection.drop();

  Event.create(eventData)
  .then( () => {
    console.log("Events created");
    mongoose.disconnect();
  })
  .catch( err => console.log(err) );
})
