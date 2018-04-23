require("dotenv").config();
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "studentPlatform",
  allowedFormats: ['jpg', 'png'],
  filename: (req, file, cb) => {
    const photo = new Date().getTime();
    cb(null, photo);
  }
});

const uploadCloud = multer({storage});
module.exports = uploadCloud;