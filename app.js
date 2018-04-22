require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");

mongoose.Promise = Promise;
mongoose
 .connect("mongodb://localhost/studentplatform")
 .then(() => {
   console.log("Connected to Awesome Project!");
 })
 .catch(err => {
   console.error("Error connecting to mongo", err);
 });
 
 const app_name = require("./package.json").name;
 const debug = require("debug")(
 `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
 session({
   secret: "i-drink-too-much-coffee-and-see-red-dragons",
   resave: true,
   saveUninitialized: true,
   store: new MongoStore({ mongooseConnection: mongoose.connection })
 })
);
require("./passport")(app);

// Express View engine setup

app.use(
 require("node-sass-middleware")({
   src: path.join(__dirname, "public"),
   dest: path.join(__dirname, "public"),
   sourceMap: true
 })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

hbs.registerHelper("ifUndefined", (value, options) => {
 if (arguments.length < 2)
   throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
 if (typeof value !== undefined) {
   return options.inverse(this);
 } else {
   return options.fn(this);
 }
});

app.locals.title = "Ironhack - Student Platform";
app.locals.brand = "http://localhost:3000/images/logo.png";
app.locals.avatar = "http://localhost:3000/images/avatar.png";

const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const postRoutes = require("./routes/post");
app.use("/post", postRoutes);

// catch 404 and render a not-found.hbs template
app.use((req, res, next) => {
 res.status(404);
 res.render('not-found');
});

app.use((err, req, res, next) => {
 // always log the error
 console.error('ERROR', req.method, req.path, err);

 // only render if the error ocurred before sending the response
 if (!res.headersSent) {
   res.status(500);
   res.render('error');
 }
});

module.exports = app;