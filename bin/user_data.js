const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("1234", salt);

module.exports = [
  {
    fullName: "Usuario Apellido 1",
    username: "usuario1",
    email: "usuario1@prueba.com",
    password: hashPass,
    imgPath: "http://res.cloudinary.com/dg6pkjuui/image/upload/v1524405651/studentPlatform/1524405650554.png",
    bootcamp: "Web",
  },
  {
    fullName: "Usuario Apellido 2",
    username: "usuario2",
    email: "usuario2@prueba.com",
    password: hashPass,
    imgPath: "http://res.cloudinary.com/dg6pkjuui/image/upload/v1524405651/studentPlatform/1524405650554.png",
    bootcamp: "Web",
  },
  {
    fullName: "Usuario Apellido 3",
    username: "usuario3",
    email: "usuario3@prueba.com",
    password: hashPass,
    imgPath: "http://res.cloudinary.com/dg6pkjuui/image/upload/v1524405651/studentPlatform/1524405650554.png",
    bootcamp: "Web",
  },
  {
    fullName: "Usuario Apellido 4",
    username: "usuario4",
    email: "usuario4@prueba.com",
    password: hashPass,
    imgPath: "http://res.cloudinary.com/dg6pkjuui/image/upload/v1524405651/studentPlatform/1524405650554.png",
    bootcamp: "Web",
  },
  {
    fullName: "Usuario Apellido 5",
    username: "usuario5",
    email: "usuario5@prueba.com",
    password: hashPass,
    imgPath: "http://res.cloudinary.com/dg6pkjuui/image/upload/v1524405651/studentPlatform/1524405650554.png",
    bootcamp: "Web",
  },
  {
    fullName: "Usuario Apellido 6",
    username: "usuario6",
    email: "usuario6@prueba.com",
    password: hashPass,
    imgPath: "http://res.cloudinary.com/dg6pkjuui/image/upload/v1524405651/studentPlatform/1524405650554.png",
    bootcamp: "Web",
  }
]