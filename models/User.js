const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
 {
   fullName: { type: String },
   username: { type: String },
   email: { type: String, required: true },
   password: { type: String, required: true },
   profileImg: { type: Object },
   bootcamp: {type: String, enum: ['Web', 'UX']}
 },
 {
   timestamps: {
     createdAt: "created_at",
     updatedAt: "updated_at"
   }
 }
);

const User = mongoose.model("User", userSchema);
module.exports = User;