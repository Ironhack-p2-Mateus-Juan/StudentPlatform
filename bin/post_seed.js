require("dotenv").config();

const mongoose = require("mongoose");
const Post = require("../models/Post");
const postData = require("./post_data");

const dbURL = process.env.DBURL;

mongoose.connect(dbURL)
.then( () => {
  Post.collection.drop();

  Post.create(postData)
  .then( () => {
    console.log("Posts created");
    mongoose.disconnect();
  })
  .catch( err => console.log(err) );
})
