require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const userData = require("./user_data");

const Event = require("../models/Event");
const eventData = require("./event_data");

const dbURL = process.env.DBURL;

mongoose.connect(dbURL)
.then( () => {
  User.collection.drop();

  User.create(userData)
  .then( () => {
    console.log("Users created");
    mongoose.disconnect();
  })
  .catch( err => console.log(err) );
})
