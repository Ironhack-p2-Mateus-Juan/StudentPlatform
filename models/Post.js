const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    type: { type: String, default: "Post" },
    title: { type: String, required: true },
    content: { type: Object, required: true },
    thumb: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    imagePath: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
